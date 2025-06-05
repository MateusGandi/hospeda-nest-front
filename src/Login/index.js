import React, { useEffect, useState } from "react";

import Login from "./Login";
import CreateAccount from "./Create";
import Recover from "./Recover";
import ChangePassword from "./ChangePassword";

import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../Componentes/Modal";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Componentes/Api/axios";
import Banner from "../Assets/Login/tonsus_grafitti.png";
import LogoBanner from "../Assets/Login/tonsus_logo_white.png";

import { getLocalItem, validarCampos } from "../Componentes/Funcoes";

const LoginPage = ({ page, alertCustom }) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [inicialState, setInicialState] = useState(null);
  const [dados, setDados] = useState({});

  const handleLogin = async (token) => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, ...rest } = dados;
      const data = await Api.query("POST", "/user/login", {
        ...rest,
        token,
        telefone: telefone?.replace(/\D/g, ""),
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
      const { senha } = dados;

      const data = await Api.query("POST", `/user/recover/change/${hash}`, {
        password: senha,
      });
      Api.setKey(data);
      navigate("/login");
      alertCustom("Senha atualizada com sucesso, faça login novamente!");
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
      await Api.query("POST", `/user/recover/${telefone.replace(/\D/g, "")}`);

      alertCustom(
        "Um link de recuperação será enviado para seu e-mail e WhatsApp!"
      );
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

  const handleCreate = async (token) => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, confirmarSenha, senha, ...rest } = dados;

      const data = await Api.query("POST", "/user/register", {
        ...rest,
        senha,
        token,
        telefone: telefone?.replace(/\D/g, ""),
      });
      Api.setKey(data);
      navigate(getLocalItem("lastRoute") ? getLocalItem("lastRoute") : "/home");
      alertCustom("Conta criada com sucesso!");
    } catch (error) {
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

  const google = (type = "") => {
    return (
      {
        create: "signup_with",
        login: "signin_with",
        recover: "signin_with",
        change: "continue_with",
      }[type] || "signin"
    );
  };

  const componentValidations = {
    create: [
      { campo: "nome", validacoes: "required, minLength(10)" },
      {
        campo: "telefone",
        validacoes: "required, minLength(18), telefone",
      },
      {
        campo: "senha",
        validacoes: "required, minLength(5), equal(confirmarSenha)",
      },
      { campo: "confirmarSenha", validacoes: "required, equal(senha)" },
    ],
    login: [
      {
        campo: "telefone",
        validacoes: "required, minLength(10), telefone",
      },
      { campo: "senha", validacoes: "required" },
    ],
    recover: [
      {
        campo: "telefone",
        validacoes: "required, minLength(13), telefone",
      },
    ],
    change: [
      {
        campo: "senha",
        validacoes: "required, minLength(5), equal(confirmarSenha)",
      },
      { campo: "confirmarSenha", validacoes: "required, equal(senha)" },
    ],
  };

  const submitForm = async (TOKEN) => {
    try {
      if (TOKEN) {
        return inicialState.componente == "create"
          ? handleCreate(TOKEN)
          : handleLogin(TOKEN);
      }

      await validarCampos(
        inicialState.componente,
        dados,
        componentValidations
      ).then(() => {
        inicialState.componente == "create" && handleCreate();
        inicialState.componente == "login" && handleLogin();
        inicialState.componente == "recover" && handleRecover();
        inicialState.componente == "change" && handleChangePass();
      });
    } catch (error) {
      alertCustom(error.message || "Erro ao submeter o formulário!");
    }
  };

  return (
    inicialState && (
      <Modal
        open={inicialState.open}
        onClose={handleClose}
        titulo={inicialState.titulo}
        actionText={inicialState.actionText}
        loadingButton={inicialState.loadingButton}
        componentName={inicialState.componente}
        onAction={submitForm}
        buttons={[
          {
            type: "google",
            text: google(inicialState.componente),
            action: async ({ credential }) => {
              await submitForm(credential);
            },
          },
        ]}
        buttonStyle={{ variant: "contained" }}
        maxWidth={"md"}
        component="form"
        fullScreen="all"
        backAction={inicialState.backAction}
        images={[
          {
            styles: { width: "100%", marginTop: "12vh", marginLeft: "-100px" },
            src: Banner,
          },

          {
            //   src: LogoBanner,
            //   styles: {
            //     width: "40px",
            //     height: "40px",
            //     margin: "10px",
            //     padding: "10px",
            //     background: "#0195F7",
            //     borderRadius: "10px",
            //   },
            // text: {
            //   content: "Sua plataforma de gestão e agendamentos",
            //   variant: "h5",
            // },
          },
        ]}
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
