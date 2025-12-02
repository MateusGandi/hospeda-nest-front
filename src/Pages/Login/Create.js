import { Grid2 as Grid, IconButton, InputAdornment } from "@mui/material";

import { CustomInput } from "../../Components/Custom";";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { formatPhone } from "../../Components/Functions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Create = ({ dados, setDados }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "telefone")
      return setDados((prev) => ({ ...prev, [name]: formatPhone(value) }));

    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") return setShowPassword((prev) => !prev);
    if (field === "confirmPassword")
      return setShowConfirmPassword((prev) => !prev);
  };

  return (
    <>
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
        <Box sx={{ marginTop: "10px" }}>
          <a onClick={() => navigate("/login")} className="show-link">
            Já possui uma conta? Acesse-a
          </a>
        </Box>
      </Grid>
    </>
  );
};

export default Create;
