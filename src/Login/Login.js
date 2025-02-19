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

const Login = ({ dados, setDados }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    console.log("oi", name);
    if (name == "telefone") {
      console.log("oi");
      return setDados((prev) => ({ ...prev, [name]: formatPhone(value) }));
    }
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Grid item size={{ xs: 12 }}>
        <CustomInput
          label="Telefone"
          placeholder="Informe seu telefone"
          name="telefone"
          type="tel"
          value={formatPhone(dados.telefone || "")}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <CustomInput
          label="Senha"
          name="senha"
          placeholder="Informe sua senha"
          type={showPassword ? "text" : "password"}
          value={dados.senha || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          endIcon={
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item size={{ xs: 12 }}>
        <Link href="/recover">Esqueceu sua senha?</Link>
      </Grid>
    </>
  );
};

export default Login;
