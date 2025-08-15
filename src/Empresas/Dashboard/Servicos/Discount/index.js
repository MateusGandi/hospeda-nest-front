import React, { useEffect, useState } from "react";
import { Box, Button, Grid2 as Grid, Switch, Typography } from "@mui/material";
import { Rows } from "../../../../Componentes/Lista/Rows";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Modal from "../../../../Componentes/Modal/Simple";
import {
  CustomInput,
  CustomSelect,
  LoadingBox,
} from "../../../../Componentes/Custom";
import { formatMoney, toUTC } from "../../../../Componentes/Funcoes";
import apiService from "../../../../Componentes/Api/axios";
import Icon from "../../../../Assets/Emojis";

export default function Discount({ dados, alertCustom }) {
  const [data, _setData] = useState({
    open: false,
    descontos: [],
    selecionado: null,
  });
  const [modal, _setModal] = useState({
    open: false,
    titulo: "Criar novo cupom",
    loading: false,
    options: [
      { label: "Valor fixo", value: "VALOR" },
      { label: "Percentual", value: "PERCENTUAL" },
    ],
  });
  const [form, _setForm] = useState({
    valor: "",
    tipo: "VALOR",
    codigo: "",
    quantidadeUsos: 0,
    habilitado: false,
  });

  const setData = (newData) =>
    _setData((prevData) => ({ ...prevData, ...newData }));
  const setModal = (newData) =>
    _setModal((prevData) => ({ ...prevData, ...newData }));
  const setForm = (newData) =>
    _setForm((prevData) => ({ ...prevData, ...newData }));

  const handleSave = () => {
    if (!form.valor || !form.codigo || !form.quantidadeUsos || !form.tipo) {
      alertCustom("Preencha todos os campos obrigatórios!");
      return;
    }
    apiService
      .query(
        form.id ? "PATCH" : "POST",
        form.id ? `/discount/${form.id}` : "/discount",
        {
          ...form,
          valor: +form.valor,
          quantidadeUsos: +form.quantidadeUsos,
          estabelecimentoId: dados.barbeariaId.toString(),
          servicoId: dados.serviceId.toString(),
        }
      )
      .then(async () => {
        alertCustom(
          form.id ? "Cupom editado com sucesso!" : "Cupom criado com sucesso!"
        );
        await handleGetDiscounts();
        handleCloseModal();
      })
      .catch((error) => {
        alertCustom("Erro ao criar cupom!");
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    apiService
      .query("DELETE", `/discount/${id}`)
      .then(() => {
        handleGetDiscounts();
        alertCustom("Cupom deletado com sucesso!");
      })
      .catch((error) => {
        alertCustom("Erro ao deletar cupom!");
        console.error(error);
      });
  };

  const handleGetDiscounts = async () => {
    setModal({ loading: true });
    await apiService
      .query("GET", `/discount/service/${dados.serviceId}`)
      .then((response) => response.filter((item) => !!item.codigo))
      .then((response) =>
        response.map((item) => ({
          ...item,
          valor: +item.valor,
          titulo: item.codigo,
          subtitulo: item.habilitado ? "Ativo" : "Inativo",
        }))
      )
      .then((response) => {
        setData({
          descontos: response,
        });
      })
      .catch((error) => {
        alertCustom("Erro ao buscar cupons!");
        console.error(error);
      })
      .finally(() => {
        setModal({ loading: false });
      });
  };

  const handleOpenModal = () => {
    setModal({ open: true, titulo: "Criar novo cupom" });
    setForm({
      valor: "",
      tipo: "VALOR",
      codigo: "",
      quantidadeUsos: 0,
      habilitado: false,
    });
  };

  const handleSelect = (item) => {
    setForm({
      id: item.id,
      valor: item.valor,
      tipo: item.tipo,
      codigo: item.codigo,
      quantidadeUsos: item.quantidadeUsos,
      habilitado: item.habilitado,
    });
    setModal({
      open: true,
      selecionado: item,
      titulo: `Editar ${item.codigo}`,
    });
  };

  const handleCloseModal = () => {
    setModal({ open: false, selecionado: null });
  };

  useEffect(() => {
    handleGetDiscounts();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" className="show-box">
            <Icon>💸</Icon> Descontos e cupons
            <Typography variant="body1">
              Cadastre e gerencie cupons de desconto para seus serviços.
            </Typography>{" "}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{ mt: 3 }}
            >
              Novo cupom
            </Button>
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {!data.descontos.length ? (
            modal.loading ? (
              <LoadingBox message="Carregando..." />
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                Opps!!
                <Typography variant="body1">
                  Nenhum desconto cadastrado ainda.
                </Typography>
              </Typography>
            )
          ) : (
            <Rows
              items={data.descontos}
              onSelect={(item) => handleSelect(item)}
              multipleSelect={false}
              onDelete={(item) => handleDelete(item)}
              oneTapMode={true}
              actions={[
                {
                  color: "inherit",
                  icon: <EditOutlinedIcon />,
                  action: (id) =>
                    handleSelect(data.descontos.find((d) => d.id === id)),
                },
              ]}
            />
          )}
        </Grid>
      </Grid>

      <Modal
        titulo={modal.titulo}
        open={modal.open}
        onClose={handleCloseModal}
        maxWidth="sm"
        onAction={handleSave}
        actionText="Salvar"
        component="modal"
        fullScreen="mobile"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              placeholder="Valor"
              label="Valor do desconto"
              name="valor"
              value={form.valor}
              onChange={(e) => setForm({ valor: formatMoney(e.target.value) })}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomSelect
              label="Tipo"
              value={form.tipo}
              onChange={(e) => setForm({ tipo: e.target.value })}
              options={modal.options}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Nome do cupom"
              placeholder="DESCONTO15"
              name="codigo"
              value={form.codigo}
              onChange={(e) => setForm({ codigo: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Quantidade de usos"
              placeholder="Quantidade de Usos"
              name="quantidadeUsos"
              value={form.quantidadeUsos}
              type="number"
              onChange={(e) => setForm({ quantidadeUsos: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ gap: 1, display: "flex", alignItems: "center" }}
          >
            <Switch
              checked={form.habilitado}
              onChange={(e) => setForm({ habilitado: e.target.checked })}
            />
            <Typography>Habilitado</Typography>
          </Grid>

          {form.createdAt && (
            <Grid size={12}>
              {" "}
              <Typography variant="body1">
                Criado em {toUTC(form.createdAt)}
              </Typography>
              <Typography variant="body1">
                Atualizado em {toUTC(form.updatedAt)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Modal>
    </>
  );
}
