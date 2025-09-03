// StepEndereco.jsx
import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";
import { isMobile } from "../../../Componentes/Funcoes";

export default function StepEndereco({ formData = {}, handleChange }) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Estado"
          placeholder="Exemplo: Goiás"
          name="estado"
          value={formData.estado || ""}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Cidade"
          placeholder="Exemplo: Goiânia"
          name="cidade"
          value={formData.cidade || ""}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Bairro"
          placeholder="Exemplo: Jabuti"
          name="bairro"
          value={formData.bairro || ""}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
        <CustomInput
          fullWidth
          label="Logradouro"
          placeholder="Exemplo: Rua 1"
          name="logradouro"
          value={formData.logradouro || ""}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
}
