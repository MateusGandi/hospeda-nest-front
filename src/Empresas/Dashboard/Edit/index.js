import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Switch, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { CustomInput } from "../../../Componentes/Custom";
import { formatPhone, formatTime } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import View from "../../../Componentes/View";

const EditData = ({
  open = true,
  onClose,
  barbearia,
  alertCustom,
  onSave,
  tipo = "view",
}) => {
  const [formData, setFormData] = useState(barbearia);

  useEffect(() => {
    setFormData(barbearia);
  }, [barbearia]);

  const handleChange = (field) => (event) => {
    if (field === "telefone") {
      const formattedValue = event.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [field]: formattedValue });
    } else if (field.includes("horario")) {
      const formattedValue = event.target.value;
      setFormData({
        ...formData,
        [field]: formatTime(formData[field], formattedValue),
      });
    } else {
      setFormData({ ...formData, [field]: event.target.value });
    }
  };

  const handleSave = async () => {
    if (
      formData.horarioAbertura.lenght < 5 ||
      formData.horarioFechamento.lenght < 5
    ) {
      return alertCustom("Preencha todos os campos corretamente");
    }
    onSave(formData);
  };

  const onChangeAndSave = async (aberto) => {
    try {
      await onSave(
        {
          aberto: aberto,
        },
        false
      );
    } catch (error) {
      console.error("Erro ao mudar status do estabelecimento:", error);
      alertCustom("Erro ao mudar status do estabelecimento");
    }
  };

  return (
    <>
      {tipo == "button" ? (
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
      ) : (
        <View
          open={open}
          onClose={onClose}
          titulo={"Atualizar dados"}
          onAction={handleSave}
          actionText={"Salvar"}
          fullScreen="all"
          component="view"
          maxWidth={"md"}
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
            <Grid item size={{ xs: 6, md: 4 }}>
              <CustomInput
                fullWidth
                label="Horário de Abertura"
                placeholder="hh:mm"
                value={formData.horarioAbertura}
                onChange={handleChange("horarioAbertura")}
                variant="outlined"
              />
            </Grid>
            <Grid item size={{ xs: 6, md: 4 }}>
              <CustomInput
                fullWidth
                label="Horário de Fechamento"
                placeholder="hh:mm"
                value={formData.horarioFechamento}
                onChange={handleChange("horarioFechamento")}
                variant="outlined"
              />
            </Grid>{" "}
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
            <Grid item size={{ xs: 12, md: 8 }}>
              <CustomInput
                fullWidth
                label="Endereço"
                value={formData.endereco}
                onChange={handleChange("endereco")}
                variant="outlined"
              />
            </Grid>
            <Grid item size={12}>
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
              </Typography>
            </Grid>
            <Grid item size={12}>
              <Typography variant="body1" className="show-box">
                <Typography variant="h6">
                  <Icon>💡</Icon> Customização
                </Typography>
                Complemente com suas informações e alcançe o potencial máximo
                para atrair clientes
              </Typography>
            </Grid>
          </Grid>
        </View>
      )}
    </>
  );
};

export default EditData;
