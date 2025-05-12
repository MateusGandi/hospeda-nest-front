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
    <Box sx={{ pt: 6, pb: 2, backgroundColor: "#212121" }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            ...(isMobile ? { textAlign: "center" } : {}),
          }}
        >
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack>
              <Typography variant="h6" gutterBottom>
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
              <Typography variant="h6" gutterBottom>
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
              <Typography variant="h6" gutterBottom>
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
              <Typography variant="h6" gutterBottom>
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Inscreva-se
            </Typography>
            <Typography variant="body2" mb={2}>
              Receba novidades e atualizações.
            </Typography>
            <Box
              display="flex"
              gap={1}
              sx={{ flexWrap: "wrap", justifyContent: "end" }}
            >
              <CustomInput
                disabled={true}
                fullWidth
                placeholder="Insira seu e-mail"
                variant="outlined"
              />
              <Button variant="contained" sx={{ minWidth: "90px" }} disabled>
                Enviar
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Formas de pagamento
            </Typography>{" "}
            <Typography variant="body2">
              Integração com{" "}
              <a about="_blank" href="https://asaas.com">
                Asaas
              </a>
            </Typography>
            <Box display="flex" alignItems="center" justifyContent={"left"}>
              <img
                src={PaymentMethods}
                alt="Formas de pagamento"
                style={{ maxWidth: "200px", height: "auto" }}
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
  );
}
