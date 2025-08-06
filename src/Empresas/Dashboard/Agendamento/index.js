import React, { useEffect, useState } from "react";
import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";

import Servicos from "./Servicos";
import Agendamento from "./Agendamento";
import ClienteForm from "./Cliente";
import { formatarHorario, getLocalItem } from "../../../Componentes/Funcoes";

const AgendamentoManual = ({ onClose, barbearia, alertCustom }) => {
  const paths = [
    {
      key: "cliente",
      title: "Dados do cliente",
      item: "cliente",
    },
    {
      key: "servicos",
      title: "Selecione um ou mais serviços",
      item: "servicos",
    },
    {
      key: "agendamento",
      title: "Selecione uma data e horário",
      item: "agendamento",
    },
    {
      key: "confirmacao",
      title: "Agendamento confirmado!",
      item: "confirmacao",
    },
    {
      key: "error",
      title: "Opps, algo deu errado!",
      item: "error",
    },
  ];

  const navigate = useNavigate();
  const [tituloModal, setTituloModal] = useState(paths[0].title);
  const { subPath } = useParams();

  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    barbearia: barbearia,
    barbeiro: barbearia?.funcionarios.find(
      (f) => f.id === getLocalItem("userId")
    ),
    cliente: null,
    servicos: [],
    agendamento: null,
  });
  const [page, setPage] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!subPath && !initialized) {
      navigate("cliente");
    }
    if (!subPath) {
      onClose();
    }
    if (subPath !== "cliente" && !initialized) {
      onClose();
    }
    setInitialized(true);
  }, [subPath]);

  const handleSaveAgendamento = async () => {
    await Api.query("POST", "/scheduling/manual", {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      services: form.servicos.map(({ id }) => `${id}`),
      userName: form.cliente.nome,
      userId: form.cliente.id,
      barberId: barbearia.funcionarios.find(
        (f) => f.id === getLocalItem("userId")
      ).id,
    });
  };

  const handleNext = async () => {
    try {
      const resp = paths.find(({ key }) => key == subPath) ?? paths[0];
      if (subPath && !form[resp.item]) {
        return alertCustom(
          `Informe as informações necessárias para prosseguir!`
        );
      }

      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (paths[pathTo + 1].key == "confirmacao") {
        return await handleSaveAgendamento()
          .then(() => {
            alertCustom("Agendamento confirmado!");
            setTituloModal(paths[pathTo + 1].title);
            navigate(`/dashboard/agendamento/${paths[pathTo + 1].key}`);
          })
          .catch((error) => {
            alertCustom(
              error.response.data.message ||
                "Erro ao confirmar agendamento, favor, tente mais tarde!"
            );
          });
      }
      setTituloModal(paths[pathTo + 1].title);
      console.log(`/dashboard/agendamento/${paths[pathTo + 1].key}`);
      navigate(`/dashboard/agendamento/${paths[pathTo + 1].key}`);
    } catch (error) {
      alertCustom("Erro interno!");
    }
  };

  const handleBack = () => {
    try {
      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (pathTo - 1 == -1) {
        return onClose();
      }
      setTituloModal(paths[pathTo - 1].title);
      navigate(`/dashboard/agendamento/${paths[pathTo - 1].key}`);
    } catch (error) {
      alertCustom("Erro interno!");
    }
  };

  useEffect(() => {
    setEmpresa(barbearia);
  }, []);

  useEffect(() => {
    setPage((prev) => ({
      ...prev,
      onClose: () => {
        navigate("/dashboard");
        setForm({
          barbearia: barbearia,
          barbeiro: barbearia.funcionarios.find(
            (f) => f.id === getLocalItem("userId")
          ),
          cliente: null,
          servicos: null,
          agendamento: null,
        });
      },
    }));
    setForm((prev) => ({ ...prev, barbearia: empresa }));
  }, [empresa]);

  const formatarRows = (items, pagina) => {
    if (pagina == "barbeiros") {
      return items.map((item) => ({
        ...item,
        titulo: item.nome,
        subtitulo: `${item.telefone} - Especialidades: ${item.servicosPrestados
          .map(({ nome }) => nome)
          .join(", ")}`,
        imagem: item.foto,
      }));
    }
    if (pagina == "servicos") {
      return items.map((item) => ({
        ...item,
        titulo: `R$ ${item.preco} ${item.nome}`,
        subtitulo: `Duração: ${formatarHorario(item.tempoGasto)}`,
      }));
    }
    if (pagina == "agendamentos") {
      return items.map((item) => ({
        ...item,
        titulo: format(new Date(item.data), "dd/MM HH:mm"),
        subtitulo: "Clique para confirmar",
      }));
    }
  };

  const views = {
    cliente: (
      <ClienteForm
        alertCustom={alertCustom}
        setFormData={setForm}
        formData={form}
      />
    ),
    servicos: (
      <Servicos
        alertCustom={alertCustom}
        form={form}
        setForm={setForm}
        format={formatarRows}
        setError={alertCustom}
      />
    ),
    agendamento: (
      <Agendamento
        alertCustom={alertCustom}
        form={form}
        setForm={setForm}
        format={formatarRows}
        setError={alertCustom}
      />
    ),
    confirmacao: (
      <Grid
        container
        sx={{
          height: "60vh",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid size={{ md: 12, xs: 12 }}>
          {" "}
          <Typography variant="h5" color="#fff" sx={{ py: 5 }}>
            <span
              style={{
                background: "#EA7E11",
                padding: "8px 16px",
                borderRadius: "16px",
                fontWeight: "bold",
              }}
            >
              {format(() => {
                try {
                  if (!form?.agendamento?.id) return new Date();
                  const data = new Date(form?.agendamento?.id);
                  data.setHours(data.getHours() + 3);
                  return data;
                } catch (error) {
                  return new Date();
                }
              }, "dd/MM/yyyy' às 'HH:mm'h'")}
            </span>
          </Typography>{" "}
        </Grid>
        <Grid
          size={{ md: 12, xs: 12 }}
          className="show-box"
          sx={{ textAlign: "start" }}
        >
          <Typography variant="h6">
            🔔 Notificação
            <Typography variant="body1">
              Seu cliente será notificado! Caso ele tenha permitido notificações
              via WhatsApp
            </Typography>
          </Typography>
        </Grid>
        <Grid size={{ md: 12, xs: 12 }}></Grid>
        <Grid size={{ md: 12, xs: 12 }}>
          <Button
            disableElevation
            color="terciary"
            size="large"
            onClick={() => navigate("/dashboard")}
            startIcon={<ArrowBackIcon />}
          >
            Voltar a tela inicial
          </Button>
        </Grid>
      </Grid>
    ),
    error: (
      <Grid
        container
        sx={{
          height: "60vh",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid size={{ md: 12, xs: 12 }}>
          <Typography variant="h5">
            Ocorreu um erro com o agendamento...
            <Typography variant="body1" color="GrayText">
              Tente novamente mais tarde!
            </Typography>
          </Typography>
        </Grid>
        <Grid size={{ md: 12, xs: 12 }}>
          <Button
            disableElevation
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{
              border: "1px solid #484848",
            }}
            onClick={() => navigate("/dashboard")}
          >
            Voltar a tela inicial
          </Button>
        </Grid>
      </Grid>
    ),
  };

  return (
    page && (
      <Modal
        loading={loading}
        open={true}
        backAction={{
          action: !["confirmacao", "error"].includes(subPath)
            ? handleBack
            : () => navigate("/dashboard"),
          titulo: "Voltar",
        }}
        onClose={page.onClose}
        actionText={"Próximo"}
        titulo={tituloModal}
        onAction={
          subPath && !["confirmacao", "error"].includes(subPath) && handleNext
        }
        fullScreen="all"
        component="view"
        maxWidth="sm"
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 12 }}>
            {Object.keys(views).map((key) => (
              <Box
                sx={{
                  width: "100%",
                  display: key == subPath ? "block" : "none",
                }}
              >
                {views[key]}
              </Box>
            ))}
          </Grid>
        </Grid>
      </Modal>
    )
  );
};

export default AgendamentoManual;
