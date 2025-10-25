import React, { useEffect, useState } from "react";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";

import Confirmacao from "./Tabs/Confirmacao";
import InformacoesAdicionais from "./Tabs/InformacoesAdicionais";
import { Box, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import StepIndicator from "../../Componentes/Step";
import PartialDrawer from "../../Componentes/Modal/Bottom";
import {
  formatCardInfo,
  formatCNPJ,
  formatCPF,
  formatMoney,
  formatPhone,
  getLocalItem,
  validarCampos,
} from "../../Componentes/Funcoes";
import {
  CustomInput,
  CustomSelect,
  LoadingBox,
} from "../../Componentes/Custom";
import { Rows } from "../../Componentes/Lista/Rows";
import PaymentSuccess from "../../Assets/Cobranca/payment_confirmed.svg";

import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";
import apiService from "../../Componentes/Api/axios";
import Cupom from "./Tabs/Cupom";
import Confirm from "../../Componentes/Alert/Confirm";
import Icon from "../../Assets/Emojis";

const Checkout = ({ alertCustom }) => {
  const { key, page } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("PIX"); // PIX, BOLETO, CREDIT_CARD
  const [openResumo, setOpenResumo] = useState(false);
  const [form, setForm] = useState({
    total_label: "",
    aviso_label: "Valor sujeito a taxas de transação",
    subtotal_label: "",
    desconto_label: "",
    parcelamento: null,
    total: 0,
    valor_base: 0,
    status: null,
    cupom: null,
    cupom_text: "",
    response: null,

    cpfCnpj: "",
    email: "",
    telefone: "",
  });

  const metodos = {
    PIX: {
      titulo: "Pix",
      icon: <PixIcon />,
    },
    BOLETO: {
      titulo: "Boleto",
      icon: (
        <img
          src={BarcodeIcon}
          style={{ filter: "invert(100%)", width: "24px" }}
        />
      ),
    },
    CREDIT_CARD: {
      titulo: "Cartão",
      icon: <CardIcon />,
    },
  };

  const [metodosPagamento, setMetodosPagamento] = useState([]);
  const [parcelas, _setParcelas] = useState({});
  const setParcelas = (value) =>
    _setParcelas((prev) => ({ ...prev, ...value }));

  const handleSubmit = async () => {
    await handleValidade()
      .then(async () => {
        const body = {
          paymentMethod: selectedMethod,
          discountId: form.cupom ? form.cupom.id : undefined,
        };

        if (selectedMethod === "CREDIT_CARD") {
          body.creditCard = {
            holderName: form.nome,
            number: form.numeroCartao,
            expiryMonth: form.validade.split("/")[0],
            expiryYear: form.validade.split("/")[1],
            ccv: form.cvv,
          };
          body.creditCardHolderInfo = {
            name: form.nome,
            email: form.email,
            cpfCnpj: form.cpfCnpj,
            postalCode: null,
            addressNumber: "0",
            addressComplement: "",
            phone: "",
            mobilePhone: form.telefone,
          };
          body.installments = form.parcelamento?.value || 1;
        }
        const payment = await apiService.query(
          "POST",
          `/payment/confirm/${key}`,
          body
        );
        setForm((prev) => ({ ...prev, response: payment }));
      })
      .catch((error) => {
        let message = error.message;

        if (error?.response?.data?.message) {
          const parts = error.response.data.message.split(": ");
          message = parts[parts.length - 1];
        }
        alertCustom(message || "Erro ao submeter o formulário!");
        throw new Error(error.message || "Erro ao submeter o formulário!");
      });
  };

  const validations = {
    dados_pessoais: [
      { campo: "email", validacoes: "required, minLength(10), email" },
      { campo: "cpfCnpj", validacoes: "required, minLength(14)" },
      { campo: "telefone", validacoes: "required, minLength(16), telefone" },
    ],
    metodo_pagamento: [
      ...(selectedMethod === "CREDIT_CARD"
        ? [
            {
              campo: "nome",
              label: "Nome do titular",
              validacoes: "required, minLength(10)",
            },
            {
              campo: "numeroCartao",
              label: "Número do cartão",
              validacoes: "required, minLength(19)",
            },
            { campo: "validade", validacoes: "required, minLength(5)" },
            {
              campo: "cvv",
              label: "CVV",
              validacoes: "required, minLength(3)",
            },
            {
              campo: "parcelamento",
              label: "Informar número de parcelas",
              validacoes: "required",
            },
          ]
        : []),
    ],
  };

  const handleValidade = async () => {
    await validarCampos(modal.tab, form, validations).catch((error) => {
      alertCustom(error.message || "Erro ao submeter o formulário!");
      throw new Error(error.message || "Erro ao submeter o formulário!");
    });
  };

  const pages = [
    {
      label: "Método",
      value: "metodo_pagamento",
      status: "done",
    },
    {
      label: "Dados",
      value: "dados_pessoais",
      status: "done",
      action: handleSubmit,
    },
    {
      label: "Pagamento",
      value: "pagamento",
      status: "done",
    },
    { label: "Confirmação", value: "confirmacao", status: "done" },
  ];

  const [modal, _setModal] = useState({
    tabIndex: 0,
    tab: pages[0].value,
    contextTab: null,
    open: true,
    method: null,
    loading: false,
    onClose: () => navigate(-1),
    actionText: "Próximo",
    descricoes: null,
    items: [],
    errorCode: null,
  });
  const setModal = (value) => {
    _setModal((prev) => ({ ...prev, ...value }));
  };

  const handleGetPayment = async () => {
    try {
      const { itens, formasPagamento, total } = await apiService.query(
        "GET",
        `/payment/transaction/${key}`
      );

      const { status, observacoes } = await apiService.query(
        "GET",
        `/payment/checkout-payment-status/${key}`
      );
      if (status === "PAGO")
        throw new Error(observacoes || "Pagamento já realizado!");

      if (status === "VENCIDO")
        throw new Error(observacoes || "Pagamento já realizado!");

      const titulos_label = {
        PIX: "Pagamento via Pix",
        BOLETO: "Pagamento via Boleto",
        CREDIT_CARD: "Pagamento via Cartão de Crédito",
      };

      const subtitulos_label = {
        PIX: ({ horas }) =>
          `Você poderá pagar em até ${horas} horas após a geração do QR Code.`,
        BOLETO: ({ dias }) =>
          `A confirmação pode levar até ${dias} dias úteis após o pagamento.`,
        CREDIT_CARD: ({ numParcelasMaximo }) =>
          `Informe os dados do cartão e parcele em até ${numParcelasMaximo} vezes`,
      };
      setModal({
        items: itens.map((item, index) => ({
          id: index,
          subtitulo: `${formatMoney(item.preco, "d")}   ${
            item.observacao || ""
          }`,
          titulo: item.titulo,
          preco: item.preco,
        })),
      });

      setMetodosPagamento(
        formasPagamento
          .filter(({ metodo }) => Object.keys(metodos).includes(metodo))
          .map(({ metodo, parcelas, numParcelasMaximo }, index) => {
            _setModal((prev) => ({
              ...prev,
              descricoes: {
                ...prev.descricoes,
                [metodo]: {
                  titulo: titulos_label[metodo],
                  subtitulo: subtitulos_label[metodo]({
                    numParcelasMaximo,
                    horas: 24,
                    dias: 2,
                  }),
                },
              },
            }));

            setParcelas({
              [metodo]: parcelas.map((p) => ({
                label: `${p.prest}x de R$ ${Number(p.valor).toFixed(2)}`,
                value: p.prest,
                total: Number(p.valor) * p.prest,
                valor_base: Number(p.valor) * p.prest,
              })),
            });
            setSelectedMethod(metodo);

            return {
              id: index,
              value: metodo,
              ...metodos[metodo],
              parcelas: parcelas,
              total,
            };
          })
      );

      setForm((prev) => ({
        ...prev,
        total_label: `Total ${formatMoney(total, "d")}`,
        valor_base: total,
        total,
      }));
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ||
          error.message ||
          "Erro ao buscar pagamento pendente"
      );
      setModal({ loading: false, errorCode: true });
    }
  };

  useEffect(() => {
    let baseTotal = form.parcelamento?.total || form.valor_base;

    if (baseTotal) {
      const valorFinal = form.cupom
        ? form.cupom.getValue(baseTotal)
        : baseTotal;

      setForm((prev) => ({
        ...prev,
        desconto_label: form.cupom ? `Desconto ${form.cupom.valor_label}` : "",
        subtotal_label: `Subtotal ${formatMoney(baseTotal, "d")}`,
        total_label: `Total ${formatMoney(valorFinal, "d")}`,
        total: valorFinal,
      }));
    }
  }, [selectedMethod, form.parcelamento, form.cupom]);

  useEffect(() => {
    if (!page) {
      navigate(`/checkout/${key}/${pages[0].value}`, { replace: true });
      return;
    }

    const foundIndex = pages.findIndex((p) => p.value === page);

    if (foundIndex === -1) {
      navigate("/dashboard");
      return;
    }

    if (modal.contextTab === null) {
      handleGetPayment();
      navigate(`/checkout/${key}/${pages[0].value}`, { replace: true });
    }

    setModal({
      contextTab: foundIndex,
      tabIndex: foundIndex,
      tab: pages[foundIndex].value,
      actionText: foundIndex === pages.length - 1 ? "Finalizar" : "Próximo",
    });
  }, [page, key]);

  const handleChange = (e) => {
    let valor = e.target.value;
    if (e.target.name === "numeroCartao")
      valor = formatCardInfo(valor, "numero");
    if (e.target.name === "validade") valor = formatCardInfo(valor, "data");
    if (e.target.name === "cpfCnpj")
      valor =
        valor.replace(/\D/g, "").length > 11
          ? formatCNPJ(valor)
          : formatCPF(valor);
    if (e.target.name === "telefone") valor = formatPhone(valor);
    if (e.target.name === "cvv") valor = valor.slice(0, 3);

    setForm((prev) => ({ ...prev, [e.target.name]: valor }));
  };

  const handleNext = async () => {
    try {
      if (modal.tabIndex < pages.length - 1) {
        if (pages[modal.tabIndex].action) await pages[modal.tabIndex].action();

        const nextPage = pages[modal.tabIndex + 1].value;
        navigate(`/checkout/${key}/${nextPage}`);
      } else {
        navigate(
          getLocalItem("accessType") === "user" ? "/home" : "/dashboard"
        );
      }
    } catch (error) {
      console.error("Erro ao avançar:", error);
    }
  };

  const handleBack = () => {
    if (modal.tabIndex > 0) {
      const prevPage = pages[modal.tabIndex - 1].value;
      navigate(`/checkout/${key}/${prevPage}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex !== modal.tabIndex) {
      const stepValue = pages[stepIndex].value;
      navigate(`/checkout/${key}/${stepValue}`);
    }
  };

  const applyDescount = async () => {
    if (!form.cupom_text) {
      return alertCustom("Digite um cupom válido");
    } else if (form.cupom) {
      return alertCustom("Cupom já aplicado");
    }

    await apiService
      .query("POST", `/discount/validate`, {
        codigo: form.cupom_text,
        establishmentId:
          getLocalItem("establishmentId")?.toString() || undefined,
        userId: getLocalItem("userId")?.toString() || undefined,
      })
      .then(({ valid, discount: { id, tipo, valor }, message }) => {
        if (!valid) {
          alertCustom("Cupom inválido ou expirado");
          return;
        }
        setForm((prev) => ({
          ...prev,
          cupom_text: "",
          cupom: {
            id,
            valor_label:
              tipo === "PERCENTUAL"
                ? `${-valor}%`
                : `${formatMoney(-valor, "d")}`,
            value: prev.cupom_text,
            getValue: (total) =>
              tipo === "PERCENTUAL"
                ? total - total * (valor / 100)
                : total - valor,
          },
        }));
        alertCustom(message);
      })
      .catch((error) => {
        console.error("Erro ao aplicar cupom:", error);
        alertCustom("Cupom inválido ou expirado");
      });
  };

  const handleRemoveDescount = () =>
    modal.tab === "metodo_pagamento" &&
    setForm((prev) => ({
      ...prev,
      cupom: null,
      cupom_text: "",
      total_label: `Total ${formatMoney(prev.valor_base, "d")}`,
      desconto_label: "",
      subtotal_label: `Subtotal ${formatMoney(prev.valor_base, "d")}`,
      total: prev.valor_base,
    }));

  const onConfirm = (data, success = true) => {
    if (!success) handleNext();
  };

  return (
    <Modal
      open={modal.open}
      component="view"
      fullScreen="all"
      maxWidth="lg"
      loading={modal.loading}
      onClose={() =>
        navigate(getLocalItem("accessType") === "user" ? "/home" : "/dashboard")
      }
      onAction={
        modal.status != "PAGO" &&
        modal.tab != "pagamento" &&
        !modal.errorCode &&
        handleNext
      }
      loadingButton={modal.loading}
      actionText={modal.actionText}
      backAction={{
        action:
          modal.tab === "confirmacao" ? () => navigate("/home") : handleBack,
        titulo: "Voltar",
      }}
      buttons={[
        {
          sx: { display: { xs: "block", md: "none" } },
          titulo: "Resumo do pedido",
          action: () => setOpenResumo(!openResumo),
          variant: "outlined",
          color: "terciary",
        },
      ]}
    >
      <PartialDrawer
        open={openResumo}
        onClose={() => setOpenResumo(!openResumo)}
        title={"Mais detalhes"}
      >
        <InformacoesAdicionais orderDetails={modal.items} />
      </PartialDrawer>

      <Grid container spacing={4} justifyContent="space-between">
        {modal.errorCode ? (
          <>
            <Confirm
              open={true}
              onClose={() => navigate(-1)}
              onConfirm={() => navigate("/dashboard/support")}
              title="Este pagamento não está disponível"
              message="Está com dificuldade de realizar algum pagamento? Favor, entre em contato com o suporte"
              cancelText="Voltar"
              confirmText="suporte"
            />
          </>
        ) : (
          <>
            {" "}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Finalizar Pedido</Typography>
                <StepIndicator
                  steps={pages}
                  currentStep={modal.tabIndex}
                  onChange={handleStepClick}
                />

                <Cupom
                  tab={modal.tab}
                  form={form}
                  handleChange={handleChange}
                  applyDescount={applyDescount}
                  onRemoveDescount={handleRemoveDescount}
                />

                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <InformacoesAdicionais orderDetails={modal.items}>
                    {form.total_label ? (
                      <Typography variant="h6">
                        <span>{form.total_label}</span>{" "}
                        <Stack>
                          <Typography variant="body2" component="span">
                            {" "}
                            {form.subtotal_label}
                          </Typography>
                          <Typography variant="body2" component="span">
                            {" "}
                            {form.desconto_label}{" "}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="span"
                          >
                            {" "}
                            {form.aviso_label}
                          </Typography>
                        </Stack>
                      </Typography>
                    ) : (
                      <LoadingBox
                        message={"Carregando informações..."}
                        disableSpacing
                        sx={{ py: 1.68 }}
                      />
                    )}
                  </InformacoesAdicionais>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={2}>
                {modal.tab === "dados_pessoais" && (
                  <>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="h6" className="show-box">
                        Confirme seus dados
                        <Typography variant="body1">
                          Verifique a veracidade dos seus dados ou do pagador
                          antes de prosseguir.
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <CustomInput
                        fullWidth
                        placeholder="E-mail do titular"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 0, md: 4 }}></Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <CustomInput
                        fullWidth
                        placeholder="CPF ou CNPJ do titular"
                        name="cpfCnpj"
                        value={form.cpfCnpj || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <CustomInput
                        fullWidth
                        placeholder="Telefone do titular"
                        name="telefone"
                        value={form.telefone || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}

                {modal.tab === "metodo_pagamento" && (
                  <>
                    <Grid size={{ xs: 12, md: 8 }} order={{ xs: 2, md: 1 }}>
                      <Grid container spacing={2}>
                        {modal.descricoes && selectedMethod && (
                          <Grid size={12}>
                            <Typography variant="h6" className="show-box">
                              {modal.descricoes[selectedMethod]?.titulo}
                              <Typography variant="body1">
                                {modal.descricoes[selectedMethod]?.subtitulo}
                              </Typography>
                            </Typography>
                          </Grid>
                        )}
                        {selectedMethod === "CREDIT_CARD" && (
                          <>
                            <Grid size={12}>
                              <CustomInput
                                fullWidth
                                placeholder="Nome do titular do cartão"
                                name="nome"
                                value={form.nome || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={12}>
                              <CustomInput
                                fullWidth
                                placeholder="Número do Cartão"
                                name="numeroCartao"
                                value={form.numeroCartao || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={6}>
                              <CustomInput
                                fullWidth
                                placeholder="Validade (MM/AA)"
                                name="validade"
                                value={form.validade || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={6}>
                              <CustomInput
                                fullWidth
                                placeholder="CVV"
                                name="cvv"
                                value={form.cvv || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <CustomSelect
                                fullWidth
                                placeholder="Parcelamento"
                                value={form.parcelamento?.value || ""}
                                onChange={(e) => {
                                  const selected = (
                                    parcelas[selectedMethod] || []
                                  ).find((p) => p.value === e.target.value);
                                  setForm((prev) => ({
                                    ...prev,
                                    parcelamento: selected || null,
                                  }));
                                }}
                                options={parcelas[selectedMethod] || []}
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} order={{ xs: 1, md: 2 }}>
                      <Rows
                        checkmode={false}
                        unSelectMode={true}
                        styleSelect={{ background: "#0195F7" }}
                        selectedItems={metodosPagamento.filter((item) => {
                          console.log(item.value, selectedMethod);
                          return item.value === selectedMethod;
                        })}
                        onSelect={(e) => setSelectedMethod(e.value)}
                        items={metodosPagamento}
                        spacing={2}
                      />
                    </Grid>
                  </>
                )}

                {modal.tab === "pagamento" && (
                  <Grid size={12}>
                    <Confirmacao
                      info={form.response}
                      alertCustom={alertCustom}
                      onConfirm={onConfirm}
                    />
                  </Grid>
                )}
                {modal.tab === "confirmacao" && (
                  <>
                    <Grid size={12} className="justify-center">
                      <img style={{ width: "300px" }} src={PaymentSuccess} />
                    </Grid>
                    <Grid size={12} sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="h6">
                        Seu pagamento foi confirmado!{" "}
                        <Typography variant="body1">
                          Você já pode sair desta tela, um comprovante foi
                          enviado ao e-mail cadastrado.
                        </Typography>{" "}
                      </Typography>{" "}
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Modal>
  );
};

export default Checkout;
