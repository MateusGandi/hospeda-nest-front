import {
  Button,
  CardMedia,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../Assets/logo.png";

const PublicPage = ({}) => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="lg"
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "88vh",
      }}
    >
      <Grid
        container
        spacing={1}
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
            <CardMedia
              component="img"
              image={LogoImage}
              sx={{
                width: { xs: "200px", md: "300px" },
              }}
              alt="Logo"
            />
          </Typography>
        </Grid>

        {/* Texto descritivo */}
        <Grid size={12}>
          <Typography
            variant="h5"
            style={{ marginBottom: "40px", color: "#fff" }}
          >
            Os serviços da sua barberia e tudo mais em um só lugar, agente já!
          </Typography>
        </Grid>

        {/* Botões */}
        {/* Criar */}
        <Grid item size={{ xs: 12, md: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            color="secondary"
            style={{
              border: "1px solid #303030",
              color: "#FFFFFF",
            }}
            onClick={() => navigate("/create")}
          >
            Sua primeira vez aqui ?
          </Button>
        </Grid>
        {/* Login */}
        <Grid item size={{ xs: 12, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="warning"
            style={{
              fontWeight: "bold",
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
