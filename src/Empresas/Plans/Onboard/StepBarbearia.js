// StepBarbearia.jsx
import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";
import { isMobile } from "../../../Componentes/Funcoes";

export default function StepBarbearia({ formData = {}, handleChange }) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Nome do estabelecimento"
          value={formData.nome || ""}
          name="nome"
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Telefone"
          value={formData.telefone || ""}
          name="telefone"
          onChange={handleChange}
          variant="outlined"
          type="tel"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="CNPJ"
          value={formData.cnpj || ""}
          name="cnpj"
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
}
