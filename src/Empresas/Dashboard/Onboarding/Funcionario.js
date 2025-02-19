import React, { useState } from "react";
import {
  TextField,
  Grid2 as Grid,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";

const Funcionario = ({
  formData,
  setFormData,
  servicos,
  index = 0,
  setIndex,
  onDelete,
  onSelect,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const funcionarios = formData.funcionarios;
    funcionarios[index] = { ...funcionarios[index], [name]: value };

    setFormData({
      ...formData,
      funcionarios: funcionarios,
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nome do Funcionário"
            name="nome"
            value={formData.funcionarios[index].nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            label="Número de Telefone"
            name="telefone"
            value={formData.funcionarios[index].telefone}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="servicos-label">Serviços Prestados</InputLabel>
            <Select
              label="Serviços Prestados"
              labelId="servicos-label"
              name="servicosPrestados"
              multiple
              value={formData.funcionarios[index].servicosPrestados}
              onChange={handleChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {servicos.map((servico) => (
                <MenuItem key={servico} value={servico}>
                  <Checkbox
                    checked={formData.funcionarios[
                      index
                    ].servicosPrestados.includes(servico)}
                  />
                  <ListItemText primary={servico} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
          <Rows
            onDelete={onDelete}
            onSelect={(item) => setIndex(item.id)}
            items={formData.funcionarios
              .filter((item) => Object.values(item).every((value) => !!value))
              .map((item) => ({
                ...item,
                titulo: `${item.nome} - ${item.telefone}`,
                subtitulo: item.servicosPrestados.join(","),
              }))}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Funcionario;
