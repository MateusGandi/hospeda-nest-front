import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Icon from "../../../../Assets/Emojis";
import EditableTable from "../../../../Componentes/Table";
import { formatMoney } from "../../../../Componentes/Funcoes";

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

export default function Commission({
  servico,
  comissoes,
  funcionarios,
  setFuncionarios,
}) {
  const [rows, setRows] = useState(comissoes || []);
  const [servicoData, setServicoData] = useState(null);

  const onChangeCommission = (comissoesAtt) => {
    const updatedFuncionarios = funcionarios.map((f) => {
      const comissao = comissoesAtt.find((c) => c.funcionarioId === f.id);

      return {
        ...f,
        comissao: comissao
          ? {
              id: comissao.id,
              funcionarioId: f.id,
              tipo: comissao.percentual ? "PERCENTUAL" : "VALOR",
              valor: comissao.percentual || comissao.valorFixo || 0,
              percentual: comissao.percentual,
              valorFixo: comissao.valorFixo,
            }
          : {
              funcionarioId: f.id,
              tipo: "VALOR",
              valor: 0,
              percentual: 0,
              valorFixo: 0,
            },
      };
    });

    setFuncionarios(updatedFuncionarios);
  };

  const handleTableChange = (updatedRows, rowIndex, field, value) => {
    const recalculated = updatedRows.map((row, index) => {
      if (index !== rowIndex) return row;

      let percentual = row.percentual;
      let valorFixo = row.valorFixo;

      if (field === "percentual") {
        const num = Math.max(0, Math.min(Number(value), 100));
        percentual = isNaN(num) ? 0 : Number(num.toFixed(2));
        valorFixo = 0;
      } else if (field === "valorFixo") {
        const num = formatMoney(value);
        valorFixo = Number(num) > servicoData.valor ? servicoData.valor : num;
        percentual = 0;
      }

      return {
        ...row,
        id: row.id,
        funcionarioId: row.funcionarioId || row.id,
        nome: row.nome,
        percentual,
        valorFixo,
      };
    });

    setRows(recalculated);
    onChangeCommission(recalculated);
  };

  useEffect(() => {
    setServicoData({ valor: servico.preco, nome: servico.nome });
  }, [servico]);

  useEffect(() => {
    if (comissoes?.length) {
      setRows(
        comissoes.map((c) => ({
          id: c.id,
          funcionarioId: c.funcionarioId,
          nome: c.nome,
          percentual: formatMoney(c.percentual) || 0,
          valorFixo: formatMoney(c.valorFixo) || 0,
        }))
      );
    }
  }, [comissoes]);

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
