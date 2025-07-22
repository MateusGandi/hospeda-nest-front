import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput } from "../../../Componentes/Custom";
import { formatMoney, formatTime } from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import CommissionCalculator from "../Comissao";

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
  barbeariaId,
  alertCustom,
  funcionarios,
}) => {
  const [data, setData] = useState({
    nome: "",
    tempoGasto: "",
    descricao: "",
    preco: "",
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
          { ...data, barbeariaId: barbeariaId, preco: +data.preco },
        ];
      } else {
        servicosAtualizados = [
          ...servicos.map(({ foto, ...item }) => ({
            ...item,
            barbeariaId: barbeariaId,
          })),
          {
            ...data,
            barbeariaId: barbeariaId,
            preco: +data.preco,
            disabled: true,
          },
        ];
      }
      if (servicosAtualizados.find((item) => item.tempoGasto.length < 5)) {
        return alertCustom("Horário no formato inválido");
      }

      if (
        servicosAtualizados
          .map(({ foto, ...item }) => item)
          .find((item) => Object.values(item).some((value) => !value))
      ) {
        return alertCustom("Informe todos os campos obrigatórios");
      }

      await apiService.query("POST", `/service`, servicosAtualizados);
      await apiService.query(
        "POST",
        `/service/commission-configurations/${formData.id}`,
        funcionarios.map(({ id, percentual, valorFixo }) => ({
          valor: percentual || valorFixo,
          funcionarioId: id,
          tipo: percentual ? "PORCENTAGEM" : "VALOR",
        }))
      );

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
        {!formData?.id ? (
          <Grid item size={12}>
            <Typography variant="h6" className="show-box">
              <Icon>💸</Icon> Comissões
              <Typography variant="body1">
                As comissões são calculadas automaticamente com base no preço do
                serviço. Você pode definir uma comissão fixa ou percentual para
                cada funcionário.{" "}
                <span style={{ fontWeight: 600 }}>
                  É necessário criar o serviço primeiro!
                </span>
              </Typography>
            </Typography>
          </Grid>
        ) : (
          funcionarios &&
          funcionarios.length && (
            <>
              <Grid item size={12}>
                <Typography variant="h6" className="show-box">
                  <Icon>💸</Icon> Comissões
                  <Typography variant="body1">
                    Configure as comissões para os funcionários que realizarão
                    este serviço. Você pode definir uma comissão fixa ou
                    percentual para cada funcionário.
                  </Typography>
                </Typography>
              </Grid>
              <Grid item size={12}>
                <CommissionCalculator
                  funcionarios={funcionarios}
                  servico={{ valor: data.preco, nome: data.nome }}
                  onSave
                />
              </Grid>
            </>
          )
        )}
      </Grid>
    </Modal>
  );
};

export default Servico;
