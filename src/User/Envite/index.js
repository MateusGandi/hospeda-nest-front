import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import Api from "../../Componentes/Api/axios";
import Icon from "../../Assets/Emojis";
import { getLocalItem } from "../../Componentes/Funcoes";

export default function Envite() {
  const { establishmentId, token } = useParams();

  const [usuario, setUsuario] = useState({
    nome: "João da Silva",
    id: getLocalItem("userId"),
    foto: "",
  });

  const [barbearia, setBarbearia] = useState({
    id: establishmentId ?? "",
    nome: "Barbearia do Zé",
    profile: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Busca dados da barbearia
        const est = await Api.query(
          "GET",
          `/establishment?establishmentId=${establishmentId}`
        );

        const [latitude, longitude] = est.longitudeAndLatitude ?? [];
        const { horarioFechamento, horarioAbertura } = est;

        setBarbearia({
          ...est,
          horarioFechamento: horarioFechamento?.slice(0, 5),
          horarioAbertura: horarioAbertura?.slice(0, 5),
          location: { latitude, longitude },
        });
      } catch {
        alert("Erro ao buscar informações da barbearia!");
      }

      try {
        // Busca dados do usuário
        const userData = await Api.query(
          "GET",
          `/user/profile/${getLocalItem("userId")}`
        );
        setUsuario(userData);
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      }

      setLoading(false);
    };

    fetch();
  }, [establishmentId]);

  const fotoBarbearia = barbearia?.id
    ? `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
    : "https://via.placeholder.com/100";

  const fotoUsuario = usuario?.id
    ? `https://srv744360.hstgr.cloud/tonsus/api/images/user/${usuario.id}/${usuario.foto}`
    : "https://via.placeholder.com/100";

  if (loading) return null;

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={3}>
        {/* Avatares */}
        <Grid size={12}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid>
              <Avatar
                src={fotoUsuario}
                alt={usuario.nome}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: "35px",
                  fontWeight: 600,
                  border: "3px solid #25d366",
                }}
              />
            </Grid>
            <Grid>
              <ArrowForwardIcon fontSize="large" sx={{ color: "#373737ff" }} />
            </Grid>
            <Grid>
              <Avatar
                src={fotoBarbearia}
                alt={barbearia.nome}
                sx={{
                  width: 100,
                  height: 100,
                  fontWeight: 600,
                  fontSize: "35px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Mensagem */}
        <Grid size={12}>
          <Typography variant="h6" align="center" gutterBottom sx={{ mb: 2 }}>
            <strong>{usuario.nome}</strong>, você foi convidado para se tornar
            funcionário na <strong>{barbearia.nome}</strong>!
          </Typography>
          <Typography variant="h6" className="show-box">
            <Icon>🔥</Icon> O que muda?
            <Typography variant="body1">
              1. Sua conta será convertida para um perfil profissional
            </Typography>
            <Typography variant="body1">
              2. Você autoriza o uso dos seus dados pelo estabelecimento
            </Typography>
            <Typography variant="body1">
              3. Terá acesso a recursos administrativos da barbearia
            </Typography>
          </Typography>
        </Grid>

        {/* Botões */}
        <Grid size={12}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Button
                fullWidth
                color="terciary"
                size="large"
                startIcon={<CloseIcon />}
              >
                Recusar
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Aceitar convite
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
