import React, { useEffect, useState } from "react";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";

import Servicos from "./Servicos";
import Agendamento from "./Agendamento";
import ClienteForm from "./Cliente";
import { formatarHorario } from "../../../Componentes/Funcoes";

const AgendamentoManual = ({
  open,
  onClose,
  barbearia,
  barbeiro,
  alertCustom,
}) => {
  const paths = [
    {
      key: "cliente",
      title: "Dados do cliente",
      item: "cliente",
    },
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

  const navigate = useNavigate();
  const [tituloModal, setTituloModal] = useState(paths[0].title);
  const { subPath } = useParams();

  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    barbearia: barbearia,
    barbeiro: barbeiro,
    cliente: null,
    servicos: null,
    agendamento: null,
  });
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!subPath) {
      onClose();
      setForm({
        barbearia: barbearia,
        barbeiro: barbeiro,
        cliente: null,
        servicos: null,
        agendamento: null,
      });
    }
  }, [subPath]);

  const handleSaveAgendamento = async () => {
    await Api.query("POST", "/scheduling/manual", {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      services: form.servicos.map(({ id }) => id),
      userName: form.cliente.nome,
      userId: form.cliente.id,
      barberId: barbeiro.id,
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
              "Erro ao confirmar agendamento, favor, tente mais tarde!"
            );
            // setTituloModal(paths[pathTo + 2].title);
            // navigate(`/dashboard/${paths[pathTo + 2].key}`);
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
        onClose();
        navigate("/dashboard");
        setForm({
          barbearia: barbearia,
          barbeiro: barbeiro,
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

  return (
    page && (
      <Modal
        loading={loading}
        open={open}
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
            {subPath == "cliente" && (
              <ClienteForm
                alertCustom={alertCustom}
                setFormData={setForm}
                formData={form}
              />
            )}
            {subPath == "servicos" && (
              <Servicos
                alertCustom={alertCustom}
                form={form}
                setForm={setForm}
                format={formatarRows}
                setError={alertCustom}
              />
            )}
            {subPath == "agendamento" && (
              <Agendamento
                alertCustom={alertCustom}
                form={form}
                setForm={setForm}
                format={formatarRows}
                setError={alertCustom}
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
                      {
                        "Seu cliente será notificado! Caso ele tenha permitido notificações via WhatsApp"
                      }
                    </Typography>
                    {/* <Typography variant="body1" textAlign="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.notify}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                notify: e.target.checked,
                              }))
                            }
                            color="success"
                          />
                        }
                        label="Quero ser notificado pelo WhatsApp"
                      />
                    </Typography> */}
                  </Typography>
                </Grid>
                <Grid size={{ md: 12, xs: 12 }}>
                  <a
                    href="https://www.google.com/maps?q=Av. Paulista, São Paulo"
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
                    onClick={() => navigate("/dashboard")}
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
                    onClick={() => navigate("/dashboard")}
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

export default AgendamentoManual;
