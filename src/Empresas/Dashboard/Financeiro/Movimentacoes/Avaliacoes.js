import React, { useState, useEffect } from "react";
import {
  Rating,
  Box,
  Typography,
  Button,
  Avatar,
  Container,
  Paper,
  Grid2 as Grid,
  CircularProgress,
} from "@mui/material";
import apiService from "../../../../Componentes/Api/axios";
import { getLocalItem, isMobile } from "../../../../Componentes/Funcoes";
import Icon from "../../../../Assets/Emojis";
import { LoadingBox } from "../../../../Componentes/Custom";

const ReviewBarbershop = ({ barbearia, alertCustom }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [formState, setFormState] = useState({ rating: 0, comment: "" });
  const [page, setPage] = useState(1);
  const [has, setHas] = useState(false);
  const [loading, setLoading] = useState(true);

  const carregarAvaliacoes = async () => {
    setLoading(true);
    try {
      const { depoimentos, media } = await apiService.query(
        "GET",
        `/evaluation?establishmentId=${barbearia.id}&page=${page}&pageSize=4`
      );
      if (!depoimentos.length) {
        setHas(false);
        setLoading(false);
        return alertCustom("Sem mais comentários");
      }
      page === 1 && setHas(true);
      setAvaliacoes(depoimentos || []);
      setMedia(media || 0);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      //alertCustom("Erro ao carregar avaliações.");
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarAvaliacoes();
  }, [page]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Rating value={media} readOnly precision={0.1} />
            <Typography sx={{ ml: 1 }}>{media.toFixed(1)} / 5</Typography>
          </Box>
          {avaliacoes.length ? (
            avaliacoes.map(({ usuario, descricao, nota }, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{ p: 1, background: "transparent" }}
              >
                <Box sx={{ display: "flex", alignItems: "start", mb: 1 }}>
                  <Avatar
                    src={`https://srv744360.hstgr.cloud/tonsus/api/images/user/${usuario.id}/${usuario.foto}`}
                    alt={usuario.nome}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography>{usuario.nome}</Typography>
                    <Rating value={nota} readOnly size="small" />{" "}
                  </Box>{" "}
                </Box>{" "}
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", mt: -1.5, mb: 1 }}
                  color="textSecondary"
                >
                  {descricao}
                </Typography>
              </Paper>
            ))
          ) : loading ? (
            <LoadingBox message={"Carregando..."} />
          ) : (
            <Typography
              className="show-box"
              typography="body1"
              sx={{ m: "10px 0" }}
            >
              <Typography variant="h6">
                <Icon>🔥</Icon> Sem comentários ainda
              </Typography>
              Em breve seus novos clientes deixarão suas opiniões!
            </Typography>
          )}{" "}
          <Box sx={{ width: "100%", textAlign: "center", p: 1 }}>
            {has ? (
              <Button
                onClick={() => setPage(page + 1)}
                color="secondary"
                sx={{ p: "5px 10px" }}
                disabled={loading}
              >
                Mostrar mais comentários
              </Button>
            ) : (
              page > 1 && (
                <Button
                  onClick={() => setPage(page - 1)}
                  color="secondary"
                  sx={{ p: "5px 10px" }}
                  disabled={loading}
                >
                  Mostrar menos comentários
                </Button>
              )
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box component={Paper} className={isMobile ? "" : "show-box"}>
            <Typography variant="h6" gutterBottom>
              <Icon>🔍</Icon> O poder de uma boa avaliação!
            </Typography>
            As avaliações são essenciais para o crescimento do seu negócio. Elas
            ajudam a construir confiança e credibilidade, atraindo novos
            clientes e fidelizando os existentes.
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewBarbershop;
