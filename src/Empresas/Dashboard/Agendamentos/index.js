import React, { useEffect, useState } from "react";
import { Button, Container, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { Rows } from "../../../Componentes/Lista/Rows";
import Calendario from "../../../Componentes/Calendar";
import { format } from "date-fns";
import { isMobile } from "../../../Componentes/Funcoes";

const AgendamentoManual = ({ open, handleClose, alertCustom }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState([]);
  const [modalConteudo, setModalConteudo] = useState({
    open: false,
    titulo: "",
    dados: null,
  });
  const status = {
    reschedule: "reagendamento",
    cancelled: "cancelamento",
    report: "reporte",
  };
  const buttons = [
    {
      titulo: "Reagendar",
      color: "warning",
      route: "reschedule",
      action: () => handleAction("reschedule"),
    },
    {
      titulo: "Cancelar",
      color: "error",
      route: "cancelled",
      action: () => handleAction("cancelled"),
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

      // Simulando resposta da API
      setAgendamentos(
        [
          {
            id: 44,
            data: "2025-02-11T20:30:00.000Z",
            dataFinalizacao: "2025-02-11T21:00:00.000Z",
            nomeCliente: "João Silva",
            status: "PENDING",
            servicos: [
              { titulo: "Corte de cabelo", subtitulo: "R$ 13,99" },
              { titulo: "Barba", subtitulo: "R$ 13,99" },
            ],
          },
          {
            id: 43,
            data: "2025-02-27T17:30:00.000Z",
            dataFinalizacao: "2025-02-27T18:00:00.000Z",
            nomeCliente: "Maria Souza",
            status: "PENDING",
            servicos: [{ titulo: "Coloração", subtitulo: "R$ 15,99" }],
          },
        ].map((item) => ({
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
  }, [open]);

  const handleAction = async (acao) => {
    try {
      await Api.query("PATCH", `/scheduling/${acao}/${modalConteudo.dados.id}`);
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
            <Typography variant="body1" color="GrayText">
              Data selecionada
            </Typography>
            <Button
              color="primary"
              onClick={() =>
                setModalConteudo({
                  open: true,
                  titulo: "Selecione um dia",
                  dados: "calendario",
                })
              }
              variant="outlined"
              fullWidth={isMobile}
              sx={{ border: "1px solid #484848", m: "8px 0" }}
            >
              {dataSelecionada.toLocaleDateString()}
            </Button>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            {agendamentos.length ? (
              <Rows
                items={agendamentos}
                onSelect={(item) =>
                  setModalConteudo({
                    open: true,
                    titulo: item.titulo,
                    dados: item,
                  })
                }
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
                  Sua agenda está vazia para esse dia
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
        buttons={modalConteudo.dados != "calendario" ? buttons : []}
        onAction={
          modalConteudo.dados == "calendario" ? null : () => console.log("oi")
        }
        actionText="Concluído"
      >
        {modalConteudo.dados === "calendario" ? (
          <Calendario
            onSelect={(date) => {
              setDataSelecionada(date);
              setModalConteudo({ open: false, titulo: "", dados: null });
            }}
          />
        ) : (
          modalConteudo.dados && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Serviços:
              </Typography>
              <Rows
                items={modalConteudo.dados.servicos}
                oneTapMode={true}
                disableTouchRipple={true}
              />
            </>
          )
        )}
      </Modal>
    </Modal>
  );
};

export default AgendamentoManual;
