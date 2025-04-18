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
import Modal from "../Modal";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const Permissions = ({ alertCustom }) => {
  const location = useLocation();
  const [permissions, setPermissions] = useState({
    flagCookies: getLocalItem("flagCookies"),
    flagEmail: getLocalItem("flagEmail"),
    flagTermos: getLocalItem("flagTermos"),
    flagWhatsapp: getLocalItem("flagWhatsapp"),
  });
  const [modal, setModal] = useState({
    open: false,
  });

  const acceptAll = () => {
    const updated = {
      flagCookies: true,
      flagEmail: true,
      flagTermos: true,
      flagWhatsapp: true,
    };
    setPermissions(updated);
    handleSubmit(updated).then(() => {
      Cookies.set("getPermission", "false", { expires: 1 });
      setModal({ open: false });
    });
  };

  useEffect(() => {
    setModal((prev) => ({
      ...prev,
      open:
        Cookies.get("getPermission") != "false" &&
        getLocalItem("userId") &&
        !Object.keys(permissions).every(
          (key) => !!permissions[key] || key == "flagEmail"
        ), //flagEmail opcional
    }));
  }, [location]);

  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const onClose = (force) => {
    setModal((prev) => ({ ...prev, open: false }));
    if (force) Cookies.set("getPermission", "false", { expires: 1 });
  };

  const handleSubmit = async (items) => {
    try {
      Object.keys(permissions).map((key) =>
        localStorage.setItem(key, permissions[key])
      );
      await apiService.query(
        "PATCH",
        `/user/${getLocalItem("userId")}`,
        items || permissions
      );
      alertCustom("Sucesso ao atualizar suas preferências");
      onClose();
    } catch (error) {
      onClose();
      alertCustom(
        "Erro ao registrar suas preferências, tentaremos novamente mais tarde!"
      );
    }
  };

  return (
    <Modal
      titulo="Permissões"
      open={modal.open}
      onClose={onClose}
      actionText="Confirmar"
      onAction={handleSubmit}
      fullScreen="mobile"
      buttons={[
        {
          titulo: "Perguntar Depois",
          action: () => onClose(true),
          color: "terciary",
        },
        { titulo: "Aceitar tudo", action: acceptAll, color: "terciary" },
      ]}
    >
      <Grid container spacing={2} sx={{ p: "0 8px" }}>
        <Grid size={{ xs: 12, md: 12 }}>
          {" "}
          <Typography variant="body1" sx={{ mb: 2 }}>
            Para continuar, por favor, forneça as permissões necessárias:
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          className="show-box"
          sx={{ position: "relative" }}
        >
          <Chip
            label="Necessário"
            color="terciary"
            size="small"
            sx={{ position: "absolute", right: 10, top: 10 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={permissions.flagCookies}
                onChange={handlePermissionChange}
                name="flagCookies"
                color="primary"
              />
            }
            label="Permitir Cookies"
          />
          <Typography variant="body2" color="textSecondary">
            Cookies são utilizados para melhorar a sua experiência no site.
          </Typography>
        </Grid>

        {/* Permissão para E-mail */}
        <Grid
          size={{ xs: 12, md: 6 }}
          className="show-box"
          sx={{ position: "relative" }}
        >
          <Chip
            label="Opcional"
            color="primary"
            size="small"
            sx={{ position: "absolute", right: 10, top: 10 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={permissions.flagEmail}
                onChange={handlePermissionChange}
                name="flagEmail"
                color="primary"
              />
            }
            label="Permitir E-mail"
          />
          <Typography variant="body2" color="textSecondary">
            Precisamos do seu e-mail para enviar informações formais, recuperar
            sua conta e manter você informado sobre atualizações.
          </Typography>
        </Grid>

        {/* Aceitar Termos */}
        <Grid
          size={{ xs: 12, md: 6 }}
          className="show-box"
          sx={{ position: "relative" }}
        >
          <Chip
            label="Necessário"
            color="terciary"
            size="small"
            sx={{ position: "absolute", right: 10, top: 10 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={permissions.flagTermos}
                onChange={handlePermissionChange}
                name="flagTermos"
                color="primary"
              />
            }
            label="Aceitar Termos"
          />
          <Typography variant="body2" color="textSecondary">
            Você deve aceitar nossos{" "}
            <a
              href="/fac"
              rel="noopener noreferrer"
              style={{ color: "#0195F7", textDecoration: "none" }}
            >
              Termos de Serviço
            </a>{" "}
            para continuar.
          </Typography>
        </Grid>

        {/* Permissão para WhatsApp */}
        <Grid
          size={{ xs: 12, md: 6 }}
          className="show-box"
          sx={{ position: "relative" }}
        >
          <Chip
            label="Necessário"
            color="terciary"
            size="small"
            sx={{ position: "absolute", right: 10, top: 10 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={permissions.flagWhatsapp}
                onChange={handlePermissionChange}
                name="flagWhatsapp"
                color="primary"
              />
            }
            label="Permitir WhatsApp"
          />
          <Typography variant="body2" color="textSecondary">
            Ao permitir o WhatsApp, você concorda em receber informações,
            notificações e utilizar o WhatsApp como meio de recuperação de conta
            e automações no futuro.
          </Typography>
        </Grid>
      </Grid>

      {/* Botão de ação */}
    </Modal>
  );
};

export default Permissions;
