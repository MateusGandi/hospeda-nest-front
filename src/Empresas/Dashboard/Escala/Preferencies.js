import { Grid2 as Grid, Switch, Typography } from "@mui/material";
import React from "react";
import { Rows } from "../../../Componentes/Lista/Rows";

const Preferencies = ({ onChange, form }) => {
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
    <Grid container spacing={4}>
      <Grid size={12}>
        {" "}
        <Rows
          collapse
          distribution={2}
          items={options}
          onSelect={onChange}
          selectedItems={options.filter(
            (op) => op.id === form.filaDinamicaClientes
          )}
          multipleSelect={false}
          checkmode={true}
          spacing={1}
        />
      </Grid>
      <Grid size={{ xs: 0, md: 6 }}></Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {" "}
        {form.filaDinamicaClientes === true && (
          <Typography variant="body1">
            <span style={{ width: "30px" }}>
              <Switch
                checked={form.clienteEntra}
                onChange={() => onChange({ clienteEntra: !form.clienteEntra })}
                color="primary"
              />
            </span>
            <span>[FEATURE] Cliente pode entrar sozinho na fila</span>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Preferencies;
