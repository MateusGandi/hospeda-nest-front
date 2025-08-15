import React from "react";
import { Paper, Typography } from "@mui/material";
import { PaperList } from "../../../Componentes/Lista/Paper";
const teste = [
  {
    id: 0,
    titulo: "Fone de Ouvido Bluetooth",
    preco: 199.99,
    subtitulo:
      "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
  },
  {
    id: 1,
    titulo: "Fone de Ouvido Bluetooth",
    preco: 199.99,
    subtitulo:
      "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
  },
];

export default function InformacoesAdicionais({
  children,
  orderDetails = teste,
}) {
  return (
    <PaperList items={orderDetails}>
      <Paper sx={{ px: 2, py: 1, borderRadius: 0 }} elevation={0}>
        {children ? (
          children
        ) : (
          <Typography variant="h6"> Resumo do pedido</Typography>
        )}
      </Paper>
    </PaperList>
  );
}
