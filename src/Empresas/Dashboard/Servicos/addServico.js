import React, { useEffect, useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput } from "../../../Componentes/Custom";
import { formatMoney, formatTime } from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";

const Servico = ({
  formData,
  servicos,
  open,
  setOpen,
  titulo,
  onSubmit,
  submitText,
  actionText,
  buttons,
  barbearia,
  alertCustom,
}) => {
  const [data, setData] = useState({
    nome: "",
    tempoGasto: 0,
    descricao: "",
    preco: 0,
  });
  const [horario, setHorario] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name == "tempoGasto") {
      const hrs = formatTime(horario, value);
      setData({ ...data, [name]: hrs });
      return setHorario(hrs);
    }

    if (name == "preco") {
      return setData({ ...data, [name]: formatMoney(value) });
    }
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (!open)
      setData({ nome: "", tempoGasto: null, preco: null, descricao: "" });
  }, [open]);

  useEffect(() => {
    if (formData) {
      setData({
        flag: true,
        id: formData.id,
        foto: formData.foto,
        nome: formData.nome || "",
        tempoGasto: formData.tempoGasto || "",
        descricao: formData.descricao || "",
        preco: formData.preco || 0,
      });
    }
  }, [formData]);

  const handleSave = async () => {
    try {
      let servicosAtualizados;
      if (formData) {
        servicosAtualizados = [
          ...servicos.filter((item) => item.id !== formData.id),
          { ...data, barbeariaId: barbearia.id, preco: +data.preco },
        ];
      } else {
        servicosAtualizados = [
          ...servicos.map((item) => ({ ...item, barbeariaId: barbearia.id })),
          {
            ...data,
            barbeariaId: barbearia.id,
            preco: +data.preco,
            disabled: true,
          },
        ];
      }

      await apiService.query("POST", `/service`, servicosAtualizados);

      setData({ nome: "", tempoGasto: 0, preco: 0, descricao: "" });
      setOpen(false);
      alertCustom(
        formData
          ? "Serviço atualizado com sucesso!"
          : "Serviço cadastrado com sucesso!"
      );
    } catch (error) {
      alertCustom(
        formData ? "Erro ao atualizar serviço!" : "Erro ao cadastrar serviço!"
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      titulo={titulo}
      onAction={handleSave}
      actionText={actionText}
      onSubmit={onSubmit}
      submitText={submitText}
      fullScreen="all"
      component="view"
      buttons={buttons}
    >
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <CustomInput
            label="Nome do serviço"
            placeholder="Nome do serviço"
            name="nome"
            value={data.nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <CustomInput
            label="Duração média (hh:mm)"
            placeholder="Duração média"
            name="tempoGasto"
            value={data.tempoGasto}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <CustomInput
            label="Preço do serviço"
            placeholder="Preço do serviço"
            name="preco"
            startIcon={"R$"}
            value={data.preco}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
          <CustomInput
            label="Descrição"
            multiline={true}
            minRows={4}
            name="descricao"
            value={data.descricao}
            onChange={handleChange}
            variant="outlined"
            type="number"
            fullWidth
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Servico;
