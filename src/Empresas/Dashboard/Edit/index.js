import React, { useEffect, useState } from "react";
import { TextField, Grid2 as Grid, Switch, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { CustomInput } from "../../../Componentes/Custom";
import { formatPhone, formatTime } from "../../../Componentes/Funcoes";
const EditData = ({ open, handleClose, initialData, onSave, alertCustom }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [open]);

  const handleChange = (field) => (event) => {
    if (field === "telefone") {
      const formattedValue = event.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [field]: formattedValue });
      return;
    }
    if (field.includes("horario")) {
      const formattedValue = event.target.value;
      setFormData({
        ...formData,
        [field]: formatTime(formData[field], formattedValue),
      });
      return;
    }
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
        <Grid container spacing={3.5} sx={{ mt: 4 }}>
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
              value={formatPhone(formData.telefone)}
              onChange={(e) => handleChange("telefone")(e)}
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
          <Grid item size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Horário de Abertura"
              value={formData.horarioAbertura}
              onChange={handleChange("horarioAbertura")}
              variant="outlined"
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Horário de Fechamento"
              value={formData.horarioFechamento}
              onChange={handleChange("horarioFechamento")}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Modal>
      <Grid container alignItems="center">
        {" "}
        <Typography variant="body1">
          <span style={{ width: "30px" }}>
            <Switch
              checked={formData.aberto}
              onChange={async (e) => {
                setFormData({ ...formData, aberto: e.target.checked });
                await onChangeAndSave(e.target.checked);
              }}
              color="primary"
            />
          </span>
          <span style={{ minWidth: "700px" }}>
            {formData.aberto ? "Aberto" : "Fechado"}
          </span>
        </Typography>{" "}
      </Grid>
    </>
  );
};

export default EditData;
