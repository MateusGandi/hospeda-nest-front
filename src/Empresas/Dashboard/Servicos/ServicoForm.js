import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import { CustomInput } from "../../../Componentes/Custom";
import {
  formatMoney,
  formatTime,
  getLocalItem,
} from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import Commission from "./Commission";
import CustomTabs from "../../../Componentes/Tabs";
import Discount from "./Discount";
import { Build } from "@mui/icons-material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { useNavigate } from "react-router-dom";

const INITIAL_FORM = {
  nome: "",
  tempoGasto: "",
  descricao: "",
  preco: 0,
};

const Servico = ({
  onClose,
  open,
  fetchServicos,
  formData,
  setFormData,
  barbeariaId,
  funcionarios: funcionariosProp,
  comissoes,
  titulo,
  buttons,
  alertCustom,
  actionText,
}) => {
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [data, setData] = useState(INITIAL_FORM);
  const [horario, setHorario] = useState(null);
  const [tab, setTab] = useState(0);
  const tabs = [
    { icon: <Build />, label: "Serviço", id: 0 },
    {
      icon: <LocalOfferOutlinedIcon />,
      label: "Comissões",
      id: 1,
      display: !!formData,
    },
    // {
    //   icon: <DiscountOutlinedIcon />,
    //   label: "Descontos",
    //   id: 2,
    //   display: !!formData,
    // },
  ];

  useEffect(() => {
    setFuncionarios(funcionariosProp);
  }, [funcionariosProp]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "tempoGasto") {
      const hrs = formatTime(horario, value);
      setData({ ...data, [name]: hrs });
      return setHorario(hrs);
    }

    if (name === "preco") {
      return setData({ ...data, [name]: formatMoney(value) });
    }
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (formData)
      setData({
        flag: true,
        id: formData.id,
        foto: formData.foto,
        nome: formData.nome || "",
        tempoGasto: formData.tempoGasto || "",
        descricao: formData.descricao || "",
        preco: formData.preco || 0,
      });
  }, [formData]);

  const handleSaveComission = async () => {
    try {
      console.log("funcionarios", funcionarios);
      const payload = funcionarios.map(({ id: funcionarioId, comissao }) => ({
        funcionarioId,
        id: comissao?.id,
        tipo: comissao?.percentual ? "PERCENTUAL" : "VALOR",
        valor: comissao?.percentual || comissao?.valorFixo || 0,
      }));
      const updates = payload.filter((c) => !!c.id);
      const inserts = payload.filter((c) => !c.id);

      updates.length &&
        (await apiService.query(
          "PUT",
          `/service/commission-configurations/${data.id}`,
          updates
        ));
      inserts.length &&
        (await apiService.query(
          "POST",
          `/service/commission-configurations/${data.id}`,
          inserts
        ));

      alertCustom("Comissões salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar comissões:", error);
      alertCustom("Erro ao salvar comissões!");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (data.tempoGasto.length < 5)
        return alertCustom("Horário no formato inválido");

      const { foto, id, calculoComissao, tempoGasto, ...rest } = data;

      if (Object.values(rest).some((value) => !value && value !== 0))
        return alertCustom("Informe todos os campos obrigatórios");

      await apiService
        .query(
          id ? "PATCH" : "POST",
          id ? `/service/${id}` : `/service`,
          id
            ? {
                ...data,
                tempoGasto: tempoGasto + ":00",
                barbeariaId: getLocalItem("establishmentId"),
              }
            : [
                {
                  ...data,
                  tempoGasto: tempoGasto + ":00",
                  barbeariaId: getLocalItem("establishmentId"),
                },
              ]
        )
        .then(async () => {
          await handleSaveComission();
        });

      setData(INITIAL_FORM);
      fetchServicos();
      onClose();
      alertCustom(
        formData
          ? "Serviço atualizado com sucesso!"
          : "Serviço cadastrado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alertCustom(
        formData ? "Erro ao atualizar serviço!" : "Erro ao cadastrar serviço!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      titulo={titulo}
      onAction={handleSave}
      actionText={actionText}
      fullScreen="all"
      component="view"
      buttons={buttons.map((btn) => ({
        ...btn,
        disabled: loading || btn.disabled,
      }))}
      loadingButton={loading}
    >
      <CustomTabs
        tabs={tabs}
        onChange={(e) => setTab(e)}
        selected={tab}
        views={[
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
                placeholder="hh:mm"
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

            <Grid item size={12}>
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
          </Grid>,
          <Commission
            servico={data}
            comissoes={comissoes}
            funcionarios={funcionarios}
            setFuncionarios={setFuncionarios}
          />,
          formData?.id && (
            <Discount
              dados={{ barbeariaId, serviceId: data.id }}
              alertCustom={alertCustom}
            />
          ),
        ]}
      />
    </Modal>
  );
};

export default Servico;
