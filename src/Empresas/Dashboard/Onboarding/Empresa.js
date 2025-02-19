import React, { useState } from "react";
import { Grid2 as Grid, Switch, Typography } from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";

const Empresa = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Nome da Empresa"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Typography component="div" variant="body1">
            Aberto:
          </Typography>
          <Switch
            name="aberto"
            checked={formData.aberto}
            onChange={handleChange}
            color="primary"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Empresa;
