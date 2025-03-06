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

const Recover = ({ dados, setDados }) => {
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
    </>
  );
};

export default Recover;
