import React, { useEffect, useState } from "react";
import BannerFind from "../../Assets/Cobranca/find_banner.png";
import { Box, Grid2 as Grid, Paper, Stack, Typography } from "@mui/material";
import Api from "../../Componentes/Api/axios";
import Icon from "../../Assets/Emojis";
import { toUTC } from "../../Componentes/Funcoes";

const Fila = ({ form, alertCustom }) => {
  const [content, setContent] = useState({
    quantidade_fila: 0,
    fila_titulo: "Fila vazia",
    fila_subtitulo: "Tempo médio de espera: --",
    ausencias: [],
  });

  const formatTime = (date) => `${date.slice(0, 5)}h`;

  const handleGetStatus = async () => {
    try {
      if (!form?.barbeiro?.id || !form.barbeiro.filaDinamicaClientes) return;
      const { peopleAhead, waitTime } = await Api.query(
        "GET",
        `/scheduling/queue/estimate/${form.barbeiro.id}`
      );

      setContent((prev) => ({
        ...prev,
        quantidade_fila: peopleAhead,
        fila_titulo: peopleAhead
          ? `${peopleAhead} ${peopleAhead === 1 ? "pessoa" : "pessoas"} na fila`
          : "Fila vazia",
        fila_subtitulo: `Tempo médio de espera: ${waitTime}`,
      }));
    } catch (error) {
      console.error(error);
      alertCustom("Erro ao buscar status da fila");
    }
  };

  const getHours = async () => {
    try {
      const result = [];
      const now = new Date().getDay();
      const id = form?.barbeiro?.id;
      const { almoco, escala } = await Api.query(
        "GET",
        `/user/setted-times/${id}`
      );

      if (almoco?.horaInicio && almoco?.horaFim) {
        result.push({
          titulo: "Pausa para o almoço",
          subtitulo: `Das ${formatTime(almoco.horaInicio)} às ${formatTime(
            almoco.horaFim
          )}`,
        });
      }
      if (Array.isArray(escala)) {
        const today = escala.find((e) => e.diaSemana === now);
        if (today?.horarioInicio && today?.horarioFim) {
          result.push({
            titulo: "Horário de atendimento",
            subtitulo: `Das ${formatTime(today.horarioInicio)} às ${formatTime(
              today.horarioFim
            )}`,
          });
        }
      }

      setContent((prev) => ({
        ...prev,
        ausencias: result,
      }));
    } catch (error) {
      console.error(error);
      alertCustom("Erro ao buscar escala do barbeiro");
    }
  };

  useEffect(() => {
    if (!form?.barbeiro?.id) return;

    handleGetStatus();
    getHours();
    const interval = setInterval(handleGetStatus, 10000);

    return () => clearInterval(interval);
  }, [form?.barbeiro?.id]);

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }} sx={{ height: "100%" }}>
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              width: "100%",
              minHeight: "120px",
              backgroundImage: `url(${BannerFind})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ color: "#fff" }}>
                {content.fila_titulo}
              </Typography>
              {/* {content.fila_subtitulo} */}
            </Typography>
          </Paper>

          <Typography className="show-box" variant="h6">
            <Icon>💈</Icon> Como funciona?
            <Typography variant="body1">
              Ao entrar na fila, você receberá uma notificação quando estiver
              próximo de ser atendido.
            </Typography>
            {form.barbeiro?.filaDinamicaClientes &&
              !form.barbeiro?.clientesPodemEntrarNaFila && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Você não pode entrar na fila por aqui pois o barbeiro está no
                  controle, compareça ao local para ser atendido!
                </Typography>
              )}
            {content.ausencias.map(({ titulo, subtitulo }, index) => (
              <Box sx={{ mt: 1 }} key={index}>
                {titulo}
                <Typography key={index} variant="body1">
                  {subtitulo}
                </Typography>
              </Box>
            ))}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Fila;
