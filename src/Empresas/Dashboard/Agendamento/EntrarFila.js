import React, { useEffect, useState } from "react";
import BannerFind from "../../../Assets/Cobranca/find_banner.png";
import { Grid2 as Grid, Paper, Stack, Typography } from "@mui/material";

const Fila = ({ onAction, alertCustom }) => {
  const [content, setContent] = useState({
    quantidade_fila: 5,
    fila_titulo: "5 pessoas na fila",
    fila_subtitulo: "Tempo médio de espera: 25 minutos",
  });

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
            Como funciona?
            <Typography variant="body1">
              Ao inserir o cliente na fila, ele receberá uma notificação quando
              estiver próximo de ser atendido.
            </Typography>
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Fila;
