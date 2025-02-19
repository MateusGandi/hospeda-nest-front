import React, { useEffect, useState } from "react";
import Login from "./Login";
import CreateAccount from "./Create";
import { Grid2 as Grid } from "@mui/material";
import Modal from "../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import Api from "../Componentes/Api/axios";

const LoginPage = ({ page, alertCustom }) => {
  const navigate = useNavigate();
  const [inicialState, setInicialState] = useState(null);
  const [dados, setDados] = useState({});

  const handleLogin = async () => {
    try {
      const { telefone, ...rest } = dados;
      const data = await Api.query("POST", "/user/login", {
        ...rest,
        telefone: telefone.replace(/\D/g, ""),
      });
      Api.setKey(data);
      navigate(data.initialPath ? data.initialPath : "/estabelecimentos");
      alertCustom("Login realizado com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(error?.response?.data?.message ?? "Erro ao realizar login!");
    }
  };

  const handleCreate = async () => {
    try {
      const { telefone, ...rest } = dados;
      const data = await Api.query("POST", "/user/register", {
        ...rest,
        telefone: telefone.replace(/\D/g, ""),
      });
      Api.setKey(data);
      navigate(data.initialPath ? data.initialPath : "/estabelecimentos");
      alertCustom("Conta criada com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao criar conta, verifique seus dados!"
      );
    }
  };
  const paginas = {
    login: {
      titulo: "Acesse sua conta",
      actionText: "Entrar",
      componente: "login",
      backAction: {
        titulo: "Criar uma conta",
        action: () => {
          setDados({});
          navigate("/create");
        },
      },
    },

    create: {
      titulo: "Crie sua conta",
      actionText: "Criar",
      componente: "create",
      backAction: {
        titulo: "Já tenho uma conta",
        action: () => {
          setDados({});
          navigate("/login");
        },
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

  const handleClose = () => {
    navigate("/onboard");
  };

  return (
    inicialState && (
      <Modal
        open={inicialState.open}
        onClose={handleClose}
        titulo={inicialState.titulo}
        actionText={inicialState.actionText}
        onAction={() =>
          inicialState.componente == "create" ? handleCreate() : handleLogin()
        }
        buttonStyle={{ variant: "outlined", border: "1px solid #606060" }}
        maxWidth="xs"
        component="form"
        fullScreen="all"
        backAction={inicialState.backAction}
      >
        <Grid container spacing={4}>
          {inicialState.componente == "create" ? (
            <CreateAccount dados={dados} setDados={setDados} />
          ) : (
            <Login dados={dados} setDados={setDados} />
          )}
        </Grid>
      </Modal>
    )
  );
};

export default LoginPage;
