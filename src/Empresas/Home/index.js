import React, { useEffect, useState } from "react";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../Componentes/Modal";
import Api from "../../Componentes/Api/axios";
import BarberPresentation from "./Presentation";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Funcioanarios from "./Funcionarios";
import Servicos from "./Servicos";
import Agendamento from "./Agendamento";

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
    await Api.query("POST", "/scheduling", {
      data: form.agendamento?.id
        ? new Date(form.agendamento.id).toISOString()
        : form.agendamento,
      establishmentId: empresa.id,
      userId: localStorage.userId,
      barberId: form.barbeiro.id,
      services: form.servicos.map(({ id }) => id),
    });
  };

  const handleNext = async () => {
    try {
      const resp = paths.find(({ key }) => key == subPath) ?? paths[0];
      if (subPath && !form[resp.item]) {
        return alertCustom(`Selecione ao menos 1 item antes de prosseguir!`);
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
            setTituloModal(paths[pathTo + 2].title);
            navigate(`/barbearia/${empresa.path}/${paths[pathTo + 2].key}`);
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
      const pathTo = paths.findIndex((item) => item.key === subPath);
      console.log("pathTo", pathTo);
      if (pathTo == 0) {
        return navigate("/onboard");
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
        navigate("/onboard");
      },
    }));
    setForm((prev) => ({ ...prev, barbearia: empresa }));
  }, [empresa]);

  const formatarRows = (items, pagina) => {
    if (pagina == "barbeiros") {
      return items.map((item) => ({
        ...item,
        titulo: item.nome,
        subtitulo: `${item.telefone} - Especialidades: ${
          item.servicosPrestados?.map(({ nome }) => nome)?.join(", ") || ""
        }`,
        imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.id}/${item.foto}`,
      }));
    }
    if (pagina == "servicos") {
      return items.map((item) => ({
        ...item,
        titulo: `R$ ${item.preco} ${item.nome}`,
        subtitulo: `Duração: ${item.duracao}`,
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
          action: !["confirmacao", "error"].includes(subPath)
            ? handleBack
            : () => navigate("/onboard"),
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
      >
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid size={{ xs: 12, md: 8 }}>
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
                  <Typography variant="h5">Agendamento Confirmado!</Typography>
                </Grid>
                <Grid size={{ md: 12, xs: 12 }}>
                  <Button
                    disableElevation
                    variant="outlined"
                    color="success"
                    size="large"
                    onClick={() => navigate("/onboard")}
                    sx={{
                      border: "1px solid #484848",
                    }}
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
                    onClick={() => navigate("/onboard")}
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
