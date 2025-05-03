import React, { useState, useEffect } from "react";
import {
  Grid2 as Grid,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CustomInput } from "../Componentes/Custom";
import { useParams } from "react-router-dom";

const ChangePassword = ({ dados, setDados }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowConfirm((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDados((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (
      dados.senha &&
      dados.confirm &&
      dados.senha?.length <= dados.confirm?.length &&
      dados.senha != dados.confirm
    )
      setFeedback("●\tSenhas devem ser iguais");
    else if (dados.senha && dados.senha.length < 5)
      setFeedback("●\tSua senha deve conter ao menos 5 caracteres!");
    else setFeedback(null);
  }, [dados]);

  return (
    <>
      {" "}
      <Grid
        size={{ xs: 12 }}
        sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}
      >
        <CustomInput
          fullWidth
          placeholder="Informe sua nova senha"
          label="Senha"
          name="senha"
          type={showPassword ? "text" : "password"}
          value={dados?.senha || ""}
          onChange={handleChange}
          variant="outlined"
          endIcon={
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <CustomInput
          fullWidth
          placeholder="Confirme a nova senha"
          label="Confirmar Senha"
          name="confirm"
          type={showConfirm ? "text" : "password"}
          value={dados?.confirm || ""}
          onChange={handleChange}
          variant="outlined"
          endIcon={
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordConfirmVisibility} edge="end">
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>{" "}
      <Grid size={12} sx={{ height: 0 }}>
        {" "}
        <Typography color="error" variant="body1">
          {feedback}
        </Typography>
      </Grid>
    </>
  );
};

export default ChangePassword;
