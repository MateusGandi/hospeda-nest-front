import { Box, Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";

import API from "../../Components/Axios";
import CreateAccount from "./Create";
import Login from "./Login";
import View from "../../Components/View";
import { useNavigate } from "react-router-dom";
import { validateFields } from "../../Components/Functions";

const LoginPage = ({ page, alertCustom }) => {
  const navigate = useNavigate();
  const [inicialState, setInicialState] = useState(null);
  const [dados, setDados] = useState({});

  const verifyAndRedirect = async (message) => {
    navigate("/");
    alertCustom(message);
  };

  const handleLogin = async (token) => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, ...rest } = dados;
      const data = await API.query("POST", "/user/login", {
        ...rest,
        token,
        telefone: telefone?.replace(/\D/g, ""),
      });

      API.setData(data);
      verifyAndRedirect("Login realizado com sucesso!");
    } catch (error) {
      alertCustom(error?.response?.data?.message ?? "Erro ao realizar login!");
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
    }
  };

  const handleCreate = async () => {
    try {
      const { telefone, ...rest } = dados;

      const data = await API.query("POST", "/user/create", {
        ...rest,
        telefone: telefone?.replace(/\D/g, ""),
      });

      API.setData(data);
      verifyAndRedirect("Conta criada com sucesso!");
    } catch (error) {
      alertCustom(error?.response?.data?.message ?? "Erro ao criar conta!");
    }
  };

  const handleClose = () => {
    navigate("/home");
  };

  const paginas = {
    login: {
      titulo: "Acesse sua conta",
      actionText: "Entrar",
      componente: "login",
      backAction: {
        titulo: "Voltar",
        action: handleClose,
      },
    },

    create: {
      titulo: "Crie sua conta",
      actionText: "Criar",
      componente: "create",
      backAction: {
        titulo: "Voltar",
        action: handleClose,
      },
    },
  };

  useEffect(() => {
    if (page)
      setInicialState({
        open: true,
        ...paginas[page],
      });
    else setInicialState(null);
  }, [page]);

  const componentValidations = {
    create: [
      { campo: "nome", validacoes: "required, minLength(8)" },
      { campo: "telefone", validacoes: "required, minLength(16), phone" },
      {
        campo: "senha",
        validacoes: "required, minLength(5), equal(confirmarSenha)",
      },
      { campo: "confirmarSenha", validacoes: "required, equal(senha)" },
    ],
    login: [
      { campo: "telefone", validacoes: "required, minLength(10), phone" },
      { campo: "senha", validacoes: "required" },
    ],
  };

  const submitForm = async () => {
    try {
      await validateFields(
        inicialState.componente,
        dados,
        componentValidations
      ).then(() => {
        inicialState.componente === "create" && handleCreate();
        inicialState.componente === "login" && handleLogin();
      });
    } catch (error) {
      alertCustom(error.message || "Erro ao submeter o formulário!");
    }
  };

  if (!inicialState) return null;

  return (
    <View
      titulo={inicialState.titulo}
      maxWidth="lg"
      buttons={[
        {
          titulo: inicialState.actionText,
          action: submitForm,
          variant: "contained",
          color: "primary",
          disabled: inicialState.loadingButton,
        },
      ]}
    >
      <Grid container spacing={4}>
        {inicialState.componente === "create" && (
          <CreateAccount dados={dados} setDados={setDados} />
        )}

        {inicialState.componente === "login" && (
          <Login dados={dados} setDados={setDados} />
        )}
      </Grid>
    </View>
  );
};

export default LoginPage;
