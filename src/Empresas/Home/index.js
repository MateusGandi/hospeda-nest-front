import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Grid2 as Grid,
  Switch,
  Typography,
} from "@mui/material";
import Modal from "../../Componentes/Modal/Simple";
import Api from "../../Componentes/Api/axios";
import BarberPresentation from "./Presentation";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";

import Funcioanarios from "./Funcionarios";
import Servicos from "./Servicos";
import Agendamento from "./Agendamento";
import AnimatedCheck from "../../Componentes/Motion/Icons";
import {
  formatarHorario,
  formatPhone,
  getLocalItem,
} from "../../Componentes/Funcoes";

const Empresa = ({ alertCustom }) => {
  const paths = [
    { key: "barbeiros", title: "Selecione um barbeiro", item: "barbeiro" },
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

  const [tituloModal, setTituloModal] = useState("");

  const navigate = useNavigate();
  const { barbeariaName, subPath } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    barbearia: null,
    barbeiro: null,
    servicos: [],
    agendamento: null,
  });
  const [page, setPage] = useState({
    open: false,
    onClose: () => {
      navigate(-1);
    },
  });

  const handleSaveAgendamento = async () => {
    await Api.query("POST", "/scheduling", {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      userId: getLocalItem("userId"),
      barberId: form.barbeiro.id,
      services: form.servicos?.map(({ id }) => id),
    });
  };

  const handleNext = async () => {
    try {
      if (subPath && ["confirmacao", "error"].includes(subPath)) return;

      const resp = paths.find(({ key }) => key == subPath) ?? paths[0];
      if (subPath && !form[resp.item]) {
        return alertCustom("Preencha informações necessárias para prosseguir!");
      }

      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (paths[pathTo + 1].key == "confirmacao") {
        return await handleSaveAgendamento()
          .then(() => {
            alertCustom("Agendamento confirmado!");
            setTituloModal(paths[pathTo + 1].title);
            navigate(`/barbearia/${empresa.path}/${paths[pathTo + 1].key}`);
          })
          .catch((error) => {
            alertCustom(
              error.response.data.message ??
                "Erro ao confirmar agendamento, favor, tente mais tarde!"
            );
          });
      }
      setTituloModal(paths[pathTo + 1].title);
      navigate(`/barbearia/${empresa.path}/${paths[pathTo + 1].key}`);
    } catch (error) {
      console.log(error);
      alertCustom("Erro interno!");
    }
  };

  const handleBack = () => {
    try {
      if (!subPath || ["confirmacao", "error"].includes(subPath))
        return navigate("/estabelecimentos");

      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (pathTo == 0) {
        setTituloModal("");
        return navigate("/barbearia/" + barbeariaName);
      }
      setTituloModal(paths[pathTo - 1].title);
      navigate(`/barbearia/${empresa.path}/${paths[pathTo - 1].key}`);
    } catch (error) {
      console.log(error);
      alertCustom("Erro interno!");
    }
  };

  useEffect(() => {
    const buscarEmpresa = async () => {
      setLoading(true);
      try {
        if (!form.barbearia && subPath) return navigate("/estabelecimentos");

        const data = await Api.query(
          "GET",
          `/establishment/client/${barbeariaName}`
        );
        setForm((prev) => ({ ...prev, barbearia: data }));
        setEmpresa(data);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        alertCustom(
          "Erro ao buscar estabelecimento, tente novamente mais tarde!"
        );
      } finally {
        setLoading(false);
      }
    };
    buscarEmpresa();
  }, []);

  useEffect(() => {
    setPage((prev) => ({
      ...prev,
      open: true,
    }));
    setForm((prev) => ({ ...prev, barbearia: empresa }));
  }, [empresa]);

  const formatarRows = (items, pagina) => {
    if (pagina == "barbeiros") {
      return items
        .filter((item) => !!item.servicosPrestados.length)
        .map((item) => ({
          ...item,
          titulo: item.nome,
          subtitulo: `${formatPhone(item.telefone)} - Especialidades: ${
            item.servicosPrestados?.map(({ nome }) => nome)?.join(", ") || ""
          }`,
          imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.id}/${item.foto}`,
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
    not: (
      <BarberPresentation
        barbearia={empresa}
        handleAction={handleNext}
        handleActionText={"Escolher barbeiro"}
      />
    ),
    barbeiros: (
      <Funcioanarios
        alertCustom={alertCustom}
        form={form}
        setForm={setForm}
        format={formatarRows}
        setError={alertCustom}
      />
    ),
    servicos: (
      <Servicos
        alertCustom={alertCustom}
        form={form}
        setForm={setForm}
        format={formatarRows}
        setError={alertCustom}
        setLoading={setLoading}
      />
    ),
    agendamento: (
      <Agendamento
        alertCustom={alertCustom}
        form={form}
        setForm={setForm}
        format={formatarRows}
        setError={alertCustom}
        setLoading={setLoading}
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
              {getLocalItem("flagWhatsapp")
                ? "Você será notificado por mensagem no WhatsApp quando estiver próximo do horário marcado!"
                : "Você não será notificado! Considere permitir as notificações via WhatsApp em 'configurações' para ser notificado sobre seus agendamentos"}
            </Typography>
            <Typography variant="body1">
              <b>Cancelamentos</b> só podem ocorrer com <b>1h</b> de
              antecedência.
            </Typography>
          </Typography>
        </Grid>
        <Grid size={{ md: 12, xs: 12 }}>
          <a
            href={`https://www.google.com/maps?q=${form?.barbearia?.endereco}`}
            target="_blank"
          >
            <Button
              disableElevation
              color="primary"
              size="large"
              variant="contained"
              startIcon={<NavigationIcon />}
            >
              Ver Localização
            </Button>
          </a>
        </Grid>
        <Grid size={{ md: 12, xs: 12 }}>
          <Button
            disableElevation
            color="terciary"
            size="large"
            onClick={() => navigate("/home")}
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
          {" "}
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
            onClick={() => navigate("/home")}
          >
            Voltar a tela inicial
          </Button>
        </Grid>
      </Grid>
    ),
  };
  return (
    page.open && (
      <Modal
        loading={loading}
        open={page.open}
        backAction={{
          action: handleBack,
          titulo: "Voltar",
        }}
        onClose={page.onClose}
        actionText={"Próximo"}
        titulo={tituloModal}
        onAction={
          !["confirmacao", "error", undefined].includes(subPath) && handleNext
        }
        fullScreen="all"
        component="view"
      >
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid size={{ xs: 12, md: !subPath ? 12 : 8 }}>
            {Object.keys(views).map((key) => (
              <Box
                sx={{
                  width: "100%",
                  display: key == (subPath || "not") ? "block" : "none",
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

export default Empresa;
