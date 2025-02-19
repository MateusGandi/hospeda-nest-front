import React, { useState } from "react";
import { Chip, Button, Paper, Typography } from "@mui/material";
import Modal from "../Componentes/Modal";
import { Rows } from "../Componentes/Lista/Rows";

const agendamentos = [
  { id: 1, nome: "João Silva", status: "Atendido" },
  { id: 2, nome: "Maria Souza", status: "Cancelado" },
  { id: 3, nome: "Carlos Santos", status: "Não Compareceu" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Atendido":
      return "success";
    case "Cancelado":
      return "error";
    case "Não Compareceu":
      return "warning";
    default:
      return "default";
  }
};

const ListaAgendamentos = () => {
  const [modal, setModal] = useState({ open: false, agendamento: null });

  const handleOpen = (agendamento) => {
    setModal({ open: true, agendamento });
  };

  const handleClose = () => {
    setModal({ open: false, agendamento: null });
  };

  return (
    <>
      <Rows
        items={agendamentos.map((agendamento) => ({
          id: agendamento.id,
          titulo: (
            <Typography variant="body1" fontWeight="bold">
              {agendamento.nome}
            </Typography>
          ),
          subtitulo: (
            <Chip
              label={agendamento.status}
              color={getStatusColor(agendamento.status)}
            />
          ),
          action: () => handleOpen(agendamento),
        }))}
        onSelect={handleOpen}
        selectedItems={[]}
        multipleSelect={false}
        oneTapMode={true}
        disableTouchRipple={false}
      />

      <Modal
        open={modal.open}
        onClose={handleClose}
        titulo="Detalhes do Agendamento"
        backAction={{ action: handleClose, titulo: "Fechar" }}
      >
        <Typography>
          <strong>Nome:</strong> {modal.agendamento?.nome}
        </Typography>
        <Typography>
          <strong>Status:</strong> {modal.agendamento?.status}
        </Typography>
      </Modal>
    </>
  );
};

export default ListaAgendamentos;
