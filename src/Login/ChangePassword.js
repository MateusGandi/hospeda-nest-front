import React, { useState } from "react";
import {
  Grid2 as Grid,
  TextField,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CustomInput } from "../Componentes/Custom";
import { formatPhone } from "../Componentes/Funcoes";

const ChangePassword = ({ dados, setDados }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
          placeholder="Informe sua nova senha"
          label="Senha"
          name="senha"
          type={showPassword ? "text" : "password"}
          value={dados.senha || ""}
          onChange={handleChange}
          variant="outlined"
          endIcon={
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility("password")}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>
    </>
  );
};

export default ChangePassword;
