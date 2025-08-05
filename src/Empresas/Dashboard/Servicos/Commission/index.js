import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Icon from "../../../../Assets/Emojis";
import EditableTable from "../../../../Componentes/Table";
import { formatMoney } from "../../../../Componentes/Funcoes";

export default function Commission({ funcionarios, setFuncionarios, servico }) {
  const [rows, setRows] = useState(
    funcionarios.map((f) => ({
      id: f.id,
      nome: f.nome,
      percentual: f.percentual || 0,
      valorFixo: f.valorFixo || 0,
      id: f.comissao?.id || null,
    }))
  );
  const [servicoData, setServicoData] = useState(null);

  const onChangeCommission = (comissoes) => {
    const updatedFuncionarios = funcionarios.map((f) => {
      const comissao = comissoes.find((c) => c.id === f.id);
      return {
        ...f,
        id: comissao.id || null,
        percentual: comissao ? comissao.percentual : 0,
        valorFixo: comissao ? comissao.valorFixo : 0,
      };
    });
    setFuncionarios(updatedFuncionarios);
  };

  const columns = [
    { field: "nome", headerName: "Funcionário" },
    {
      field: "percentual",
      headerName: "% Comissão",
      editable: true,
      type: "text",
    },
    {
      field: "valorFixo",
      headerName: "R$ Comissão",
      editable: true,
      type: "text",
    },
  ];

  const handleTableChange = (updatedRows, rowIndex, field, value) => {
    const recalculated = updatedRows.map((row, index) => {
      if (index !== rowIndex) return row;

      let percentual = row.percentual;
      let valorFixo = row.valorFixo;

      if (field === "percentual") {
        percentual = Math.max(0, Math.min(value, 100));
        valorFixo = "";
      } else if (field === "valorFixo") {
        valorFixo = formatMoney(value); // << aqui usamos a nova função
        percentual = 0;
      }

      return {
        ...row,
        percentual: +percentual.toFixed(2),
        valorFixo,
      };
    });

    setRows(recalculated);
    onChangeCommission(recalculated);
  };

  useEffect(
    () => setServicoData({ valor: servico.preco, nome: servico.nome }),
    [servico]
  );

  return (
    <Grid container spacing={2}>
      <Grid item size={12}>
        <Typography variant="h6" className="show-box">
          <Icon>💸</Icon> Comissões
          <Typography variant="body1">
            Configure as comissões para os funcionários que realizarão este
            serviço. Você pode definir uma comissão fixa ou percentual para cada
            funcionário.
          </Typography>
        </Typography>
      </Grid>
      <Grid item size={12}>
        <EditableTable
          columns={columns}
          rows={rows}
          onChange={handleTableChange}
        />
      </Grid>
    </Grid>
  );
}
