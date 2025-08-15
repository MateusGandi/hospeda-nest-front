import React, { useEffect, useState } from "react";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";

import Confirmacao from "./Tabs/Confirmacao";
import MetodosPagamento from "./Tabs/MetodosPagamento";
import InformacoesAdicionais from "./Tabs/InformacoesAdicionais";
import { Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import StepIndicator from "../../Componentes/Step";
import PartialDrawer from "../../Componentes/Modal/Bottom";
import { isMobile } from "../../Componentes/Funcoes";

const Checkout = ({ alertCustom }) => {
  const { key, page } = useParams();
  const navigate = useNavigate();

  const pages = [
    { label: "Informações adicionais", value: "informacoes" },
    { label: "Pagamento", value: "pagamento" },
    { label: "Confirmação", value: "confirmacao" },
  ];

  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [openResumo, setOpenResumo] = useState(false);

  const [modal, setModal] = useState({
    tabIndex: 0,
    tab: pages[0].value,
    open: true,
    method: null,
    loading: false,
    onClose: () => navigate(-1),
    actionText: "Próximo",
  });

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

    setModal((prev) => ({
      ...prev,
      tabIndex: foundIndex,
      tab: pages[foundIndex].value,
      actionText: foundIndex === pages.length - 1 ? "Finalizar" : "Próximo",
    }));
  }, [page, key]);

  const getPaymentInfo = async () => {};

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
    console.log("Finalizando pedido...", form);
  };

  const onChangeSelected = (item) => {
    setSelected(item);
  };
  const handleStepClick = (stepIndex) => {
    if (stepIndex !== modal.tabIndex) {
      const stepValue = pages[stepIndex].value;
      navigate(`/checkout/${key}/${stepValue}`);
    }
  };
  const stepStatus = [
    {
      label: "Informações adicionais",
      status: modal.tabIndex > 0 ? "done" : "pending",
    },
    {
      label: "Pagamento",
      status:
        modal.tabIndex > 1
          ? "done"
          : modal.tabIndex === 1
          ? "error"
          : "pending",
    },
    {
      label: "Confirmação",
      status: modal.tabIndex === 2 ? "pending" : "pending",
    },
  ];

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
        titulo: modal.tabIndex > 0 ? "Voltar" : "Cancelar",
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
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            {" "}
            <Typography variant="h6">Informações de pagamento</Typography>
            <StepIndicator
              steps={stepStatus}
              currentStep={modal.tabIndex}
              onChange={handleStepClick}
            />
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <InformacoesAdicionais />
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {" "}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mx: { xs: 0, md: 8 } }}>
                Título
              </Typography>
            </Grid>
            {modal.tab === "informacoes" && (
              <Grid size={12}>
                <div>oi</div>
              </Grid>
            )}
            {modal.tab === "pagamento" && (
              <>
                <Grid size={{ xs: 12, md: 7 }} sx={{ mx: { xs: 0, md: 8 } }}>
                  {selected && selected.component}
                </Grid>{" "}
                <Grid size={{ xs: 12, md: 3 }} sx={{ pt: 2.5 }}>
                  <MetodosPagamento
                    selected={selected}
                    onChange={onChangeSelected}
                    form={form}
                    setForm={setForm}
                  />
                </Grid>
              </>
            )}
            {modal.tab === "confirmacao" && (
              <Grid size={12}>
                <Confirmacao form={form} />
              </Grid>
            )}{" "}
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Checkout;
