import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid2 as Grid,
  Icon,
  Typography,
} from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import { formatarData, toUTC } from "../../Componentes/Funcoes";
import Api from "../../Componentes/Api/axios";
import Calendario from "../../Componentes/Calendar/Simple";
import Modal from "../../Componentes/Modal/Simple";

const Servicos = ({ form, setForm, alertCustom }) => {
  const [vagasDisponiveis, setVagasDisponiveis] = useState([]);
  const [modal, setModal] = useState({ open: false });
  const [data, setData] = useState({
    horario: null,
    dia: new Date().toISOString(),
  });

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
      alertCustom(
        error.response.data.message ??
          "Erro ao buscar vagas, tente novamente mais tarde!"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const buscar = async () => {
      if (data.dia && form.barbeiro.id) {
        const ids = form.servicos.map(({ id }) => id).join(",");
        const resp = await buscarVagas(
          form.barbeiro.id,
          ids,
          data.dia.split("T")[0]
        );

        setVagasDisponiveis(resp.map((item) => formatarData(item)));
      } else if (Object.values(data).every((item) => !!item)) {
        const { dia, horario } = data;
        const [hr, min] = horario.split(":");
        const newDate = new Date(dia);
        newDate.setHours(hr, min);
        setForm((prev) => ({ ...prev, agendamento: newDate.toISOString() }));
      }
    };

    if (form.servicos && form.servicos.length) buscar();
  }, [data.dia, form.servicos]);

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
          <>
            <div
              style={{
                width: "100%",
                height: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          </>
        ) : (
          <>
            <Rows
              items={[
                {
                  titulo: "Selecionar uma data diferente",
                  id: 9999,
                  action: () => handleOpen(),
                },
              ]}
              onSelect={handleSelect}
            />
            <Typography variant="h6" className="show-box" sx={{ m: "12px 0" }}>
              <Icon>🔍</Icon> Nenhuma vaga disponível para{" "}
              {toUTC({ data: data.dia, onlyDate: true })}!
              <Typography variant="body1">
                Sem vagas para este dia mas selecione uma data diferente...
              </Typography>
            </Typography>
          </>
        )}
      </Grid>

      <Modal
        props={modal}
        open={modal.open}
        onClose={modal.onClose}
        onAction={modal.onAction}
        actionText={modal.actionText}
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
              data={data.dia}
              onSelect={(value) => {
                setData((prev) => ({ ...prev, dia: value }));
                setModal((prev) => ({
                  ...prev,
                  open: false,
                }));
              }}
            />
          </Grid>
        </Grid>{" "}
      </Modal>
    </Grid>
  );
};

export default Servicos;
