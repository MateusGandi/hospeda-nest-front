import React, { useState } from "react";
import {
  Grid2 as Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const Escala = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Dados da Escala:", formData);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Permitir Agendamentos */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="permitir-agendamentos-label">
              Permitir Agendamentos
            </InputLabel>
            <Select
              label="Permitir Agendamentos"
              labelId="permitir-agendamentos-label"
              name="permitirAgendamentos"
              value={formData.permitirAgendamentos}
              onChange={handleChange}
            >
              <MenuItem value="semana">Para a Semana</MenuItem>
              <MenuItem value="mes">Para o Mês</MenuItem>
              <MenuItem value="dia">Somente para o Dia</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Escala */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="escala-label">Escala</InputLabel>
            <Select
              label="Escala"
              labelId="escala-label"
              name="escala"
              value={formData.escala}
              onChange={handleChange}
            >
              <MenuItem value="vagas">Por Quantidade de Vagas</MenuItem>
              <MenuItem value="tempo">Por Tempo Médio de Serviço</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Campo Condicional */}
        {formData.escala === "vagas" && (
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              label="Quantidade de Vagas por Dia"
              type="number"
              name="quantidadeVagas"
              value={formData.quantidadeVagas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantidadeVagas: Math.max(
                    0,
                    Math.min(24, Number(e.target.value))
                  ),
                })
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
        )}

        {formData.escala === "tempo" && (
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="tempo-medio-label">Tempo Médio</InputLabel>
              <Select
                label="Tempo Médio"
                labelId="tempo-medio-label"
                name="tempoMedio"
                value={formData.tempoMedio}
                onChange={handleChange}
              >
                <MenuItem value="0.5">30 Minutos</MenuItem>
                <MenuItem value="1">1 Hora</MenuItem>
                <MenuItem value="2">2 Horas</MenuItem>
                <MenuItem value="3">3 Horas</MenuItem>
                <MenuItem value="5">5 Horas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Escala;
