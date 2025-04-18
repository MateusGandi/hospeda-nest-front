import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  Grid2 as Grid,
  Switch,
  Typography,
} from "@mui/material";
import Modal from "../../Componentes/Modal";
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
import { formatarHorario, getLocalItem } from "../../Componentes/Funcoes";

const Empresa = ({ alertCustom }) => {
  const paths = [
    { key: "barbeiros", title: "Selecione um barbeiro", item: "barbeiro" },
    {
      key: "servicos",
      title: "Selecione um ou mais servicos",
      item: "servicos",
    },
    {
      key: "agendamento",
      title: "Selecione uma data e horário",
      item: "agendamento",
    },
    {
      key: "confirmacao",
      title: "Confirmação",
      item: "confirmacao",
    },
    {
      key: "error",
      title: "Confirmação",
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
    servicos: null,
    agendamento: null,
  });
  const [page, setPage] = useState({
    open: false,
  });

  const handleSaveAgendamento = async () => {
    // throw new Error("oi");
    await Api.query("POST", "/scheduling", {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      userId: getLocalItem("userId"),
      barberId: form.barbeiro.id,
      services: form.servicos.map(({ id }) => id),
    });
  };

  const handleNext = async () => {
    try {
      if (subPath && ["confirmacao", "error"].includes(subPath)) return;

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
            navigate(`/barbearia/${empresa.path}/${paths[pathTo + 1].key}`);
          })
          .catch((error) => {
            console.log(error);
            alertCustom(
              "Erro ao confirmar agendamento, favor, tente mais tarde!"
            );
            // setTituloModal(paths[pathTo + 2].title);
            // navigate(`/barbearia/${empresa.path}/${paths[pathTo + 2].key}`);
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
      if (!subPath || ["confirmacao", "error"].includes(subPath)) return;

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
      onClose: () => {
        setPage((prev) => ({ ...prev, open: false }));
        navigate(-1);
      },
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
          subtitulo: `${item.telefone} - Especialidades: ${
            item.servicosPrestados?.map(({ nome }) => nome)?.join(", ") || ""
          }`,
          imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/user/${item.id}/${item.foto}`,
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
            {!subPath && (
              <BarberPresentation
                barbearia={empresa}
                handleAction={handleNext}
                handleActionText={"Escolher barbeiro"}
              />
            )}

            {subPath == "barbeiros" && (
              <Funcioanarios
                alertCustom={alertCustom}
                form={form}
                setForm={setForm}
                format={formatarRows}
                setError={alertCustom}
              />
            )}
            {subPath == "servicos" && (
              <Servicos
                alertCustom={alertCustom}
                form={form}
                setForm={setForm}
                format={formatarRows}
                setError={alertCustom}
                setLoading={setLoading}
              />
            )}
            {subPath == "agendamento" && (
              <Agendamento
                alertCustom={alertCustom}
                form={form}
                setForm={setForm}
                format={formatarRows}
                setError={alertCustom}
                setLoading={setLoading}
              />
            )}
            {subPath == "confirmacao" && (
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
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    Agendamento Confirmado!
                  </Typography>
                  <Typography variant="h5" color="warning">
                    {format(() => {
                      const data = new Date(form?.agendamento.id);
                      data.setHours(data.getHours() + 3);
                      // Adiciona 3 horas à data
                      return data;
                    }, "dd/MM/yyyy' às 'HH:mm'h'")}
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
                    href={`https://www.google.com/maps?q=${form?.barbearia.endereco}`}
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
            )}
            {subPath == "error" && (
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
            )}
          </Grid>
        </Grid>
      </Modal>
    )
  );
};

export default Empresa;
