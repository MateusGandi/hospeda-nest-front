import React, { useState } from "react";
import { Grid2 as Grid, Switch, Typography } from "@mui/material";
import { CustomInput } from "../../../../Componentes/Custom";
import { formatPhone } from "../../../../Componentes/Funcoes";

const ClienteForm = ({ formData, setFormData }) => {
  const handleChange = (field) => (event) => {
    if (field == "telefone")
      return setFormData({
        ...formData,
        [field]: formatPhone(event.target.value),
      });
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={{ xs: 12, md: 6 }}>
        <CustomInput
          fullWidth
          placeholder="Digite o nome"
          label="Nome"
          value={formData?.nome}
          onChange={handleChange("nome")}
          variant="outlined"
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 6 }}>
        <CustomInput
          fullWidth
          label="Telefone"
          placeholder="Digite o telefone"
          value={formatPhone(formData?.telefone)}
          onChange={handleChange("telefone")}
          variant="outlined"
          type="tel"
        />
      </Grid>
    </Grid>
  );
};

export default ClienteForm;
