import React, { useEffect, useState } from "react";

import Login from "./Login";
import CreateAccount from "./Create";
import Recover from "./Recover";
import ChangePassword from "./ChangePassword";

import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../Componentes/Modal";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Componentes/Api/axios";
import Banner from "../Assets/banner_onboard.png";
import { Height } from "@mui/icons-material";
import { getLocalItem, isMobile } from "../Componentes/Funcoes";

const LoginPage = ({ page, alertCustom }) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [inicialState, setInicialState] = useState(null);
  const [dados, setDados] = useState({});

  const handleLogin = async () => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, ...rest } = dados;
      const data = await Api.query("POST", "/user/login", {
        ...rest,
        telefone: telefone.replace(/\D/g, ""),
      });
      Api.setKey(data);
      navigate(getLocalItem("lastRoute") ? getLocalItem("lastRoute") : "/home");
      alertCustom("Login realizado com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(error?.response?.data?.message ?? "Erro ao realizar login!");
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
    }
  };

  const handleChangePass = async () => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { senha, confirm } = dados;
      if (senha.length < 5 || confirm.length < 5)
        return alertCustom("Sua senha deve conter ao menos 5 caracteres!");
      else if (senha != confirm)
        return alertCustom("As senhas digitadas não são iguais!");

      const data = await Api.query("POST", `/user/recover/change/${hash}`, {
        senha,
      });
      Api.setKey(data);
      navigate(getLocalItem("lastRoute") ? getLocalItem("lastRoute") : "/home");
      alertCustom("Senha atualizada com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao atualizar senha, verifique os dados!"
      );
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
    }
  };

  const handleRecover = async () => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone } = dados;
      const data = await Api.query(
        "POST",
        `/user/recover/${telefone.replace(/\D/g, "")}`
      );

      alertCustom(data.message ?? "Solicitação enviada!");
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao recuperar conta, verifique os dados!"
      );
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
    }
  };

  const handleCreate = async () => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, confirmarSenha, senha, ...rest } = dados;

      if (senha.length < 5 || confirmarSenha.length < 5)
        return alertCustom("Sua senha deve conter ao menos 5 caracteres!");
      else if (senha != confirmarSenha)
        return alertCustom("As senhas digitadas não são iguais!");

      const data = await Api.query("POST", "/user/register", {
        ...rest,
        senha,
        telefone: telefone.replace(/\D/g, ""),
      });
      Api.setKey(data);
      navigate(getLocalItem("lastRoute") ? getLocalItem("lastRoute") : "/home");
      alertCustom("Conta criada com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao criar conta, verifique seus dados!"
      );
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
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
    change: {
      titulo: "Atualize sua senha",
      actionText: "Atualizar",
      componente: "change",
      backAction: {
        titulo: "Voltar",
        action: handleClose,
      },
    },
    recover: {
      titulo: "Recupere sua conta",
      actionText: "Recuperar",
      componente: "recover",
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
  }, [page, hash]);

  return (
    inicialState && (
      <Modal
        open={inicialState.open}
        onClose={handleClose}
        titulo={inicialState.titulo}
        actionText={inicialState.actionText}
        loadingButton={inicialState.loadingButton}
        onAction={() => {
          inicialState.componente == "create" && handleCreate();
          inicialState.componente == "login" && handleLogin();
          inicialState.componente == "recover" && handleRecover();
          inicialState.componente == "change" && handleChangePass();
        }}
        buttonStyle={{ variant: "contained" }}
        maxWidth={"md"}
        component="form"
        fullScreen="all"
        backAction={inicialState.backAction}
        image={{ styles: { height: "500px" }, src: Banner }}
      >
        <Grid container spacing={4}>
          {inicialState.componente == "create" && (
            <CreateAccount dados={dados} setDados={setDados} />
          )}
          {inicialState.componente == "login" && (
            <Login dados={dados} setDados={setDados} />
          )}
          {inicialState.componente == "recover" && (
            <Recover dados={dados} setDados={setDados} />
          )}
          {inicialState.componente == "change" && (
            <ChangePassword dados={dados} setDados={setDados} />
          )}
        </Grid>
      </Modal>
    )
  );
};

export default LoginPage;
