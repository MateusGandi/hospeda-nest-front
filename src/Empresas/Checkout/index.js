import React, { useEffect, useState } from "react";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";

import Confirmacao from "./Tabs/Confirmacao";
import InformacoesAdicionais from "./Tabs/InformacoesAdicionais";
import {
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import StepIndicator from "../../Componentes/Step";
import PartialDrawer from "../../Componentes/Modal/Bottom";
import {
  formatCardInfo,
  formatCNPJ,
  formatCPF,
  formatPhone,
  getLocalItem,
  isMobile,
} from "../../Componentes/Funcoes";
import { CustomInput, CustomSelect } from "../../Componentes/Custom";
import { Rows } from "../../Componentes/Lista/Rows";
import PaymentSuccess from "../../Assets/Cobranca/payment_confirmed.svg";

import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";
import apiService from "../../Componentes/Api/axios";
import Cupom from "./Tabs/Cupom";

const Checkout = ({ alertCustom }) => {
  const { key, page } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("PIX"); // PIX, BOLETO, CREDIT_CARD
  const [openResumo, setOpenResumo] = useState(false);
  const [form, setForm] = useState({
    total_label: "Total R$ 0,00",
    pedido_label: "Pedido #123123331553",
    total: 0,
    parcelamento: "",
    cupons: [],
    cupomId: null,
    status: null,
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
    try {
      const body = {
        paymentMethod: selectedMethod,
        discountId: form.cupomId || null,
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
      }
      await apiService.query("POST", `/payment/confirm/${key}`, body);
    } catch (error) {}
  };

  const pages = [
    {
      label: "Dados",
      value: "dados_pessoais",
      status: "done",
    },
    {
      label: "Método",
      value: "metodo_pagamento",
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
    descricoes: {},
  });
  const setModal = (value) => {
    _setModal((prev) => ({ ...prev, ...value }));
  };

  const handleGetPayment = async () => {
    try {
      const { itens, formasPagamento, transacao, total, instituicao, foto } =
        await apiService.query("GET", `/payment/transaction/${key}`);

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

      setMetodosPagamento(
        formasPagamento
          .filter(({ metodo }) => Object.keys(metodos).includes(metodo))
          .map(({ metodo, parcelas, numParcelasMaximo }, index) => {
            _setModal((prev) => ({
              ...prev,
              descricoes: {
                ...prev.descricoes,
                [metodo]: {
                  titulo: titulos_label[metodo].titulo,
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
                label: `${p.prest}x de R$ ${p.valor.toFixed(2)}`,
                value: p.prest,
              })),
            });
            console.log({
              [metodo]: parcelas.map((p) => ({
                label: `${p.prest}x de R$ ${p.valor.toFixed(2)}`,
                value: p.prest,
              })),
            });

            return {
              id: index,
              value: metodo,
              ...metodos[metodo],
              parcelas: parcelas,
              total,
            };
          })
      );
    } catch (error) {
      console.error("Erro ao buscar pagamento pendente:", error);
      alertCustom(error.message || "Erro ao buscar pagamento pendente");
    }
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      total_label: "Total R$ 0,00",
      pedido_label: "Pedido #123123331553",
      total: 0,
    }));
  }, [selectedMethod, form.parcelamento]);

  useEffect(() => {
    handleGetPayment();
    if (!page) {
      navigate(`/checkout/${key}/${pages[0].value}`, { replace: true });
      return;
    }

    const foundIndex = pages.findIndex((p) => p.value === page);

    if (foundIndex === -1) {
      navigate("/dashboard");
      return;
    }

    if (modal.contextTab == null) {
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
        if (pages[modal.tabIndex].action)
          await pages[modal.tabIndex].action().catch((error) => {
            throw new Error("Erro ao avançar: " + error.message);
          });

        const nextPage = pages[modal.tabIndex + 1].value;
        navigate(`/checkout/${key}/${nextPage}`);
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
    if (!form.cupom) {
      alertCustom("Digite um cupom válido");
      return;
    }

    await apiService
      .query("POST", `/discount/validate`, {
        codigo: form.cupom,
        establishmentId: getLocalItem("establishmentId"),
      })
      .then((response) => {
        //trocar valor da compra

        setForm((prev) => ({
          ...prev,
          cupom: "",
          cupons: [
            ...prev.cupons,
            { id: prev.cupons.length - 1, value: prev.cupom },
          ],
        }));
      })
      .catch((error) => {
        console.error("Erro ao aplicar cupom:", error);
        alertCustom("Cupom inválido ou expirado");
      });
  };

  const handleRemoveDescount = (id) => {
    //lógica para remover o desconto do valor da compra
    setForm((prev) => ({
      ...prev,
      cupons: prev.cupons.filter((cupom) => cupom.id !== id),
    }));
  };

  const onConfirm = (data, success = true) => {
    if (success) handleNext();
  };

  return (
    <Modal
      open={modal.open}
      component="view"
      fullScreen="all"
      maxWidth="lg"
      loading={modal.loading}
      onClose={handleBack}
      onAction={modal.status != "OK" && modal.tab != "pagamento" && handleNext}
      actionText={modal.actionText}
      backAction={{
        action: handleBack,
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
        <InformacoesAdicionais />
      </PartialDrawer>

      <Grid container spacing={4} justifyContent="space-between">
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
              <InformacoesAdicionais>
                <Typography variant="h6">
                  {form.total_label}
                  <Typography variant="body2" color="textSecondary">
                    {form.pedido_label}
                  </Typography>
                </Typography>
              </InformacoesAdicionais>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2}>
            {modal.tab === "dados_pessoais" && (
              <>
                {" "}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h6" className="show-box">
                    Confirme seus dados
                    <Typography variant="body1">
                      Verifique a veracidade dos seus dados ou do pagador antes
                      de prosseguir.
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
                          {modal.descricoes[selectedMethod].titulo}
                          <Typography variant="body1">
                            {modal.descricoes[selectedMethod].subtitulo}
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
                            value={form.parcelamento}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                parcelamento: e.target.value,
                              }))
                            }
                            options={parcelas[selectedMethod] || []}
                          />
                        </Grid>
                      </>
                    )}{" "}
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} order={{ xs: 1, md: 2 }}>
                  <Rows
                    checkmode={false}
                    unSelectMode={true}
                    styleSelect={{ background: "#0195F7" }}
                    selectedItems={metodosPagamento.filter(
                      (item) => item.value === selectedMethod
                    )}
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
                  form={form}
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
                      Você já pode sair desta tela, um comprovante foi enviado
                      ao e-mail cadastrado.
                    </Typography>{" "}
                  </Typography>{" "}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Checkout;
