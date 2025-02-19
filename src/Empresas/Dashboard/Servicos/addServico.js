import React, { useEffect, useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput } from "../../../Componentes/Custom";
import { formatMoney, formatTime } from "../../../Componentes/Funcoes";

const Servico = ({
  formData,
  setFormData,
  open,
  setOpen,
  titulo,
  onSubmit,
  submitText,
  actionText,
  buttons,
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
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (formData) {
      setData({
        nome: formData.nome || "",
        tempoGasto: formData.tempoGasto || "",
        valor: formData.valor || 0,
        descricao: formData.descricao || "",
        preco: formData.preco || 0,
      });
    }
  }, [formData]);

  const handleSave = () => {
    if (formData) {
      setFormData((prev) => [
        ...prev.filter((item) => item.id !== formData.id),
        data,
      ]);
    } else {
      setFormData((prev) => [...prev, data]);
    }

    setData({ nome: "", tempoGasto: 0, valor: 0, descricao: "" });
    setOpen(false);
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
            label="Duração média"
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
            value={formatMoney(data.preco)}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
          <CustomInput
            label="Descrição"
            placeholder="Preço do serviço"
            multiline
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
