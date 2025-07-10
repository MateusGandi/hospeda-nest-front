import React, { useState } from "react";
import {
  Switch,
  FormControlLabel,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { CustomInput } from "../../../Componentes/Custom";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatCNPJ,
  formatPhone,
  getLocalItem,
  isMobile,
} from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";

const CreateEstablishment = ({ alertCustom }) => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name } = event.target;
    if (name === "cnpj")
      return setFormData({
        ...formData,
        [name]: formatCNPJ(event.target.value),
      });
    if (name === "telefone")
      return setFormData({
        ...formData,
        [name]: formatPhone(event.target.value),
      });
    if (name === "meAsEmployee")
      return setFormData({
        ...formData,
        [name]: event.target.checked,
      });
    setFormData({ ...formData, [name]: event.target.value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nome || formData.nome.trim().length === 0) {
      return (errors.nome = "O nome do estabelecimento é obrigatório.");
    }
    if (!formData.telefone || formData.telefone.trim().length === 0) {
      return (errors.telefone = "O telefone é obrigatório.");
    }
    if (!formData.cnpj || formData.cnpj.trim().length === 0) {
      return (errors.cnpj = "O CNPJ é obrigatório.");
    }

    if (formData.nome && formData.nome.length < 3) {
      return (errors.nome =
        "O nome do estabelecimento deve ter no mínimo 3 caracteres.");
    }
    if (formData.telefone && formData.telefone.length < 10) {
      return (errors.telefone =
        "O telefone deve ter pelo menos 10 caracteres.");
    }
    if (formData.cnpj && formData.cnpj.length < 14) {
      return (errors.cnpj = "O CNPJ deve ter 14 caracteres.");
    }

    if (!formData.estado || formData.estado.trim().length === 0) {
      return (errors.estado = "O estado é obrigatório.");
    }
    if (!formData.cidade || formData.cidade.trim().length === 0) {
      return (errors.cidade = "A cidade é obrigatória.");
    }
    if (!formData.bairro || formData.bairro.trim().length === 0) {
      return (errors.bairro = "O bairro é obrigatório.");
    }
    if (!formData.logradouro || formData.logradouro.trim().length === 0) {
      return (errors.logradouro = "O logradouro é obrigatório.");
    }
    return null;
  };

  const handleSave = () => {
    const validationError = validateForm();
    if (validationError) return alertCustom(validationError);
    setLoading(true);
    const {
      telefone,
      cnpj,
      bairro,

      cidade,

      estado,
      meAsEmployee,
      logradouro,
      ...rest
    } = formData;
    console.log(formData);
    Api.query("GET", `/user/profile/${getLocalItem("userId")}`)
      .then(async (data) => {
        await Api.query("POST", "/establishment", {
          ...rest,
          administrador: data.telefone,
          funcionarios: meAsEmployee ? [data.telefone] : [],
          endereco: [bairro, cidade, estado, logradouro].join(", "),
          telefone: telefone.replace(/\D/g, ""),
          cnpj: cnpj.replace(/\D/g, ""),
          planId: +planId,
          formaPagamento: "PIX",
        }).then((response) => {
          localStorage.clear();
          alertCustom("Conta criada com sucesso, faça login novamente!");
          navigate("/login");
        });
      })
      .catch((error) =>
        alertCustom(
          error.response.data.message || "Erro ao criar estabelecimento."
        )
      );

    setLoading(false);
  };

  return (
    <>
      <Modal
        open={true}
        onClose={() => navigate(-1)}
        titulo={"Cadastro da Barbearia"}
        onAction={handleSave}
        actionText={"Criar"}
        fullScreen="all"
        component="view"
      >
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid size={12}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                gap: 1,
                borderLeft: "2px solid #fff",

                p: "2px 12px",
                mb: 2,
                ml: isMobile ? 0 : -2,
              }}
            >
              Informações Gerais
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Nome do estabelecimento"
              value={formData.nome}
              name="nome"
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Telefone"
              value={formData.telefone}
              name="telefone"
              onChange={handleChange}
              variant="outlined"
              type="tel"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="CNPJ"
              value={formData.cnpj}
              name="cnpj"
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="h6"
              sx={{
                mt: 1.5,
                display: "flex",
                gap: 1,
                borderLeft: "2px solid #fff",

                p: "2px 12px",
                mb: 2,
                ml: isMobile ? 0 : -2,
              }}
            >
              Endereço
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Estado"
              placeholder="Exemplo: Goiás"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Cidade"
              placeholder="Exemplo: Goiânia"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Bairro"
              placeholder="Exemplo: Jabuti"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 1.5 }}>
            <CustomInput
              fullWidth
              label="Logradouro"
              placeholder="Exemplo: Rua 1"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="h6"
              sx={{
                mt: 1.5,
                display: "flex",
                gap: 1,
                borderLeft: "2px solid #fff",

                p: "2px 12px",
                mb: 2,
                ml: isMobile ? 0 : -2,
              }}
            >
              Preferências
            </Typography>
          </Grid>{" "}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  name="meAsEmployee"
                  checked={formData.meAsEmployee}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Sou funcionário também"
            />
          </Grid>
          <Grid size={12} sx={{ m: "8px 0" }}>
            <Typography variant="h6" className="show-box">
              <Icon>🎁</Icon> Benefícios
              <Typography variant="body1">
                Ao fazer seu cadastro você testa durante o mês todo as
                principais funcionalidades do sistema sem compromisso algum!
                Inicie agora mesmo e veja diferença na sua rotina e
                visibilidade!
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default CreateEstablishment;
