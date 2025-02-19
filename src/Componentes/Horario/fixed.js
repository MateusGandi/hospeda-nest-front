import React, { useState } from "react";
import { TextField, InputAdornment, MenuItem } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const HorarioSelect = ({ onSelect, horarios, disabled = false }) => {
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  const handleChange = (event) => {
    setHorarioSelecionado(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <TextField
      select
      label="Selecione um horário"
      value={horarioSelecionado}
      onChange={handleChange}
      disabled={disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccessTimeIcon />
          </InputAdornment>
        ),
      }}
      fullWidth
    >
      {horarios.map((horario, index) => (
        <MenuItem key={index} value={horario}>
          {horario}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default HorarioSelect;
