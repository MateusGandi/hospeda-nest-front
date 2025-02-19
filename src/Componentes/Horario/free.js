import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const HorarioInput = () => {
  const [horario, setHorario] = useState("");

  const handleHorarioChange = (event) => {
    let valor = event.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    if (valor.length > 4) valor = valor.slice(0, 4); // Limita a 4 caracteres numéricos

    // Formata para o formato hh:mm
    if (valor.length <= 2) {
      setHorario(valor);
    } else {
      setHorario(`${valor.slice(0, 2)}:${valor.slice(2)}`);
    }
  };

  return (
    <TextField
      label="Horário"
      value={horario}
      onChange={handleHorarioChange}
      placeholder="hh:mm"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccessTimeIcon />
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: 5, // Limita o tamanho máximo do campo
      }}
      fullWidth
    />
  );
};

export default HorarioInput;
