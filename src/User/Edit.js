import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Button, Typography } from "@mui/material";
import Modal from "../Componentes/Modal";
import { CustomInput } from "../Componentes/Custom";
import { useNavigate } from "react-router-dom";
import { formatPhone } from "../Componentes/Funcoes";
import ListaAgendamentos from "./Agendamentos";
import Financeiro from "./Financeiro";

const Profile = ({
  formData,
  setFormData,
  open,
  setOpen,
  titulo,
  loading,
  alertCustom,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    if (formData) {
      setData({
        nome: formData.nome || "",
        email: formData.email || "",
        telefone: formData.telefone || "",
      });
    }
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "telefone")
      return setData({ ...data, [name]: formatPhone(value) });
    setData({ ...data, [name]: value });
  };

  const handleSave = () => {
    setFormData((prev) => [
      ...prev.filter((item) => item.id !== formData?.id),
      data,
    ]);
    setOpen(false);
  };

  const handleResetPassword = () => {
    console.log("Solicitação de reset de senha para:", data.email);
    // Aqui pode ser chamado um serviço de reset de senha
  };

  return (
    <Modal
      open={open}
      onClose={() => navigate(-1)}
      titulo={titulo}
      onAction={handleSave}
      actionText="Salvar"
      fullScreen="all"
      component="view"
      loading={loading}
      disablePadding={true}
      buttons={[
        {
          color: "error",
          action: handleResetPassword,
          titulo: "Resetar Senha",
        },
      ]}
    >
      <Financeiro usuario={formData} alertCustom={alertCustom} />
      <Grid container spacing={4} sx={{ m: 1 }}>
        <Grid item size={{ xs: 12, md: 12 }}>
          <Typography variant="h6">Editar meus dados</Typography>
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Nome"
            name="nome"
            value={data.nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder={"Informe seu nome"}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="E-mail"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder={"Informe seu email"}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Telefone"
            name="telefone"
            value={formatPhone(data.telefone)}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder={"Informe seu telefone"}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 12 }}>
          <Typography className="show-box">
            Ao editar seus dados você concorda com os termos e condições
          </Typography>{" "}
        </Grid>
        <Grid item size={{ xs: 12, md: 12 }}>
          <Typography variant="h6">Meus agendamentos</Typography>
        </Grid>
        <Grid item size={{ xs: 12, md: 12 }}>
          {" "}
          <ListaAgendamentos />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Profile;
