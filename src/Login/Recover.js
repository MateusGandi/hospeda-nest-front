import React, { useState } from "react";
import {
  Grid2 as Grid,
  TextField,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { CustomInput } from "../Componentes/Custom";
import { formatPhone } from "../Componentes/Funcoes";
import { useNavigate } from "react-router-dom";

const Recover = ({ dados, setDados }) => {
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name == "telefone") {
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
        <a onClick={() => navigate("/login")} className="show-link">
          Já possui uma conta? Acesse-a
        </a>
      </Grid>
    </>
  );
};

export default Recover;
