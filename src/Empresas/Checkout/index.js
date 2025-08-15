import React, { useEffect, useState } from "react";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";

import Confirmacao from "./Tabs/Confirmacao";
import InformacoesAdicionais from "./Tabs/InformacoesAdicionais";
import { Box, Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import StepIndicator from "../../Componentes/Step";
import PartialDrawer from "../../Componentes/Modal/Bottom";
import { formatCardInfo, isMobile } from "../../Componentes/Funcoes";
import { CustomInput } from "../../Componentes/Custom";
import { Rows } from "../../Componentes/Lista/Rows";

import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";

const Checkout = ({ alertCustom }) => {
  const { key, page } = useParams();
  const navigate = useNavigate();

  const items = [
    { id: 0, titulo: "Pix", value: "PIX", icon: <PixIcon /> },
    {
      id: 1,
      titulo: "Boleto",
      value: "BOLETO",
      icon: (
        <img
          src={BarcodeIcon}
          style={{ filter: "invert(100%)", width: "24px" }}
        />
      ),
    },
    { id: 2, titulo: "Cartão", value: "CARTAO", icon: <CardIcon /> },
  ];

  const pages = [
    { label: "Pagamento", value: "pagamento" },
    { label: "Descontos", value: "cupom" },
    { label: "Confirmação", value: "confirmacao" },
  ];

  const [selectedMethod, setSelectedMethod] = useState("PIX"); // PIX, BOLETO, CARTAO
  const [openResumo, setOpenResumo] = useState(false);
  const [form, setForm] = useState({
    total_label: "Total R$ 0,00",
    pedido_label: "Pedido #123123331553",
    total: 0,
  });
  const [modal, _setModal] = useState({
    tabIndex: 0,
    tab: pages[0].value,
    open: true,
    method: null,
    loading: false,
    onClose: () => navigate(-1),
    actionText: "Próximo",
  });

  const setModal = (value) => {
    _setModal((prev) => ({ ...prev, ...value }));
  };

  const handleChange = (e) => {
    let valor = e.target.value;
    if (e.target.name === "numeroCartao")
      valor = formatCardInfo(valor, "numero");
    if (e.target.name === "validade") valor = formatCardInfo(valor, "data");
    if (e.target.name === "cvv") valor = valor.slice(0, 3);

    setForm((prev) => ({ ...prev, [e.target.name]: valor }));
  };

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

    setModal({
      tabIndex: foundIndex,
      tab: pages[foundIndex].value,
      actionText: foundIndex === pages.length - 1 ? "Finalizar" : "Próximo",
    });
  }, [page, key]);

  const handleNext = () => {
    if (modal.tabIndex < pages.length - 1) {
      const nextPage = pages[modal.tabIndex + 1].value;
      navigate(`/checkout/${key}/${nextPage}`);
    } else {
      handleSubmit();
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

  const handleSubmit = async () => {
    console.log("Finalizando pedido...", { form, selectedMethod });
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex !== modal.tabIndex) {
      const stepValue = pages[stepIndex].value;
      navigate(`/checkout/${key}/${stepValue}`);
    }
  };

  const status = ["done", "pending", "error"];

  const stepStatus = pages.map((page) => ({ ...page, status: "done" }));

  return (
    <Modal
      open={modal.open}
      component="view"
      fullScreen="all"
      maxWidth="lg"
      loading={modal.loading}
      onClose={handleBack}
      onAction={handleNext}
      actionText={modal.actionText}
      backAction={{
        action: handleBack,
        titulo: "Voltar",
      }}
      buttons={
        isMobile
          ? [
              {
                titulo: "Resumo do pedido",
                action: () => setOpenResumo(!openResumo),
                variant: "outlined",
              },
            ]
          : []
      }
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
          <Stack spacing={4}>
            <StepIndicator
              steps={stepStatus}
              currentStep={modal.tabIndex}
              onChange={handleStepClick}
            />

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <InformacoesAdicionais>
                {" "}
                <Typography variant="h6">
                  {form.total_label}
                  <Typography variant="body1" color="textSecondary">
                    {form.pedido_label}
                  </Typography>
                </Typography>
              </InformacoesAdicionais>
            </Box>
          </Stack>
        </Grid>

        {/* Conteúdo principal */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2}>
            {modal.tab === "pagamento" && (
              <>
                <Grid size={{ xs: 12, md: 8 }}>
                  {selectedMethod === "PIX" && (
                    <Typography variant="h6" className="show-box">
                      Pagamento via Pix
                      <Typography variant="body1">
                        Você poderá pagar em até 24 horas após a geração do QR
                        Code.
                      </Typography>
                    </Typography>
                  )}

                  {selectedMethod === "BOLETO" && (
                    <Typography variant="h6" className="show-box">
                      Pagamento via Boleto
                      <Typography variant="body1">
                        A confirmação pode levar até 2 dias úteis após o
                        pagamento.
                      </Typography>
                    </Typography>
                  )}

                  {selectedMethod === "CARTAO" && (
                    <>
                      {" "}
                      <Grid container spacing={2}>
                        {" "}
                        <Grid size={12}>
                          <Typography variant="h6" className="show-box">
                            Pagamento via Cartão de Crédito
                            <Typography variant="body1">
                              Informe os dados do cartão e parcele em até 12
                              vezes
                            </Typography>
                          </Typography>
                        </Grid>
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
                      </Grid>
                    </>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Rows
                    checkmode={false}
                    unSelectMode={true}
                    styleSelect={{ background: "#0195F7" }}
                    selectedItems={items.filter(
                      (item) => item.value === selectedMethod
                    )}
                    onSelect={(e) => setSelectedMethod(e.value)}
                    items={items}
                    spacing={2}
                  />
                </Grid>
              </>
            )}

            {modal.tab === "cupom" && (
              <>
                {" "}
                <Grid size={12}>
                  <Typography variant="h6">
                    Adicionar cupom de desconto
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInput
                    fullWidth
                    placeholder="Digite seu cupom de desconto"
                    name="cupom"
                    value={form.cupom || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Button disableElevation variant="contained" color="primary">
                  Adicionar
                </Button>
              </>
            )}

            {modal.tab === "confirmacao" && (
              <Grid size={12}>
                <Confirmacao form={form} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Checkout;
