import React, { useEffect, useState } from "react";

import Login from "./Login";
import CreateAccount from "./Create";
import Recover from "./Recover";
import ChangePassword from "./ChangePassword";

import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Componentes/Api/axios";
import Banner from "../Assets/Login/tonsus_mosaico.png";

import { getLocalItem, validarCampos } from "../Componentes/Funcoes";
import Complete from "./Complete";

const LoginPage = ({ page, alertCustom }) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [inicialState, setInicialState] = useState(null);
  const [dados, setDados] = useState({});

  const verifyAndRedirect = (dadosReceived, message, to) => {
    const lastPath = getLocalItem("lastRoute") || to || "/home";
    if (dadosReceived && dadosReceived.pendencia) {
      alertCustom(dadosReceived.motivo);
      navigate("/complete");
    } else {
      navigate(lastPath || "/home");
      alertCustom(message || "Acesso concedido!");
    }
  };

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
      verifyAndRedirect(data, "Login realizado com sucesso!", "/home");
    } catch (error) {
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

      verifyAndRedirect(data, "Senha atualizada com sucesso", "/home");
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao atualizar senha, verifique os dados!"
      );
    } finally {
      setInicialState((prev) => ({ ...prev, loadingButton: false }));
    }
  };

  const handleUpdate = async () => {
    setInicialState((prev) => ({ ...prev, loadingButton: true }));
    try {
      const { telefone, ...rest } = dados;

      await Api.query("PATCH", `/user/${getLocalItem("userId")}`, {
        telefone: telefone?.replace(/\D/g, ""),
      });
      verifyAndRedirect(null, "Dados atualizados com sucesso!", "/home");
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ??
          "Erro ao recuperar conta, verifique os dados!"
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

      alertCustom("Um link de recuperação será enviado para seu e-mail!");
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
      verifyAndRedirect(data, "Conta criada com sucesso!", "/home");
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
    complete: {
      titulo: "Complete seu cadastro",
      actionText: "Atualizar",
      componente: "complete",
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
      { campo: "nome", validacoes: "required, minLength(8)" },
      {
        campo: "telefone",
        validacoes: "required, minLength(16), telefone",
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
        label: "Nova senha",
        campo: "senha",
        validacoes: "required, minLength(5), equal(confirm)",
      },
      {
        label: "Senha que você confirmou",
        campo: "confirm",
        validacoes: "required, equal(senha)",
      },
    ],
    complete: [
      {
        campo: "telefone",
        validacoes: "required, minLength(12), telefone",
      },
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
        inicialState.componente == "complete" && handleUpdate();
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
        buttons={
          inicialState.componente == "complete"
            ? []
            : [
                {
                  type: "google",
                  text: google(inicialState.componente),
                  action: ({ credential }) => submitForm(credential),
                },
              ]
        }
        sx={{ background: "#000" }}
        buttonStyle={{ variant: "contained" }}
        maxWidth={"lg"}
        component="form"
        fullScreen="all"
        backAction={inicialState.backAction}
        images={[
          {
            styles: { width: "90%" },
            src: Banner,
          },

          // {
          //   src: "", //LogoBanner,
          //   styles: {
          //     // width: "40px",
          //     // height: "40px",
          //     // margin: "10px",
          //     // padding: "10px",
          //     // background: "#0195F7",
          //     // borderRadius: "10px",
          //   },
          //   text: {
          //     content: "Ferramentas personalizadas para o seu negócio!",
          //     variant: "h6",
          //   },
          // },
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
          {inicialState.componente == "complete" && (
            <Complete dados={dados} setDados={setDados} />
          )}
        </Grid>
      </Modal>
    )
  );
};

export default LoginPage;
