import React, { useEffect, useState } from "react";
import { Button, Container, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { Rows } from "../../../Componentes/Lista/Rows";
import Calendario from "../../../Componentes/Calendar";
import { format } from "date-fns";
import { isMobile } from "../../../Componentes/Funcoes";
import Reagendamento from "./Reschedule";
import apiService from "../../../Componentes/Api/axios";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";

const AgendamentoManual = ({ open, handleClose, alertCustom, barbearia }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [form, setForm] = useState({
    barbearia: barbearia,
  });
  const [modalConteudo, setModalConteudo] = useState({
    open: false,
    titulo: "",
    dados: null,
  });
  const status = {
    reschedule: "reagendamento",
    cancel: "cancelamento",
    report: "reporte",
  };
  const buttons = [
    {
      titulo: "Reagendar",
      color: "warning",
      route: "reschedule",
      action: () =>
        setModalConteudo({
          open: true,
          fullScreen: "all",
          titulo: "Reagendar cliente",
          dados: "reagendar",
        }),
    },
    {
      titulo: "Cancelar",
      color: "error",
      route: "cancelled",
      action: () => handleAction("cancel"),
    },
    {
      titulo: "Não compareceu",
      color: "error",
      route: "report",
      action: () => handleAction("report"),
    },
  ];

  const buscarAgendamentos = async () => {
    try {
      const dataFormatted = dataSelecionada.toISOString().split("T")[0];
      const { id, establishmentId } = localStorage;
      const agendamentos = //await Promise.all(
        await apiService.query(
          "GET",
          `/scheduling/employee/${establishmentId}/${dataFormatted}`
        );
      // apiService.query(
      //   "GET",
      //   `/scheduling/employee/scheduleds/${id}/${dataFormatted}`
      // )
      //);

      // Simulando resposta da API
      setAgendamentos(
        agendamentos.map((item) => ({
          ...item,
          titulo: `${item.nomeCliente || "Desconhecido"} - ${format(
            new Date(item.data),
            "dd/MM HH:mm"
          )}`,
          subtitulo: `Finaliza às ${format(
            new Date(item.dataFinalizacao),
            "HH:mm"
          )}`,
        }))
      );
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    }
  };

  useEffect(() => {
    if (open) buscarAgendamentos();
  }, [dataSelecionada]);

  const handleAction = async (acao, data) => {
    try {
      await Api.query(
        "PATCH",
        `/scheduling/${acao}/${modalConteudo.dados.id}`,
        { data }
      );
      alertCustom(`${status[acao]} realizado com sucesso!`);
      setModalConteudo({ open: false, titulo: "", dados: null });
      buscarAgendamentos();
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar ${status[acao]}!`
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      titulo="Agendamentos"
      fullScreen="all"
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>
              <Button
                onClick={() =>
                  setModalConteudo({
                    open: true,
                    titulo: "Selecione um dia",
                    dados: "calendario",
                  })
                }
                endIcon={<InsertInvitationRoundedIcon />}
                color="inherit"
                variant="outlined"
                size="large"
                fullWidth={isMobile}
                sx={{ border: "1px solid #484848", m: "8px 0", p: "5px 20px" }}
              >
                {dataSelecionada.toLocaleDateString()}
              </Button>
              <Typography variant="body2" color="GrayText">
                Clique para mudar o dia
              </Typography>
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            {agendamentos.length ? (
              <Rows
                items={agendamentos}
                onSelect={(item) => {
                  setForm((prev) => ({ ...prev, servicos: item.servicos }));
                  setModalConteudo({
                    open: true,
                    titulo: item.titulo,
                    dados: item,
                  });
                }}
                oneTapMode={true}
              />
            ) : (
              <Typography
                variant="h5"
                sx={{
                  width: "100%",
                  height: "70vh",
                  alignContent: "center",
                  textAlign: "center",
                }}
              >
                Uffa!
                <Typography variant="body1">
                  Sua agenda está vazia para este dia...
                </Typography>
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
      {/* Modal reutilizável */}
      <Modal
        open={modalConteudo.open}
        onClose={() => setModalConteudo((prev) => ({ ...prev, open: false }))}
        titulo={modalConteudo.titulo}
        maxWidth={modalConteudo.dados === "calendario" ? "xs" : "md"}
        buttons={modalConteudo.dados != "calendario" && buttons}
        onAction={
          modalConteudo.dados == "calendario" ? null : () => console.log("oi")
        }
        actionText="Concluído"
        fullScreen={modalConteudo.fullScreen || "mobile"}
      >
        {modalConteudo.dados === "calendario" ? (
          <Calendario
            onSelect={(date) => {
              setDataSelecionada(date);
              setModalConteudo((prev) => ({ ...prev, open: false }));
            }}
          />
        ) : modalConteudo.dados === "reagendar" ? (
          <Reagendamento
            form={form}
            setForm={setForm}
            alertCustom={alertCustom}
            onConfirm={(data) => handleAction("reschedule", data)}
          />
        ) : (
          modalConteudo.dados && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Serviços:
              </Typography>
              <Rows items={modalConteudo.dados.servicos} disabled={true} />
            </>
          )
        )}
      </Modal>
    </Modal>
  );
};

export default AgendamentoManual;
