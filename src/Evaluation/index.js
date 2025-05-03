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
} from "@mui/material";
import Modal from "../Componentes/Modal";
import { CustomInput } from "../Componentes/Custom";
import apiService from "../Componentes/Api/axios";
import { getLocalItem, isMobile } from "../Componentes/Funcoes";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Icon from "../Assets/Emojis";

const ReviewBarbershopModal = ({ barbearia, open, alertCustom }) => {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [formState, setFormState] = useState({ rating: 0, comment: "" });
  const [modalAberto, setModalAberto] = useState(true);
  const [page, setPage] = useState(1);
  const [has, setHas] = useState(false);
  const [loading, setLoading] = useState(false);

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
      page == 1 && setHas(true);
      setAvaliacoes(depoimentos || []);
      setMedia(media || 0);
    } catch (error) {
      alertCustom("Erro ao carregar avaliações.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setModalAberto(open);
  }, [open]);

  useEffect(() => {
    if (barbearia?.id) carregarAvaliacoes();
  }, [page]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { rating, comment } = formState;
      if (!comment || comment.length < 10) {
        alertCustom("Comentário deve ter pelo menos 10 caracteres.");
        return;
      }

      if (comment == 0) {
        alertCustom("Avalie entre 1 e 5 estrelas.");
        return;
      }
      await apiService.query("POST", "/evaluation", {
        descricao: comment,
        nota: rating,
        usuario: getLocalItem("userId"),
        estabelecimento: barbearia.id,
      });
      alertCustom("Avaliação enviada com sucesso!");
      setFormState({ rating: 0, comment: "" });
      carregarAvaliacoes();
    } catch (error) {
      alertCustom("Erro ao enviar avaliação.");
    }
  };

  return (
    <Modal
      open={modalAberto}
      onClose={() => navigate(-1)}
      backAction={{ titulo: "Voltar", action: () => navigate(-1) }}
      fullScreen="all"
      component="view"
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Média das Avaliações
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={media} readOnly precision={0.1} />
              <Typography sx={{ ml: 1 }}>{media.toFixed(1)} / 5</Typography>
            </Box>

            {avaliacoes.length ? (
              avaliacoes.map(({ usuario, descricao, nota }, index) => (
                <>
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{ p: "10px 0", background: "transparent" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={`https://srv744360.hstgr.cloud/tonsus/api/images/user/${usuario.id}/${usuario.foto}`}
                        alt={usuario.nome}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography fontWeight="bold">
                          {usuario.nome}
                        </Typography>
                        <Rating value={nota} readOnly size="small" />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {descricao}
                    </Typography>
                  </Paper>{" "}
                </>
              ))
            ) : (
              <Typography
                className="show-box"
                typography="body1"
                sx={{ m: "10px 0" }}
              >
                <Typography variant="h6">
                  <Icon>🔥</Icon> Seja o primeiro a comentar
                </Typography>
                Barbearia sem avaliações não significa que não é boa, mas sim
                que ela é recém chegada ao Tonsus.
              </Typography>
            )}
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

          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom>
              Avalie também
            </Typography>
            <Box className={isMobile ? "" : "show-box"}>
              <Typography variant="body1" gutterBottom>
                Escolha uma nota de 1 a 5 para avaliar o seu atendimento e o
                ambiente
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                <Rating
                  name="nova-avaliacao"
                  value={formState.rating}
                  onChange={(e, newValue) => {
                    handleChange("rating", newValue);
                    setModalAberto(true);
                  }}
                  sx={{ fontSize: 35 }}
                />
              </Typography>
              <CustomInput
                sx={{ mt: 1 }}
                placeholder="Escreva um pouco da sua experiência..."
                multiline
                rows={8}
                fullWidth
                value={formState.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
              />
              <Typography
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Button
                  variant="text"
                  color="secondary"
                  sx={{ m: "10px 0", p: "5px 15px" }}
                  onClick={handleSubmit}
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  Enviar
                </Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default ReviewBarbershopModal;
