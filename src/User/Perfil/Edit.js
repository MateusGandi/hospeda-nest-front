import React, { useState } from "react";
import { Grid2 as Grid, Typography, Box, Button } from "@mui/material";
import Modal from "../../Componentes/Modal/Simple";
import { CustomInput } from "../../Componentes/Custom";
import apiService from "../../Componentes/Api/axios";
import { getLocalItem } from "../../Componentes/Funcoes";
import { formatPhone } from "../../Componentes/Funcoes";

const EditUserModal = ({ open, onClose, alertCustom, userData, buscar }) => {
  const [formData, setFormData] = useState({
    nome: userData?.nome || "",
    email: userData?.email || "",
    telefone: userData?.telefone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Cria um objeto apenas com os campos alterados
      const changedData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== userData[key]) {
          changedData[key] =
            key === "telefone"
              ? formData[key].replace(/\D/g, "")
              : formData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        alertCustom("Nenhuma alteração foi feita!");
        return;
      }

      await apiService.query(
        "PATCH",
        `/user/${getLocalItem("userId")}`,
        changedData
      );
      alertCustom("Dados atualizados com sucesso!");
      onClose();
      buscar();
    } catch (error) {
      alertCustom("Erro ao atualizar os dados, tente novamente mais tarde.");
    }
  };

  const handleClose = () => {
    setFormData({
      nome: userData?.nome || "",
      email: userData?.email || "",
      telefone: userData?.telefone || "",
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      titulo="Editar seus dados"
      fullScreen="all"
      buttons={[
        { titulo: "cancelar", action: handleClose, color: "terciary" },
        {
          titulo: "Salvar",
          variant: "contained",
          action: handleSubmit,
          color: "primary",
          disabled: !formData.nome || !formData.email || !formData.telefone,
        },
      ]}
    >
      <Box>
        <Grid container spacing={3} sx={{ m: 1, pt: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              placeholder="Informe seu nome"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              placeholder="Informe seu email"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Telefone"
              name="telefone"
              value={formatPhone(formData.telefone)}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              placeholder="Informe seu telefone"
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
