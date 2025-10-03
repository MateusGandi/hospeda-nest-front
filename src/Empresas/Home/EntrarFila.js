import React, { useEffect, useState } from "react";
import BannerFind from "../../Assets/Cobranca/find_banner.png";
import { Grid2 as Grid, Paper, Stack, Typography } from "@mui/material";
import Api from "../../Componentes/Api/axios";
import Icon from "../../Assets/Emojis";

const Fila = ({ form, alertCustom }) => {
  const [content, setContent] = useState({
    quantidade_fila: 5,
    fila_titulo: "5 pessoas na sua frente",
    fila_subtitulo: "Tempo médio de espera: 25 minutos",
  });
  const handleGetStatus = async () => {
    try {
      if (!form.barbeiro || !form.barbeiro.id) return;
      const { peopleAhead, estimatedTime, waitTime } = await Api.query(
        "GET",
        `/scheduling/queue/estimate/${form.barbeiro.id}`
      );

      setContent({
        quantidade_fila: peopleAhead,
        fila_titulo: peopleAhead
          ? `${peopleAhead} ${peopleAhead === 1 ? "pessoa" : "pessoas"} na fila`
          : "Fila vazia",
        fila_subtitulo: `Tempo médio de espera: ${waitTime}`,
      });
    } catch (error) {
      alertCustom("Erro ao buscar status da fila");
    }
  };

  useEffect(() => {
    handleGetStatus();
  }, [form.barbeiro]);

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }} sx={{ height: "100%" }}>
        <Stack spacing={2} sx={{ mb: 2, height: "100%" }}>
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
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                }}
              >
                {content.fila_titulo}
              </Typography>
              {content.fila_subtitulo}
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
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Você não pode entrar na fila por aqui pois o barbeiro está no
                  controle, compareça ao local para ser atendido!
                </Typography>
              )}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Fila;
