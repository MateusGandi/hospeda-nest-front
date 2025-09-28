import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../Componentes/Modal/Simple";
import Api from "../../Componentes/Api/axios";
import BarberPresentation from "./Presentation";
import { useParams, useNavigate } from "react-router-dom";
import { format, set } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Funcioanarios from "./Funcionarios";
import Servicos from "./Servicos";
import Agendamento from "./Agendamento";
import {
  formatarHorario,
  formatPhone,
  getLocalItem,
} from "../../Componentes/Funcoes";
import EntrarFila from "./EntrarFila";
import ConfirmacaoAgendamento from "./Confirmacao/Agendamento";
import ConfirmacaoFila from "./Confirmacao/Fila";
import CustomSkeleton from "../../Componentes/Loading/skeleton";
import { LoadingBox } from "../../Componentes/Custom";

const Empresa = ({ alertCustom }) => {
  const [paths, setPaths] = useState([]);

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
    in_fila: false,
    fila_info: null,
    loading: false,

    //para casos em que for removido da fila externamente
    disabledActionButton: false,
  });
  const [page, setPage] = useState({
    open: false,
    onClose: () => {
      navigate("/home");
    },
  });

  const handleSave = async () => {
    const url = subPath == "fila" ? "/scheduling/queue" : "/scheduling";

    await Api.query("POST", url, {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      userId: getLocalItem("userId"),
      barberId: form.barbeiro.id,
      services: form.servicos.map(({ id }) => id),
      userName: getLocalItem("nome"),
      manual: false,
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
      if (
        subPath &&
        (!form[resp.item] ||
          (Array.isArray(form[resp.item]) && !form[resp.item].length)) &&
        subPath != "fila"
      ) {
        return alertCustom("Preencha informações necessárias para prosseguir!");
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
      alertCustom("Erro interno!");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    try {
      if (
        !subPath ||
        ["agendamento-confirmado", "error"].includes(subPath) ||
        form.disabledActionButton
      )
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

  useEffect(() => {
    const verify = () => {
      const basePages = [
        {
          key: "barbeiros",
          title: "Selecione um profissional",
          item: "barbeiro",
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

  const formatarRows = (items, pagina) => {
    if (pagina == "barbeiros") {
      return items
        .filter((item) => !!item.servicosPrestados.length)
        .map((item) => ({
          ...item,
          titulo: item.clientesPodemEntrarNaFila ? (
            <span>
              {" "}
              {item.nome}{" "}
              <Chip
                label="Presencial"
                size="small"
                color="primary"
                variant="filled"
              />
            </span>
          ) : (
            item.nome
          ),
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
    fila: <EntrarFila alertCustom={alertCustom} form={form} />,
    "agendamento-confirmado": (
      <ConfirmacaoAgendamento
        form={form}
        setForm={setForm}
        alertCustom={alertCustom}
      />
    ),
    "fila-confirmado": (
      <ConfirmacaoFila
        form={form}
        setForm={setForm}
        alertCustom={alertCustom}
      />
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

  const getOutQueue = async () => {
    try {
      setLoading(true);
      await Api.query("DELETE", "/scheduling/queue/self-remove");
      alertCustom("Você saiu da fila com sucesso!");
      setForm((prev) => ({ ...prev, in_fila: false, fila_info: null }));
      handleBack();
    } catch (error) {
      alertCustom(
        error.response.data.message ??
          "O babeiro removeu você da fila ou ocorreu um erro!"
      );
      setForm((prev) => ({ ...prev, in_fila: false }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!form.in_fila && form.fila_info) {
      setForm((prev) => ({
        ...prev,
        fila_info: null,
        disabledActionButton: true,
      }));
    } else {
      setForm((prev) => ({ ...prev, disabledActionButton: false }));
    }
  }, [form.in_fila]);

  const estrategy = () => {
    const invalidPaths = ["agendamento-confirmado", "error", undefined];
    if (invalidPaths.includes(subPath))
      return { action: undefined, text: "", buttons: [] };

    if (["fila-confirmado", "fila"].includes(subPath) && form.in_fila)
      return {
        action: undefined,
        text: "",
        buttons: [
          {
            titulo: "Sair da fila",
            variant: "contained",
            color: "error",
            action: getOutQueue,
            disabled: loading,
          },
        ],
      };
    else if (form.disabledActionButton)
      return { action: undefined, text: "", buttons: [] };
    else if (subPath == "fila")
      return { action: handleNext, text: "Entrar na fila" };
    else return { action: handleNext, text: "Próximo", buttons: [] };
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

export default Empresa;
