import React, { useState, useMemo } from "react";
import { Box, Typography, Tooltip, Grid2 as Grid } from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import EditableTable from "../../../Componentes/Table";
import apiService from "../../../Componentes/Api/axios";

const CommissionCalculator = ({ funcionarios, servico, alertCustom }) => {
  const [rows, setRows] = useState(
    funcionarios.map((f) => ({
      id: f.id,
      nome: f.nome,
      percentual: f.percentual || 0,
      valorFixo: f.valorFixo || 0,
    }))
  );

  const handleTableChange = (updatedRows, rowIndex, field, value) => {
    const recalculated = updatedRows.map((row, index) => {
      if (index !== rowIndex) return row;

      const novoValor = parseFloat(value) || 0;
      let percentual = 0;
      let valorFixo = 0;

      if (field === "percentual") {
        percentual = Math.max(0, Math.min(novoValor, 100));
        valorFixo = (servico.valor * percentual) / 100;
      }

      if (field === "valorFixo") {
        valorFixo = Math.max(0, Math.min(novoValor, servico.valor));
        percentual = 0; // zera o percentual, como pedido
      }

      return {
        ...row,
        percentual: +percentual.toFixed(2),
        valorFixo: +valorFixo.toFixed(2),
      };
    });

    setRows(recalculated);
  };

  const totalComissao = useMemo(
    () => rows.reduce((sum, r) => sum + r.valorFixo, 0),
    [rows]
  );

  const columns = [
    { field: "nome", headerName: "Funcionário" },
    {
      field: "percentual",
      headerName: "% Comissão",
      editable: true,
      type: "number",
    },
    {
      field: "valorFixo",
      headerName: "R$ Comissão",
      editable: true,
      type: "number",
    },
  ];

  return (
    <EditableTable columns={columns} rows={rows} onChange={handleTableChange} />
  );
};

export default CommissionCalculator;
