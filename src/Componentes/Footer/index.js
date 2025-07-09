import {
  Box,
  Container,
  Grid2 as Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";

import PaymentMethods from "../../Assets/Footer/formas_pagamento.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <Box
        sx={{
          height: "100px",
          marginTop: "-100px",
          background:
            "linear-gradient( to top,rgba(0, 0, 0, 1) 5%,rgba(0, 0, 0, 0.6) 50%,transparent 100%)",
        }}
      ></Box>
      <Box
        sx={{
          pt: 6,
          pb: 2,

          marginTop: "-30px",
        }}
      >
        <Container
          maxWidth="lg"
          sx={
            {
              // paddingTop: "30px"
            }
          }
        >
          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              xs: { textAlign: "center" },
            }}
          >
            <Grid size={{ xs: 12, md: 3 }}>
              <Stack>
                <Typography variant="body1" gutterBottom>
                  Tonsus App
                </Typography>

                <Link className="show-link" to="/home">
                  Home
                </Link>
                <Link className="show-link" to="/faq">
                  Termos
                </Link>
                <Link className="show-link" to="/faq">
                  Sobre Nós
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              {" "}
              <Stack>
                <Typography variant="body1" gutterBottom>
                  Especialidades
                </Typography>
                <Link className="show-link" to="/estabelecimentos">
                  Agendamento Online
                </Link>
                <Link className="show-link" to="/plans">
                  Marketing
                </Link>{" "}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Stack>
                <Typography variant="body1" gutterBottom>
                  Contato
                </Typography>
                <a
                  className="show-link"
                  href="https://api.whatsapp.com/send?phone=556292324267"
                >
                  (62) 9232-4267
                </a>
                <Link className="show-link">Aparecida de Goiânia - GO</Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Stack>
                <Typography variant="body1" gutterBottom>
                  Legal
                </Typography>
                <Link className="show-link" to="/faq">
                  Termos & Condições
                </Link>
                <Link className="show-link" to="/faq">
                  Política de Privacidade
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: "center" }}>
              <Box display="flex" alignItems="center" justifyContent={"center"}>
                <img
                  src={PaymentMethods}
                  alt="Formas de pagamento"
                  style={{
                    maxWidth: "300px",
                    height: "auto",
                    margin: "50px 0",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
