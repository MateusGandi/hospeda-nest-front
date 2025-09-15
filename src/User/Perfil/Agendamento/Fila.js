import { useEffect, useState } from "react";
import apiService from "../../../Componentes/Api/axios";
import { formatarHorario, getLocalItem } from "../../../Componentes/Funcoes";
import { PaperList } from "../../../Componentes/Lista/Paper";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";
import Modal from "../../../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import Confirm from "../../../Componentes/Alert/Confirm";

function Fila({ dados, alertCustom, reload }) {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    open: true,
    confirm: false,
    inQueue: true,
    title: "Sua posição na fila",
    waitTime: "",
    peopleAhead: "",
  });

  const handleConfirm = () => {
    setContent((prev) => ({ ...prev, confirm: true }));
  };

  const getOutQueue = async () => {
    try {
      await apiService.query("DELETE", `/scheduling/queue/self-remove`);
      alertCustom("Você saiu da fila com sucesso!");
      reload();
      setContent((prev) => ({
        ...prev,
        inQueue: false,
        title: "Você saiu da fila",
        waitTime: "Não definido",
        peopleAhead: "Nenhuma",
      }));
    } catch (error) {
      alertCustom(
        error.response?.data?.message ||
          "Erro ao sair da fila, tente novamente mais tarde!"
      );
    }
  };

  const getUpdatePosition = async () => {
    try {
      const userId = getLocalItem("userId");

      const response = await apiService.query(
        "GET",
        `/scheduling/queue/position/${userId}`
      );

      if (!response?.inQueue) {
        alertCustom("Você não está mais na fila.");
        setContent((prev) => ({
          ...prev,
          inQueue: false,
          title: "Você foi removido da fila",
          waitTime: "Não definido",
          peopleAhead: "Nenhuma",
        }));
        reload();
        return;
      }

      const { inQueue, position, waitTime, peopleAhead } = response;

      setContent((prev) => ({
        ...prev,
        inQueue,
        position,
        waitTime,
        peopleAhead,
        title: `Você é o ${position}º da fila`,
      }));
    } catch (error) {
      console.error("Erro ao atualizar posição na fila:", error);
    }
  };

  useEffect(() => {
    // busca inicial
    getUpdatePosition();

    // cria intervalo só se ainda estiver na fila
    if (!content.inQueue) return;

    const interval = setInterval(getUpdatePosition, 30000);

    return () => clearInterval(interval);
  }, [content.inQueue]);

  const handleClose = () => {
    navigate(-1);
    setContent((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      component="view"
      open={content.open}
      onClose={handleClose}
      titulo={content.title}
      buttons={
        content.inQueue
          ? [
              {
                titulo: "Sair da fila",
                variant: "contained",
                color: "error",
                action: handleConfirm,
              },
            ]
          : []
      }
      fullScreen="mobile"
      maxWidth="sm"
    >
      <Grid container sx={{ mt: -3 }} spacing={2}>
        <Grid size={12}>
          <Rows
            disabled={true}
            items={[
              {
                titulo: dados.atendente.nome,
                subtitulo: "Atendente responsávell",
                size: 50,
                imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${dados.atendente.id}/${dados.atendente.foto}`,
              },
            ]}
          />
        </Grid>

        <Grid size={12}>
          <PaperList
            items={[
              ...dados.servico.map((item) => ({
                titulo: item.nome,
                subtitulo: formatarHorario(item.tempoGasto),
              })),
              {
                titulo: "Tempo médio de espera",
                subtitulo: content.waitTime,
              },
              {
                titulo: "Pessoas à sua frente",
                subtitulo: content.peopleAhead
                  ? `${content.peopleAhead} pessoa(s) à sua frente`
                  : "Nenhuma",
              },
            ]}
          >
            <Typography variant="h6" sx={{ p: "5px 10px" }}>
              Resumo do pedido
            </Typography>
          </PaperList>
        </Grid>
      </Grid>
      <Confirm
        open={content.confirm}
        onClose={() => setContent((prev) => ({ ...prev, confirm: false }))}
        onConfirm={getOutQueue}
        title="Confirmação"
        message="Tem certeza que deseja sair da fila? Se sair, perderá sua posição atual."
        confirmText="Sair da fila"
        cancelText="Cancelar"
      />
    </Modal>
  );
}

export default Fila;
