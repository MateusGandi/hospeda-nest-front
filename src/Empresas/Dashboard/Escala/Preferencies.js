import { Grid2 as Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Rows } from "../../../Componentes/Lista/Rows";

const Preferencies = ({ onChange, form }) => {
  const [modos] = useState([
    {
      titulo: "Trabalha com agendamentos",
      subtitulo:
        "Cliente ou o barbeiro escolhe um horário específico para reservarem",
      id: false,
      campo: "filaDinamicaClientes",
    },
    {
      titulo: "Trabalha usando fila",
      subtitulo:
        "Barbeiro aloca clientes em uma fila de atendimento sem espaços vagos na agenda",
      id: true,
      campo: "filaDinamicaClientes",
    },
  ]);

  const [filaConfig] = useState({
    clientesPodemEntrarNaFila: false,
    confirmacaoAutomaticaFila: false,
    options: [
      {
        titulo: "Cliente pode entrar sozinho na fila",
        subtitulo:
          "Permite que o cliente entre automaticamente na fila sem precisar do barbeiro",
        id: "clientesPodemEntrarNaFila",
      },
      {
        titulo: "Confirmar atendimentos automaticamente",
        subtitulo:
          "Ao final de cada tempo previsto, a fila é liberada automaticamente",
        id: "confirmacaoAutomaticaFila",
      },
    ],
  });

  const handleModoChange = (item) => {
    onChange({ campo: "filaDinamicaClientes", valor: item.id });
  };

  const handleFilaChange = (selectedItems) => {
    filaConfig.options.forEach(({ id }) => {
      const isSelected = selectedItems.some((item) => item.id === id);

      onChange({
        campo: id,
        valor: isSelected,
      });
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid size={12} sx={{ mb: -2 }}>
        <Typography variant="h6">Barbeiro</Typography>
      </Grid>
      <Grid size={12}>
        <Rows
          collapse
          distribution={2}
          items={modos}
          onSelect={handleModoChange}
          selectedItems={modos.filter(
            (op) => op.id === form.filaDinamicaClientes
          )}
          multipleSelect={false}
          checkmode={true}
          spacing={1}
        />
      </Grid>

      {form.filaDinamicaClientes === true && (
        <>
          <Grid size={12} sx={{ mb: -2 }}>
            <Typography variant="h6">Fila de clientes</Typography>
          </Grid>
          <Grid size={12}>
            <Rows
              collapse
              distribution={2}
              items={filaConfig.options}
              onSelect={handleFilaChange}
              selectedItems={filaConfig.options.filter((op) => form[op.id])}
              multipleSelect={true}
              checkmode={true}
              spacing={1}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Preferencies;
