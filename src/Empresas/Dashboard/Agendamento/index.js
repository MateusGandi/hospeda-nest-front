import React, { useEffect, useState } from "react";
import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import Api from "../../../Componentes/Api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EntrarFila from "./EntrarFila";
import Servicos from "./Servicos";
import Agendamento from "./Agendamento";
import ClienteForm from "./Cliente";
import { formatarHorario, getLocalItem } from "../../../Componentes/Funcoes";
import ConfirmacaoAgendamento from "./Confirmacao/Agendamento";
import ConfirmacaoFila from "./Confirmacao/Fila";

const AgendamentoManual = ({ onClose, barbearia, alertCustom }) => {
  const [paths, setPaths] = useState([]);

  const navigate = useNavigate();
  const [tituloModal, setTituloModal] = useState("");
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
    in_fila: false,
    fila_info: null,
    loading: false,
  });
  const [page, setPage] = useState({
    open: false,
    onClose: () => {
      navigate("/dashboard");
    },
  });
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

  const handleSave = async () => {
    const url = subPath == "fila" ? "/scheduling/queue" : "/scheduling/manual";
    await Api.query("POST", url, {
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
      manual: true,
    }).then((resp) => {
      if (subPath == "fila")
        setForm((prev) => ({ ...prev, in_fila: true, fila_info: resp }));
      return resp;
    });
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      if (
        subPath &&
        ["agendamento-confirmado", "fila-confirmado", "error"].includes(subPath)
      )
        return;

      const resp = paths.find(({ key }) => key == subPath) ?? paths[0];

      if (subPath && subPath != "fila") {
        if (
          !form[resp.item] ||
          (Array.isArray(form[resp.item]) && !form[resp.item].length)
        )
          throw new Error(
            "Preencha as informações necessárias para prosseguir!"
          );
        else if (
          subPath == "cliente" &&
          form[resp.item] &&
          !form[resp.item].nome
        )
          throw new Error("Informe o nome do cliente!");
      }

      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (paths[pathTo + 1].key.includes("confirmado")) {
        return await handleSave()
          .then(() => {
            alertCustom(
              form.barbeiro.filaDinamicaClientes
                ? "Aguardando na fila..."
                : "Agendamento confirmado!"
            );
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
      navigate(`/dashboard/agendamento/${paths[pathTo + 1].key}`);
    } catch (error) {
      alertCustom(error.message || "Estamos com problemas, tente mais tarde!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    try {
      if (
        !subPath ||
        ["agendamento-confirmado", "fila-confirmado", "error"].includes(subPath)
      )
        return navigate("/dashboard");

      const pathTo = paths.findIndex((item) => item.key === subPath);
      if (pathTo == 0) {
        setTituloModal("");
        return navigate(`/dashboard`);
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
      open: true,
      onClose: () => navigate("/dashboard"),
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

  const estrategy = () => {
    const invalidPaths = ["agendamento-confirmado", "error", undefined];
    if (invalidPaths.includes(subPath))
      return { action: undefined, text: "", buttons: [] };

    if (["fila-confirmado", "fila"].includes(subPath) && form.in_fila)
      return {
        action: undefined,
        text: "",
        buttons: [],
      };
    else if (subPath == "fila")
      return { action: handleNext, text: "Inserir cliente na fila" };
    else return { action: handleNext, text: "Próximo", buttons: [] };
  };

  useEffect(() => {
    const verify = () => {
      const basePages = [
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
      ];

      const queuePages = [
        { key: "fila", title: "Fila de atendimento", item: "fila" },
        {
          key: "fila-confirmado",
          title: "",
          item: "fila-confirmado",
        },
      ];

      const schedulePages = [
        {
          key: "agendamento",
          title: "Selecione uma data e horário",
          item: "agendamento",
        },
        {
          key: "agendamento-confirmado",
          title: "Agendamento confirmado!",
          item: "agendamento-confirmado",
        },
      ];

      const errorPage = {
        key: "error",
        title: "Opps, algo deu errado!",
        item: "error",
      };

      const paginas = [
        ...basePages,
        ...(form.barbeiro?.filaDinamicaClientes ? queuePages : schedulePages),
        errorPage,
      ];

      setPaths(paginas);
    };

    verify();
  }, [form]);

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
    fila: <EntrarFila />,
    "agendamento-confirmado": (
      <ConfirmacaoAgendamento form={form} alertCustom={alertCustom} />
    ),
    "fila-confirmado": (
      <ConfirmacaoFila form={form} alertCustom={alertCustom} />
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
    page.open && (
      <Modal
        open={page.open}
        backAction={{
          action: handleBack,
          titulo: "Voltar",
        }}
        onClose={page.onClose}
        actionText={estrategy().text}
        onAction={estrategy().action}
        titulo={tituloModal}
        fullScreen="all"
        component="view"
        buttons={estrategy().buttons}
        loadingButton={loading}
        loading={loading}
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

export default AgendamentoManual;
