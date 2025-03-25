import React, { useEffect, useState } from "react";
import { Chip, Typography, Box } from "@mui/material";
import Modal from "../Componentes/Modal";
import { Rows } from "../Componentes/Lista/Rows";
import apiService from "../Componentes/Api/axios";
import { format } from "date-fns";
import { PaperList } from "../Componentes/Lista/Paper";

const getStatus = (status) => {
  switch (status) {
    case "PENDING":
      return { color: "success", valor: "Agendado" };
    case "NOT_ATTEND":
    case "Não Compareceu":
      return { color: "error", valor: "Não atendido" };
    default:
      return { color: "warning", valor: "Não atendido" };
  }
};

const ListaAgendamentos = ({ alertCustom, usuario }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [modal, setModal] = useState({ open: false, agendamento: null });

  const handleOpen = (agendamento) => {
    setModal({ open: true, agendamento });
  };

  const handleClose = () => {
    setModal({ open: false, agendamento: null });
  };

  const handleGetScheduling = async () => {
    try {
      const data = await apiService.query(
        "GET",
        `/scheduling/user/${usuario.id}`
      );
      setAgendamentos(data);
    } catch (error) {
      alertCustom("Erro ao buscar agendamentos");
    }
  };

  useEffect(() => {
    handleGetScheduling();
  }, []);

  return (
    <>
      {agendamentos.length > 0 && (
        <Rows
          items={agendamentos.slice(0, 3).map((agendamento) => ({
            id: agendamento.id,
            titulo: (
              <Box alignItems="center" gap={1}>
                <Typography variant="body1">
                  {agendamento.atendente?.barbearia ?? "Barbearia Nome"}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: -0.5 }}
                >
                  Funcionário: {agendamento.atendente?.nome ?? "Desconhecido"}
                </Typography>
              </Box>
            ),
            subtitulo: (
              <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                <Chip
                  label={getStatus(agendamento.status).valor}
                  color={getStatus(agendamento.status).color}
                  size="small"
                />
                <Typography variant="body2" color="textSecondary">
                  {agendamento.data
                    ? format(new Date(agendamento.data), "dd/MM/yyyy HH:mm")
                    : "Data não informada"}
                </Typography>
              </Box>
            ),
            action: () => handleOpen(agendamento),
          }))}
          onSelect={handleOpen}
          selectedItems={[]}
          multipleSelect={false}
          oneTapMode={true}
          disableTouchRipple={false}
        />
      )}

      <Modal
        open={modal.open}
        onClose={handleClose}
        titulo="Detalhes do Agendamento"
      >
        {modal.agendamento && (
          <>
            <PaperList
              items={[
                {
                  titulo: "Data",
                  subtitulo: modal.agendamento.data
                    ? format(
                        new Date(modal.agendamento.data),
                        "dd/MM/yyyy HH:mm"
                      )
                    : "Data não informada",
                },
                ...modal.agendamento.servico.map((item) => ({
                  titulo: item.nome,
                  subtitulo: item.tempoGasto,
                })),
              ]}
            >
              <Typography variant="h6" sx={{ p: 1 }}>
                Produtos e serviços
              </Typography>
            </PaperList>

            <Typography sx={{ p: 1 }}>
              Atendimento por:{" "}
              {modal.agendamento.atendente?.nome ?? "Não informado"}
            </Typography>
          </>
        )}
      </Modal>
    </>
  );
};

export default ListaAgendamentos;
