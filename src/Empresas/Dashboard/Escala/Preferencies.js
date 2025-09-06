import { Typography } from "@mui/material";
import React from "react";
import { Rows } from "../../../Componentes/Lista/Rows";

const Preferencies = ({ onChange, selected = false }) => {
  const options = [
    {
      titulo: "Trabalha com agendamentos",
      subtitulo:
        "Cliente ou o barbeiro escolhe um horário específico para reservarem",
      id: false,
    },
    {
      titulo: "Trabalha usando fila",
      subtitulo:
        "Barbeiro aloca clientes em uma fila de atendimento sem espaços vagos na agenda",
      id: true,
    },
  ];
  return (
    <Typography variant="body1">
      <Rows
        collapse
        distribution={2}
        items={options}
        onSelect={onChange}
        selectedItems={options.filter((op) => op.id === selected)}
        multipleSelect={false}
        checkmode={true}
        spacing={1}
      />
    </Typography>
  );
};

export default Preferencies;
