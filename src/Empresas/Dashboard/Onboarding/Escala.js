import React, { useState } from "react";
import {
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { CustomSelect } from "../../../Componentes/Custom";
import Icon from "../../../Assets/Emojis";

const Escala = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Grid container spacing={2} justifyContent={"center"}>
        {/* Permitir Agendamentos */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomSelect
            fullWidth
            value={null}
            onChange={handleChange}
            label="Permitir Agendamentos"
            options={[
              {
                label: "Por semana",
                value: "semanal",
              },
              {
                label: "Por mês",
                value: "mensal",
              },
              {
                label: "Por Dia",
                value: "diario",
              },
            ]}
          />
        </Grid>

        {/* Escala */}
        <Grid item size={{ xs: 12, md: 12 }}>
          <Typography variant="h6" className="show-box">
            <Icon>📌</Icon>Atenção
            <Typography variant="body1">
              A escala usada no aplicativo varia por tempo médio de cada serviço
              cadastrado. Ajustamos as vagas para que se encaixem perfeitamente
              na sua agenda.
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Escala;
