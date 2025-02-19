import React, { useEffect, useState } from "react";
import {
  Grid2 as Grid,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput, CustomSelect } from "../../../Componentes/Custom";

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
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Número de Telefone"
            name="telefone"
            value={data.telefone}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="servicos-label">Serviços Prestados</InputLabel>
            <CustomSelect
              fullWidth
              label="Serviços Prestados"
              labelId="servicos-label"
              name="servicosPrestados"
              multiple
              value={data.servicosPrestados}
              onChange={(e) =>
                setData({
                  ...data,
                  servicosPrestados: e.target.value,
                })
              }
              renderValue={(selected) =>
                selected.map((servico) => servico.nome).join(", ")
              }
            >
              {servicos.map((servico) => (
                <MenuItem key={servico.id} value={servico}>
                  <Checkbox
                    checked={data.servicosPrestados?.some(
                      (item) => item.id === servico.id
                    )}
                  />
                  <ListItemText primary={servico.nome} />
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Funcionario;
