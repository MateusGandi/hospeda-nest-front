import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid2 as Grid,
  Container,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import SuportImage from "../Assets/Support/support_banner.png";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

export default function Suporte({ alertCustom }) {
  const navigate = useNavigate();
  const telefone = "(61) 99999-9999";
  const email = "suporte@exemplo.com";

  const handleAbrirCentral = () => {
    navigate("/faq");
  };

  const handleAbrirWhatsApp = () => {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  const handleCopiarEmail = () => {
    navigator.clipboard.writeText(email);
    alertCustom("E-mail copiado!");
  };

  return (
    <Container sx={{ flexGrow: 1, p: 4 }} maxWidth="lg">
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid size={{ xs: 12, md: 5 }} display="flex" justifyContent="center">
          <Box
            component="img"
            src={SuportImage}
            alt="Suporte"
            sx={{ maxWidth: 350, width: "100%" }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 7 }}
          textAlign={{ xs: "center", md: "left" }}
          sx={{ order: { xs: 3, md: 2 } }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Suporte
            <Typography variant="h6" gutterBottom>
              Entre em contato direto com os desenvolvedores do Tonsus para
              qualquer dúvida ou suporte necessário.
            </Typography>{" "}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            mt={4}
            justifyContent={{ xs: "center", md: "flex-start" }}
            sx={{ flexWrap: "wrap", gap: 2 }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{ px: 3, color: "#fff" }}
              startIcon={<WhatsAppIcon />}
              onClick={handleAbrirWhatsApp}
              disableElevation
            >
              WhatsApp
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ px: 3 }}
              startIcon={<AlternateEmailIcon />}
              onClick={handleCopiarEmail}
              disableElevation
            >
              Enviar E-mail
            </Button>

            <Button
              color="terciary"
              variant="text"
              size="large"
              onClick={handleAbrirCentral}
              disableElevation
            >
              Central de Dúvidas
            </Button>
          </Stack>
        </Grid>
        <Grid size={12} sx={{ order: { xs: 2, md: 3 }, textAlign: "center" }}>
          <Typography variant="body1" sx={{ mt: 1 }} color="textSecondary">
            <Typography variant="body1" gutterBottom>
              {email}
            </Typography>{" "}
            {telefone}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
