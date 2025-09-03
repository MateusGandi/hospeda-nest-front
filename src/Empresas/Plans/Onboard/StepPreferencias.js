// StepPreferencias.jsx
import React from "react";
import {
  Grid2 as Grid,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Icon from "../../../Assets/Emojis";

export default function StepPreferencias({ formData = {}, handleChange }) {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControlLabel
          control={
            <Switch
              name="meAsEmployee"
              checked={!!formData.meAsEmployee}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Sou funcionário também"
        />
      </Grid>

      <Grid size={12} sx={{ m: "8px 0" }}>
        <Typography variant="h6" className="show-box">
          <Icon>🎁</Icon> Benefícios
          <Typography variant="body1">
            Ao fazer seu cadastro você testa durante o mês todo as principais
            funcionalidades do sistema sem compromisso algum!
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  );
}
