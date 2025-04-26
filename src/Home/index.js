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
import { getLocalItem } from "../Componentes/Funcoes";
import { TypingEffectText } from "../Componentes/Effects";

const PublicPage = () => {
  const items = {
    default: [
      { title: "Sua primeira vez aqui?", action: "/create" },
      {
        title: "Agendar um horário",
        action: "/estabelecimentos",
        force: true,
      },
    ],
    client: [
      { title: "Meus agendamentos", action: "/me" },
      {
        title: "Agendar um horário",
        action: "/estabelecimentos",
        force: true,
      },
    ],
    manager: [],
    adm: [
      { title: "Ver planos", action: "/plans" },
      { title: "Gerenciar", action: "/dashboard", force: true },
    ],
    employee: [
      { title: "Veja os termos", action: "/fac" },
      { title: "Comece a atender", action: "/dashboard", force: true },
    ],
  };

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
              m: "0 2%",
            }}
          >
            <TypingEffectText />
          </Typography>
        </Grid>

        {/* Texto descritivo */}
        <Grid size={12}>
          <Typography
            variant={"h5"}
            style={{
              marginBottom: "40px",
              color: "#fff",
            }}
          >
            <span
              style={{
                borderRadius: "10px",
                padding: "3px 10px",
              }}
            >
              Os serviços da sua barberia e tudo mais em um só lugar, agente já!
            </span>
          </Typography>
        </Grid>
        {items[
          getLocalItem("accessType") ? getLocalItem("accessType") : "default"
        ].map((item) => (
          <Grid item size={{ xs: 12, md: 3 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Button
              fullWidth
              variant={item.force ? "contained" : "outlined"}
              size="large"
              color={item.force ? "primary" : "secondary"}
              disableElevation
              style={{
                ...(item.force
                  ? { fontWeight: "bold" }
                  : { border: "1px solid #fff" }),
                color: "#FFFFFF",
              }}
              onClick={() => navigate(item.action)}
            >
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default PublicPage;
