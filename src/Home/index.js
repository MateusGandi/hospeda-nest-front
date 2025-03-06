import {
  Button,
  CardMedia,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../Assets/plus_banner.png";
import TypingEffectText from "../Componentes/Effects";
import { isMobile } from "../Componentes/Funcoes";

const PublicPage = ({}) => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="lg"
      sx={{
        background: `url(${LogoImage})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        height: "calc(100vh - 65px)",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          textAlign: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Texto principal */}
        <Grid size={12}>
          <Typography
            variant="h2"
            sx={{
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TypingEffectText />
            {/* <CardMedia
              component="img"
              image={LogoImage}
              sx={{
                width: { xs: "600px", md: "300px" },
              }}
              alt="Logo"
            /> */}
          </Typography>
        </Grid>

        {/* Texto descritivo */}
        <Grid size={12}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            style={{ marginBottom: "40px", color: "#fff" }}
          >
            Os serviços da sua barberia e tudo mais em um só lugar, agente já!
          </Typography>
        </Grid>

        {/* Botões */}
        {/* Criar */}
        <Grid item size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            color="secondary"
            disableElevation
            style={{
              border: "1px solid #fff",
              color: "#FFFFFF",
            }}
            onClick={() => navigate("/create")}
          >
            Sua primeira vez aqui ?
          </Button>
        </Grid>
        {/* Login */}
        <Grid item size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            disableElevation
            style={{
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
            onClick={() => navigate("/estabelecimentos")}
          >
            Agendar um horário
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
export default PublicPage;
