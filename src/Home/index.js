import {
  Button,
  CardMedia,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "../Assets/plus_banner.png";
import { getLocalItem, isMobile } from "../Componentes/Funcoes";
import { TypingEffectText } from "../Componentes/Effects";
import Footer from "../Componentes/Footer";

const PublicPage = () => {
  const [tipoAcesso] = useState(
    getLocalItem("accessType") ? getLocalItem("accessType") : "default"
  );
  const items = {
    default: [
      {
        title: "Começar agora",
        action: "/estabelecimentos",
        force: true,
      },
      { title: "Sua primeira vez aqui?", action: "/create" },
    ],
    client: [
      {
        title: "Começar agora",
        action: "/estabelecimentos",
        force: true,
      },
      { title: "Minha conta", action: "/me" },
      ...(isMobile
        ? [
            {
              title: "Sou barbeiro(a)!",
              action: "/plans",
            },
          ]
        : []),
    ],
    manager: [],
    adm: [
      { title: "Ver Barbearias", action: "/estabelecimentos" },
      { title: "Gerenciar barbearia", action: "/dashboard", force: true },
    ],
    employee: [
      { title: "Ver Barbearias", action: "/estabelecimentos" },
      { title: "Atender clientes", action: "/dashboard", force: true },
    ],
  };

  const navigate = useNavigate();
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          background: `url(${LogoImage})`,
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          height: "100vh",
          paddingTop: "50px",
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
              className={isMobile ? "show-box" : ""}
              variant={"h5"}
              style={{
                marginBottom: "40px",
              }}
            >
              <span
                style={{
                  borderRadius: "10px",
                  padding: "3px 10px",
                }}
              >
                Os serviços da sua barbearia e tudo mais em um só lugar, agende
                já!
              </span>
            </Typography>
          </Grid>
          {items[tipoAcesso].map((item) => (
            <Grid
              item
              size={{ xs: 12, md: 3 }}
              sx={{ order: { xs: 1, md: 2 } }}
            >
              <Button
                fullWidth
                variant={"contained"}
                size="large"
                color={item.force ? "primary" : "secondary"}
                disableElevation
                sx={{
                  ...(item.force
                    ? {
                        background:
                          "linear-gradient(to right, #2C69D1, #0ABCF9)",
                      }
                    : { background: "rgba(256,256,256,0.1)" }),
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
                }}
                onClick={() => navigate(item.action)}
              >
                {item.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default PublicPage;
