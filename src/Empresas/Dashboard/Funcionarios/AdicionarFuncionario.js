import React, { useEffect, useState } from "react";
import {
  Grid2 as Grid,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput, CustomSelect } from "../../../Componentes/Custom";
import { Rows } from "../../../Componentes/Lista/Rows";
import { formatPhone } from "../../../Componentes/Funcoes";
const Funcionario = ({
  formData,
  setFormData,
  open,
  setOpen,
  servicos,
  titulo,
  onSubmit,
  submitText,
  actionText,
  buttons,
}) => {
  const [data, setData] = useState({
    nome: "",
    telefone: "",
    servicosPrestados: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (formData) {
      setData({
        nome: formData.nome || "",
        telefone: formData.telefone || "",
        servicosPrestados: formData.servicosPrestados || [],
      });
    }
  }, [formData]);

  const handleSave = () => {
    if (formData) {
      setFormData((prev) => [
        ...prev.filter((item) => item.id !== formData?.id),
        data,
      ]);
    } else {
      setFormData((prev) => [...prev, data]);
    }

    setData({
      nome: "",
      telefone: "",
      servicosPrestados: [],
    });
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
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Nome do Funcionário"
            name="nome"
            value={data.nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>{" "}
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Número de Telefone"
            name="telefone"
            value={formatPhone(data.telefone)}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Typography variant="body1" sx={{ top: 0 }}>
            Selecione serviços para o funcionário
          </Typography>

          <Rows
            items={servicos?.map((item) => ({
              ...item,
              titulo: item.nome,
              subtitulo: `R$ ${item.preco} | Duração: ${item.tempoGasto}`,
            }))}
            onSelect={(value) =>
              setData({
                ...data,
                servicosPrestados: value,
              })
            }
            selectedItems={data.servicosPrestados}
            multipleSelect={true}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Funcionario;
