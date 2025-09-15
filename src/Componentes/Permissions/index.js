import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Grid2 as Grid,
  Switch,
  Chip,
} from "@mui/material";
import apiService from "../Api/axios";
import { getLocalItem } from "../Funcoes";
import Modal from "../Modal/Simple";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const Permissions = ({
  type = "popup",
  open = false,
  alertCustom,
  handleClose,
}) => {
  const location = useLocation();
  const [modal, setModal] = useState({ open: open });
  const [showBottomPopup, setShowBottomPopup] = useState(false);

  useEffect(() => {
    setModal((prev) => ({ ...prev, open: open }));
  }, [open]);

  const initialPermissions = [
    {
      name: "flagCookies",
      label: "Permitir Cookies",
      description:
        "Cookies são utilizados para melhorar a sua experiência no site.",
      required: true,
      value: getLocalItem("flagCookies") || false,
    },
    {
      name: "flagEmail",
      label: "Permitir E-mail",
      description:
        "Precisamos do seu e-mail para enviar informações formais, recuperar sua conta e manter você informado sobre atualizações.",
      required: false,
      value: getLocalItem("flagEmail") || false,
    },
    {
      name: "flagTermos",
      label: "Aceitar Termos",
      description: (
        <>
          Você deve aceitar nossos{" "}
          <a
            href="/faq"
            rel="noopener noreferrer"
            style={{ color: "#0195F7", textDecoration: "none" }}
          >
            Termos de Serviço
          </a>{" "}
          para continuar.
        </>
      ),
      required: true,
      value: getLocalItem("flagTermos") || false,
    },
    {
      name: "flagWhatsapp",
      label: "Permitir WhatsApp",
      description:
        "Ao permitir o WhatsApp, você concorda em receber informações, notificações e utilizar o WhatsApp como meio de recuperação de conta e automações no futuro.",
      required: true,
      value: getLocalItem("flagWhatsapp") || false,
    },
  ];

  const [permissionsList, setPermissionsList] = useState(initialPermissions);

  const acceptAll = () => {
    const updated = permissionsList.map((perm) => ({
      ...perm,
      value: true,
    }));
    setPermissionsList(updated);
    handleSubmit(updated);
  };

  const handlePermissionChange = (event) => {
    const updated = permissionsList.map((perm) =>
      perm.name === event.target.name
        ? { ...perm, value: event.target.checked }
        : perm
    );
    setPermissionsList(updated);
  };

  const onClose = (force) => {
    setModal({ open: false });
    Permissions && !!handleClose && handleClose();
    if (force) Cookies.set("getPermission", "false", { expires: 1 });
  };

  const handleSubmit = async (customPermissions) => {
    const permissionsToCheck = customPermissions || permissionsList;

    const allRequiredChecked = permissionsToCheck.every(
      (perm) => !perm.required || perm.value
    );

    if (!allRequiredChecked) {
      alertCustom("Você precisa aceitar todas as permissões obrigatórias.");
      return;
    }

    try {
      const objToSave = {};
      permissionsToCheck.forEach((perm) => {
        objToSave[perm.name] = perm.value;
        localStorage.setItem(perm.name, perm.value);
      });

      await apiService.query(
        "PATCH",
        `/user/${getLocalItem("userId")}`,
        objToSave
      );
      alertCustom("Sucesso ao atualizar suas preferências");
      Cookies.set("getPermission", "false", { expires: 1 });
      setModal({ open: false });
    } catch (error) {
      onClose();
      alertCustom(
        "Erro ao registrar suas preferências, tentaremos novamente mais tarde!"
      );
    }
  };

  useEffect(() => {
    if (
      type == "popup" &&
      ["/login", "/create", "/recover", "/change", "/complete"].every(
        (rot) => window.location.pathname != rot
      )
    ) {
      const shouldPrompt =
        Cookies.get("getPermission") !== "false" &&
        getLocalItem("userId") &&
        (!getLocalItem("flagWhatsapp") ||
          !getLocalItem("flagTermos") ||
          !getLocalItem("flagCookies"));

      if (shouldPrompt) {
        setShowBottomPopup(true);
      }
    } else {
      setShowBottomPopup(false);
    }
  }, [location]);

  return (
    <>
      <Modal
        titulo="Permissões"
        open={modal.open}
        onClose={onClose}
        fullScreen="mobile"
        buttons={[
          {
            titulo: "Perguntar Depois",
            action: () => onClose(true),
            color: "terciary",
            variant: "outlined",
          },
          {
            titulo: "Aceitar tudo",
            variant: "outlined",
            action: acceptAll,
            color: "terciary",
          },
          {
            titulo: "Confirmar",
            action: () => handleSubmit(),
            color: "primary",
            variant: "contained",
            disabled: permissionsList
              .filter((p) => p.required)
              .some((perm) => !perm.value),
          },
        ]}
      >
        <Grid container spacing={2} sx={{ p: "0 8px" }}>
          <Grid xs={12}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Para continuar, por favor, forneça as permissões necessárias:
            </Typography>
          </Grid>

          {permissionsList.map((perm) => (
            <Grid
              key={perm.name}
              size={{ xs: 12, md: 6 }}
              className="show-box"
              sx={{ position: "relative" }}
            >
              <Chip
                label={perm.required ? "Necessário" : "Opcional"}
                color={perm.required ? "terciary" : "primary"}
                size="small"
                sx={{ position: "absolute", right: 10, top: 10 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={perm.value}
                    onChange={handlePermissionChange}
                    name={perm.name}
                    color="primary"
                  />
                }
                label={perm.label}
              />
              <Typography variant="body2" color="textSecondary">
                {perm.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Modal>

      {showBottomPopup && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#363636",
            zIndex: 9999,
            p: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body2">
                O Tonsus usa cookies para fazer o site funcionar da maneira
                esperada e para entender melhor como nossos usuários acessam o
                site. Para ver mais informações de como o Tonsus usa cookies,
                clique em saiba mais e personalize suas permissões.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="terciary"
                onClick={() => {
                  setShowBottomPopup(false);
                  setModal((prev) => ({ ...prev, open: true }));
                }}
              >
                Saiba mais
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disableElevation
                onClick={() => {
                  setShowBottomPopup(false);
                  acceptAll();
                }}
              >
                Aceitar tudo
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Permissions;
