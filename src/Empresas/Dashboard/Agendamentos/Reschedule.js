import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";
import { formatarData, toUTC } from "../../../Componentes/Funcoes";
import Api from "../../../Componentes/Api/axios";
import Calendario from "../../../Componentes/Calendar/Simple";
import Modal from "../../../Componentes/Modal/Simple";

const Reagendamento = ({
  setFilter,
  filter,
  onChange,
  novaData,
  agendamentoSelecionado,
  alertCustom,
}) => {
  const [modal, _setModal] = useState({
    calendario: { open: false },
    vagas_disponiveis: [],
    loading: false,
  });

  const setModal = (d) => _setModal((prev) => ({ ...prev, ...d }));

  // Busca as vagas disponíveis
  const buscarVagas = async (
    idBarbeiro,
    idServicos,
    dataAtual,
    idAgendamento
  ) => {
    try {
      setModal({ loading: true });
      const resp = await Api.query(
        "GET",
        `/scheduling/employee/${idBarbeiro}/${dataAtual}?servicesId=${idServicos}&schedulingIdToBeIgnored=${idAgendamento}`
      );
      return resp || [];
    } catch (error) {
      alertCustom("Erro ao buscar vagas disponíveis!");
      return [];
    } finally {
      setModal({ loading: false });
    }
  };

  // Função principal de busca
  const buscar = async () => {
    try {
      const { funcionario, servico: servicos, id } = agendamentoSelecionado;
      const { data_selecionada } = filter;

      if (!funcionario || !servicos || !data_selecionada) return;

      const ids = servicos.map(({ id }) => id).join(",");
      const dataFormatada = toUTC({
        data: data_selecionada,
        onlyDate: true,
        format: "en",
      });

      const vagas = await buscarVagas(funcionario.id, ids, dataFormatada, id);

      const vagasFormatadas = vagas.map((item) => ({
        ...formatarData(item),
      }));

      setModal({ vagas_disponiveis: vagasFormatadas });
    } catch {
      setModal({ vagas_disponiveis: [] });
    }
  };

  useEffect(() => {
    if (filter.data_selecionada) buscar();
  }, [filter.data_selecionada]);

  useEffect(() => {
    buscar();
  }, []);

  const handleSelect = (item) => {
    onChange(item);
  };

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Grid size={12}>
          {modal.vagas_disponiveis.length ? (
            <Rows
              items={[
                {
                  titulo: "Selecionar uma data diferente",
                  id: 9999,
                  action: () => setModal({ calendario: { open: true } }),
                },
                ...modal.vagas_disponiveis,
              ]}
              onSelect={handleSelect}
            />
          ) : modal.loading ? (
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
          open={modal.calendario.open}
          onClose={() => setModal({ calendario: { open: false } })}
          titulo="Selecione uma nova data"
          fullScreen="mobile"
          loading={modal.loading}
        >
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Calendario
                data={filter.data_selecionada}
                onSelect={(value) => {
                  setFilter({ data_selecionada: value });
                  setModal({ calendario: { open: false } });
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
