import React, { useState } from "react";
import { TextField, Grid2 as Grid, Switch, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { CustomInput } from "../../../Componentes/Custom";
const EditData = ({ open, handleClose, initialData, onSave, alertCustom }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const onChangeAndSave = async (aberto) => {
    try {
      await Api.query("PATCH", `/establishment/${initialData.id}`, {
        aberto: aberto,
      });
    } catch (error) {
      alertCustom("Erro ao mudar status do estabelecimento");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        titulo={"Atualizar dados"}
        onAction={handleSave}
        actionText={"Salvar"}
        fullScreen="all"
        component="modal"
      >
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={handleChange("nome")}
              variant="outlined"
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Telefone"
              value={formData.telefone}
              onChange={handleChange("telefone")}
              variant="outlined"
              type="tel"
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Endereço"
              value={formData.endereco}
              onChange={handleChange("endereco")}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Modal>
      <Grid container alignItems="center">
        <Typography variant="body1" sx={{ marginRight: 1 }}>
          {formData.aberto ? "Aberto" : "Fechado"}
        </Typography>{" "}
        <Switch
          checked={formData.aberto}
          onChange={async (e) => {
            setFormData({ ...formData, aberto: e.target.checked });
            await onChangeAndSave(e.target.checked);
          }}
          color="primary"
        />{" "}
      </Grid>
    </>
  );
};

export default EditData;
