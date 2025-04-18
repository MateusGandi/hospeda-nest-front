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
import { formatarHorario, formatPhone } from "../../../Componentes/Funcoes";
import SearchField from "../../../Componentes/AutoComplete/searchAutocomplete";

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

  useEffect(() => {
    if (formData) {
      setData({
        id: formData.id,
        title: `${formData.nome} - ${formData.telefone}`,
        nome: formData.nome || "",
        telefone: formData.telefone || "",
        servicosPrestados: formData.servicosPrestados || [],
        foto: formData.foto || null,
        imagem: formData.foto
          ? `https://srv744360.hstgr.cloud/tonsus/api/images/user/${formData.id}/${formData.foto}`
          : null,
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
      id: null,
      nome: "",
      telefone: "",
      servicosPrestados: [],
    });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setData({
          id: null,
          nome: "",
          telefone: "",
          servicosPrestados: [],
        });
      }}
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
          <Typography variant="body1">Funcionário</Typography>
          <SearchField
            fields={["telefone", "nome"]}
            url={`/user`}
            placeholder="Pesquise por nome ou telefone"
            setItemSelecionado={(item) => {
              if (!item)
                return setData({
                  id: null,
                  nome: "",
                  telefone: "",
                  servicosPrestados: [],
                });
              setData({
                ...data,
                nome: item.nome,
                telefone: item.telefone,
                id: item.id,
                imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/user/${item.id}/${item.foto}`,
              });
            }}
            itemSelecionado={data}
          />
          {/* <CustomInput
            label="Nome do Funcionário"
            name="nome"
            value={data.nome}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          /> */}
        </Grid>{" "}
        {/* <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInput
            label="Número de Telefone"
            name="telefone"
            value={formatPhone(data.telefone)}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid> */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Typography variant="body1" sx={{ top: 0 }}>
            Selecione serviços para o funcionário
          </Typography>

          <Rows
            items={servicos?.map((item) => ({
              ...item,
              titulo: item.nome,
              subtitulo: `R$ ${item.preco} | Duração: ${formatarHorario(
                item.tempoGasto
              )}`,
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
