import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";

import InformacoesAdicionais from "./Tabs/InformacoesAdicionais";
import {
  Box,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StepIndicator from "../../../Componentes/Step";
import PartialDrawer from "../../../Componentes/Modal/Bottom";
import {
  formatCardInfo,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatMoney,
  formatPhone,
  getLocalItem,
  validarCampos,
} from "../../../Componentes/Funcoes";
import {
  CustomInput,
  CustomSelect,
  LoadingBox,
} from "../../../Componentes/Custom";
import { Rows } from "../../../Componentes/Lista/Rows";
import PaymentSuccess from "../../../Assets/Cobranca/payment_confirmed.svg";

import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";
import apiService from "../../../Componentes/Api/axios";
import Confirm from "../../../Componentes/Alert/Confirm";
import Icon from "../../../Assets/Emojis";

const Checkout = ({ alertCustom }) => {
  const { planId: key, page } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("PIX"); // PIX, BOLETO, CREDIT_CARD
  const [openResumo, setOpenResumo] = useState(false);
  const [form, setForm] = useState({
    total_label: "",
    pedido_label: "",
    subtotal_label: "",
    total: 0,
    valor_base: 0,
    status: null,
    response: null,

    nome: "",
    cnpj: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    cnpj: "",
    bairro: "",
    cidade: "",
    estado: "",
    meAsEmployee: true,
    logradouro: "",

    nomeTitular: "",
    numeroCartao: "",
    validade: "",
    cvv: "",
    cep: "",
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

  const handleSubmit = async () => {
    await handleValidade()
      .then(async () => {
        try {
          const data = await apiService.query(
            "GET",
            `/user/profile/${getLocalItem("userId")}`
          );

          const { cnpj, bairro, cidade, estado, meAsEmployee, logradouro } =
            form;
          const body = {
            nome: form.nome,
            formaPagamento: selectedMethod,
            administrador: data.telefone,
            funcionarios: meAsEmployee ? [data.telefone] : [],
            endereco: [bairro, cidade, estado, logradouro].join(", "),
            telefone: form.telefone.replace(/\D/g, ""),
            cnpj: cnpj.replace(/\D/g, ""),
            planId: +key,
          };

          if (selectedMethod === "CREDIT_CARD") {
            body.creditCard = {
              holderName: form.nomeTitular,
              number: form.numeroCartao.replace(/\D/g, ""),
              expiryMonth: form.validade.split("/")[0],
              expiryYear: "20" + form.validade.split("/")[1],
              ccv: form.cvv,
            };
            body.creditCardHolderInfo = {
              name: form.nomeTitular,
              email: form.email,
              cpfCnpj: form.cpfCnpj.replace(/\D/g, ""),
              postalCode: form.cep.replace(/\D/g, ""),
              addressNumber: "0",
              addressComplement: [bairro, cidade, estado, logradouro].join(
                ", "
              ),
              phone: form.telefone.replace(/\D/g, "").replace("55", ""),
              mobilePhone: form.telefone.replace(/\D/g, "").replace("55", ""),
            };
          }
          const finalBody = Object.keys(body).reduce((acc, key) => {
            acc[key] = body[key].trim();
            return acc;
          }, {});

          await apiService.query("POST", "/establishment", finalBody);
          localStorage.clear();
          alertCustom("Faça login novamente para começar!");
          navigate("/login");
        } catch (error) {
          console.error("Erro ao confirmar pagamento:", error);
          throw new Error(
            error?.response?.data?.message || "Erro ao confirmar pagamento"
          );
        }
      })
      .catch((error) => {
        alertCustom(error.message || "Erro ao submeter o formulário!");
        throw new Error(error.message || "Erro ao submeter o formulário!");
      });
  };

  const validations = {
    informacoes: [
      {
        label: "Nome do local",
        campo: "nome",
        validacoes: "required, minLength(5)",
      },
      {
        label: "Telefone",
        campo: "telefone",
        validacoes: "required, minLength(16), telefone",
      },

      {
        label: "CNPJ",
        campo: "cnpj",
        validacoes: "required, minLength(14), cnpj",
      },
      { campo: "estado", validacoes: "required, minLength(1)" },
      { campo: "cidade", validacoes: "required, minLength(1)" },
      { campo: "bairro", validacoes: "required, minLength(1)" },
      { campo: "cep", validacoes: "required, minLength(8)" },
      { campo: "logradouro", validacoes: "required, minLength(1)" },
    ],
    metodo_pagamento: [
      ...(selectedMethod === "CREDIT_CARD"
        ? [
            {
              label: "Seu e-mail",
              campo: "email",
              validacoes: "required, minLength(10), email",
            },
            {
              campo: "nomeTitular",
              label: "Nome do titular",
              validacoes: "required, minLength(10)",
            },
            {
              campo: "cpfCnpj",
              label: "CPF ou CNPJ do titular",
              validacoes: "required, minLength(14), cnpj",
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
              campo: "cep",
              label: "CEP",
              validacoes: "required, minLength(8)",
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
      label: "Informações",
      value: "informacoes",
      status: "done",
      action: handleValidade,
    },
    {
      label: "Método de pagamento",
      value: "metodo_pagamento",
      status: "done",
      action: handleSubmit,
    },
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
      const data = await apiService.query("GET", `/plan`);
      const teste = await apiService.query("GET", `/plan/prices/${key}`);
      const plano = data.find((p) => p.id === Number(key));

      if (!plano) throw new Error("Plano não encontrado");

      const titulos_label = {
        PIX: "Pagamento via Pix",
        BOLETO: "Pagamento via Boleto",
        CREDIT_CARD: "Pagamento via Cartão de Crédito",
      };

      const subtitulos_label = {
        PIX: `Pagamentos mensais.`,
        BOLETO: `A confirmação pode levar até 2 dias úteis após o pagamento.`,
        CREDIT_CARD: `Informe os dados do cartão para cobranças automáticas. `,
      };
      setModal({
        items: plano.produtosContratados.map(({ id, descricao, nome }) => ({
          id: id,
          subtitulo: descricao,
          titulo: nome,
        })),
      });

      setMetodosPagamento(
        ["PIX", "BOLETO", "CREDIT_CARD"].map((metodo, index) => {
          _setModal((prev) => ({
            ...prev,
            descricoes: {
              ...prev.descricoes,
              [metodo]: {
                titulo: titulos_label[metodo],
                subtitulo: subtitulos_label[metodo],
              },
            },
          }));

          return {
            id: index,
            value: metodo,
            ...metodos[metodo],
            total: plano.preco,
          };
        })
      );

      setForm((prev) => ({
        ...prev,
        pedido_label: plano.nome,
        total_label: `Total ${formatMoney(plano.preco, "d")}`,
        valor_base: Number(plano.preco),
        total: Number(plano.preco),
      }));
    } catch (error) {
      console.error("Erro ao buscar dados da assinatura:", error);
      alertCustom(
        error?.response?.data?.message || "Erro ao buscar dados da assinatura"
      );
      setModal({ loading: false, errorCode: true });
    }
  };

  useEffect(() => {
    let baseTotal = form.valor_base;

    if (baseTotal) {
      const valorFinal = baseTotal;

      setForm((prev) => ({
        ...prev,
        subtotal_label: `Subtotal ${formatMoney(baseTotal, "d")}`,
        total_label: `Total ${formatMoney(valorFinal, "d")}`,
        total: valorFinal,
      }));
    }
  }, [selectedMethod]);

  useEffect(() => {
    if (!page) {
      navigate(`/onboard/${key}/${pages[0].value}`, { replace: true });
      return;
    }

    const foundIndex = pages.findIndex((p) => p.value === page);

    if (foundIndex === -1) {
      navigate("/plans");
      return;
    }

    if (modal.contextTab === null) {
      handleGetPayment();
      navigate(`/onboard/${key}/${pages[0].value}`, { replace: true });
    }

    setModal({
      contextTab: foundIndex,
      tabIndex: foundIndex,
      tab: pages[foundIndex].value,
      actionText: foundIndex === pages.length - 1 ? "Finalizar" : "Próximo",
    });
  }, [page, key]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    var valor = value;

    if (name === "numeroCartao") valor = formatCardInfo(valor, "numero");
    if (name === "validade") valor = formatCardInfo(valor, "data");
    if (name === "cpfCnpj")
      valor =
        valor.replace(/\D/g, "").length > 11
          ? formatCNPJ(valor)
          : formatCPF(valor);
    if (name === "telefone") valor = formatPhone(valor);
    if (name === "cvv") valor = valor.slice(0, 3);
    if (name === "cnpj") valor = formatCNPJ(valor);
    if (name === "cep") valor = formatCEP(valor);
    if (name === "meAsEmployee") valor = checked;

    setForm((prev) => ({ ...prev, [name]: valor }));
  };

  const handleNext = async () => {
    try {
      if (modal.tabIndex <= pages.length - 1) {
        if (pages[modal.tabIndex].action)
          await pages[modal.tabIndex].action().catch((error) => {
            throw new Error("Erro ao avançar: " + error.message);
          });

        const nextPage = pages[modal.tabIndex + 1].value;
        navigate(`/onboard/${key}/${nextPage}`);
      }
    } catch (error) {
      console.error("Erro ao avançar:", error);
    }
  };

  const handleBack = () => {
    if (modal.tabIndex > 0) {
      const prevPage = pages[modal.tabIndex - 1].value;
      navigate(`/onboard/${key}/${prevPage}`);
    } else {
      navigate("/plans");
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex !== modal.tabIndex) {
      const stepValue = pages[stepIndex].value;
      navigate(`/onboard/${key}/${stepValue}`);
    }
  };

  const handleRemoveDescount = () =>
    modal.tab === "metodo_pagamento" &&
    setForm((prev) => ({
      ...prev,
      total_label: `Total ${formatMoney(prev.valor_base, "d")}`,
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
        navigate(
          getLocalItem("accessType") === "client" ? "/plans" : "/dashboard"
        )
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
        <InformacoesAdicionais orderDetails={modal.items} />
      </PartialDrawer>

      <Grid container spacing={4} justifyContent="space-between">
        {modal.errorCode ? (
          <>
            <Confirm
              open={true}
              onClose={() => navigate(-1)}
              onConfirm={() => navigate("/faq")}
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
                <Typography variant="h5">Contratar plano</Typography>
                <StepIndicator
                  steps={pages}
                  currentStep={modal.tabIndex}
                  onChange={handleStepClick}
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
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="span"
                          >
                            {" "}
                            {form.pedido_label}
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
                {modal.tab === "informacoes" && (
                  <>
                    {" "}
                    <Grid size={12}>
                      <Typography variant="h6" className="show-box">
                        <Icon>🎁</Icon> Benefícios
                        <Typography variant="body1">
                          Ao fazer seu cadastro você testa durante o mês todo as
                          principais funcionalidades do sistema sem compromisso
                          algum! Inicie agora mesmo e veja diferença na sua
                          rotina e visibilidade!
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Nome do estabelecimento"
                        value={form.nome}
                        name="nome"
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Telefone"
                        value={form.telefone}
                        name="telefone"
                        onChange={handleChange}
                        variant="outlined"
                        type="tel"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="CNPJ"
                        value={form.cnpj}
                        name="cnpj"
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>{" "}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Estado"
                        placeholder="Exemplo: Goiás"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Cidade"
                        placeholder="Exemplo: Goiânia"
                        name="cidade"
                        value={form.cidade}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Bairro"
                        placeholder="Exemplo: Jabuti"
                        name="bairro"
                        value={form.bairro}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="Logradouro"
                        placeholder="Exemplo: Rua 1"
                        name="logradouro"
                        value={form.logradouro}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
                      <CustomInput
                        fullWidth
                        label="CEP"
                        placeholder="74000000"
                        name="cep"
                        value={form.cep}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="meAsEmployee"
                            checked={form.meAsEmployee}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Sou funcionário também"
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
                            {" "}
                            <Grid size={6}>
                              <CustomInput
                                fullWidth
                                placeholder="E-mail"
                                name="email"
                                value={form.email || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={6}>
                              <CustomInput
                                fullWidth
                                placeholder="CPF ou CNPJ do titular"
                                name="cpfCnpj"
                                value={form.cpfCnpj || ""}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid size={12}>
                              <CustomInput
                                fullWidth
                                placeholder="Nome do titular do cartão"
                                name="nomeTitular"
                                value={form.nomeTitular || ""}
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
                          </>
                        )}
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
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Modal>
  );
};

export default Checkout;
