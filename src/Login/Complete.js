import React, { useState } from "react";
import {
  Grid2 as Grid,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { CustomInput } from "../Componentes/Custom";
import { formatPhone } from "../Componentes/Funcoes";
import { useNavigate } from "react-router-dom";
import Icon from "../Assets/Emojis";

const Complete = ({ dados, setDados }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "telefone") {
      return setDados((prev) => ({ ...prev, [name]: formatPhone(value) }));
    }
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Grid item size={{ xs: 12 }}>
        <CustomInput
          fullWidth
          label="Telefone"
          placeholder="Informe seu telefone"
          name="telefone"
          type="tel"
          value={formatPhone(dados.telefone || "")}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <Typography variant="h6" className="show-box">
          <Icon>📌</Icon> Complete seu cadastro
          <Typography variant="body1">
            Precisamos de mais algumas informações suas para prosseguir
          </Typography>
        </Typography>
      </Grid>
    </>
  );
};

export default Complete;
