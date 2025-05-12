import React, { useEffect, useState } from "react";
import {
  Grid2 as Grid,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CustomInput } from "../Componentes/Custom";
import { formatPhone } from "../Componentes/Funcoes";
import { Link, useNavigate } from "react-router-dom";

const Create = ({ dados, setDados }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (
      dados.senha &&
      dados.confirmarSenha &&
      dados.senha?.length <= dados.confirmarSenha?.length &&
      dados.senha != dados.confirmarSenha
    )
      setFeedback("●\tSenhas devem ser iguais");
    else if (dados.senha?.length < 5)
      setFeedback("●\tSenha devem conter ao menos 5 caracteres!");
    else setFeedback(null);
  }, [dados]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "telefone") {
      return setDados((prev) => ({ ...prev, [name]: formatPhone(value) }));
    }
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <>
      {" "}
      <Grid item size={{ xs: 12 }}>
        <CustomInput
          fullWidth
          label="Nome"
          name="nome"
          type="name"
          placeholder="Informe seu nome"
          value={dados.nome || ""}
          onChange={handleChange}
          variant="outlined"
        />
      </Grid>
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
        <CustomInput
          fullWidth
          placeholder="Informe sua senha"
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
      <Grid item size={{ xs: 12 }}>
        <CustomInput
          fullWidth
          label="Confirmar Senha"
          placeholder="Repita sua senha"
          name="confirmarSenha"
          type={showConfirmPassword ? "text" : "password"}
          value={dados.confirmarSenha || ""}
          onChange={handleChange}
          variant="outlined"
          endIcon={
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility("confirmPassword")}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>{" "}
      <Grid item size={12} sx={{ height: 0 }}>
        <a onClick={() => navigate("/login")} className="show-link">
          Já possui uma conta? Acesse-a
        </a>
        <Typography color="error" variant="body1">
          {feedback}
        </Typography>
      </Grid>
    </>
  );
};

export default Create;
