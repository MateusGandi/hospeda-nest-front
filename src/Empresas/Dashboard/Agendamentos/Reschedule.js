import React, { useEffect, useState } from "react";
import { CircularProgress, Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";
import { formatarData, getLocalItem } from "../../../Componentes/Funcoes";
import Api from "../../../Componentes/Api/axios";
import Calendario from "../../../Componentes/Calendar";
import Horario from "../../../Componentes/Horario/fixed";
import Modal from "../../../Componentes/Modal";

const Reagendamento = ({ form, setForm, alertCustom, onConfirm }) => {
  const [vagasDisponiveis, setVagasDisponiveis] = useState([]);
  const [modal, setModal] = useState({ open: false });
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setModal({
      open: true,
      onClose: () => setModal((prev) => ({ ...prev, open: false })),
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
      const info = await Api.query(
        "GET",
        `/scheduling/employee/${idBarbeiro}/${dataAtual}?servicesId=${idServicos}`
      );
      return info;
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
      alertCustom("Erro ao buscar vagas, tente novamente mais tarde!");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const buscar = async () => {
      if (form.dia) {
        const id = getLocalItem("id");
        const establishmentId = getLocalItem("establishmentId");
        const services = await Api.query(
          "GET",
          `/service/${establishmentId}/${id}`
        );

        const ids = services.map(({ id }) => id).join(",");
        const resp = await buscarVagas(
          id,
          ids,
          form.dia.toISOString().split("T")[0]
        );

        setVagasDisponiveis(resp.map((item) => formatarData(item)));
      } else if (Object.values(form).every((item) => !!item)) {
        const { dia, horario } = form;
        const [hr, min] = horario.split(":");
        const newDate = new Date(dia);
        newDate.setHours(hr, min);
        setForm((prev) => ({ ...prev, agendamento: newDate.toISOString() }));
      }
    };

    buscar().then(() => setModal((prev) => ({ ...prev, open: false })));
  }, [form.dia]);

  useEffect(() => {
    const fetch = async () => {
      const ids = form.servicos?.map(({ id }) => id).join(",");
      const dataAtual = new Date().toISOString().split("T")[0];
      const resp = await buscarVagas(form.barbeiro?.id, ids, dataAtual);
      setVagasDisponiveis(resp.map((item) => formatarData(item)));
    };
    fetch();
  }, []);

  const handleSelect = (item) => {
    setForm((prev) => ({ ...prev, agendamento: item }));
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }}>
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
        {" "}
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Calendario
              onSelect={(value) => {
                setForm((prev) => ({ ...prev, dia: value }));
              }}
            />
          </Grid>
        </Grid>{" "}
      </Modal>
    </Grid>
  );
};

export default Reagendamento;
