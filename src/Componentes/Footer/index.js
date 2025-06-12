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
import { isMobile } from "../Funcoes";
import { CustomInput } from "../Custom";

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
              ...(isMobile ? { textAlign: "center" } : {}),
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
                <Link className="show-link" to="/fac">
                  Termos
                </Link>
                <Link className="show-link" to="/fac">
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
                <Link className="show-link" to="/fac">
                  Termos & Condições
                </Link>
                <Link className="show-link" to="/fac">
                  Política de Privacidade
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom>
                Formas de pagamento
              </Typography>{" "}
              <Box display="flex" alignItems="center" justifyContent={"center"}>
                <img
                  src={PaymentMethods}
                  alt="Formas de pagamento"
                  style={{ maxWidth: "300px", height: "auto" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            mt={6}
            borderTop="1px solid #ddd"
            pt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Tonsus App. Todos os direitos
              reservados.
            </Typography>
            <Box display="flex" gap={1}>
              {/* <IconButton size="small" color="inherit">
              <Facebook />
            </IconButton> */}
              <IconButton size="small" color="inherit">
                <Instagram />
              </IconButton>
              {/* <IconButton size="small" color="inherit">
              <YouTube />
            </IconButton> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
