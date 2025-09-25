import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";
import { formatarData } from "../../../Componentes/Funcoes";
import Api from "../../../Componentes/Api/axios";
import Calendario from "../../../Componentes/Calendar/Simple";
import Modal from "../../../Componentes/Modal/Simple";

const Reagendamento = ({ form, setForm, alertCustom, onSave }) => {
  const [vagasDisponiveis, setVagasDisponiveis] = useState([]);
  const [modal, _setModal] = useState({ open: false });
  const [loading, setLoading] = useState(false);

  const setModal = (dados) => _setModal((prev) => ({ ...prev, ...dados }));

  const handleOpen = () => {
    setModal({
      open: true,
      onClose: () => setModal({ open: false }),
      maxWidth: "xs",
      titulo: "Selecione uma data específica",
      component: "modal",
      fullScreen: "mobile",
      loading: false,
    });
  };

  const buscarVagas = async (idBarbeiro, idServicos, dataAtual) => {
    setLoading(true);
    try {
      return await Api.query(
        "GET",
        `/scheduling/employee/${idBarbeiro}/${dataAtual}?servicesId=${idServicos}`
      ).then((response) => response);
    } catch (error) {
      alertCustom("Erro ao buscar vagas, tente novamente mais tarde!");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const buscar = async () => {
      if (form.dia) {
        const ids = form.servico.map(({ id }) => id).join(",");
        const resp = await buscarVagas(
          form.barbeiro?.id,
          ids,
          form.dia.toISOString().split("T")[0]
        );

        setVagasDisponiveis(resp.map((item) => formatarData(item)));
      } else if (Object.values(form).every((item) => !!item)) {
        const { dia, horario } = form;
        const [hr, min] = horario.split(":");
        const newDate = new Date(dia);
        newDate.setHours(hr, min);
        setForm({ agendamento: newDate.toISOString() });
      }
    };

    buscar().then(() => setModal({ open: false }));
  }, [form.dia]);

  useEffect(() => {
    const fetch = async () => {
      const ids = form.servicos?.map(({ id }) => id).join(",");
      const dataAtual = new Date().toISOString().split("T")[0];
      if (!ids || !form.barbeiro?.id) return;

      const resp = await buscarVagas(form.barbeiro?.id, ids, dataAtual);
      setVagasDisponiveis(resp.map((item) => formatarData(item)));
    };
    fetch();
  }, []);

  const handleSelect = (item) => {
    setForm({ ...form, novaDataSelecionada: item });
  };

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Grid size={12}>
          {vagasDisponiveis && vagasDisponiveis.length ? (
            <Rows
              items={[
                {
                  titulo: "Selecionar uma data diferente",
                  id: 9999,
                  action: () => handleOpen(),
                },
                ...vagasDisponiveis,
              ]}
              selectedItems={[
                formatarData(form.novaDataSelecionada || form.agendamento),
              ]}
              onSelect={handleSelect}
            />
          ) : loading ? (
            <div
              style={{
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <Typography variant="body1" sx={{ m: 1, textAlign: "center" }}>
              Nenhum resultado encontrado!
            </Typography>
          )}
        </Grid>

        <Modal
          props={modal}
          open={modal.open}
          onClose={modal.onClose}
          maxWidth={modal.maxWidth}
          titulo={modal.titulo}
          component="modal"
          fullScreen="mobile"
          loading={modal.loading}
        >
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Calendario
                data={form.dia}
                onSelect={(value) => {
                  setForm({ ...form, dia: value });
                }}
              />
            </Grid>
          </Grid>
        </Modal>
      </Grid>
    </Container>
  );
};

export default Reagendamento;
