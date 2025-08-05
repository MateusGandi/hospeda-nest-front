import React, { useState } from "react";
import {
  Button,
  Grid2 as Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Container,
  Stack,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Icon from "../../../Assets/Emojis";
import LogoTonsus from "../../../Assets/tonsus_logo.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";

const WhatsApp = ({ barbearia, alertCustom }) => {
  const navigate = useNavigate();
  const [mensagensChat] = useState([
    { remetente: "cliente", texto: "Olá, bom dia." },
    {
      remetente: "bot",
      texto:
        "🤝 Olá Edu, como podemos te ajudar hoje?\n\nPor hora, podemos te ajudar com:\n- Notificações\n- Cancelamentos\n- Agendamentos\n- Dúvidas sobre o app\n- Recuperar sua conta perdida",
    },
    { remetente: "cliente", texto: "Estou com algumas dúvidas..." },
    {
      remetente: "bot",
      texto:
        "Vamos lá, sobre o que quer saber mais?\n- Como funciona o app\n- Como funciona o CashBack",
    },
  ]);

  const mensagemBoasVindas = `Olá! 👋 Seja bem-vindo à *${barbearia.nome}*. 

Em breve lhe atenderemos, mas se quiser ajuda a qualquer momento, conte com o nosso atendente virtual para te ajudar com agendamentos, horários e informações, está sempre disponível.
Basta clicar no link abaixo e começar a conversar
👉 api.whatsapp.com/send?phone=556292324267

Se preferir, estamos no Tonsus, pode agendar com  a gente por lá também!
👉 tonsus.com.br`;

  return (
    <>
      <Modal
        onClose={() => navigate(-1)}
        open={true}
        titulo="Tonsus no WhatsApp"
        maxWidth="lg"
        fullScreen="all"
        component="view"
      >
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div></div>
            <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
              {/* Imagem de fundo torta */}
              <Box
                component="img"
                src={LogoTonsus}
                alt="logo tonsus"
                sx={{
                  position: "absolute",
                  top: "-10px",
                  left: "25px",
                  width: "60px",
                  transform: "rotate(-15deg)",
                  opacity: 0.2,
                  zIndex: 1,
                }}
              />

              {/* Texto por cima da imagem */}
              <Typography
                variant="h4"
                sx={{
                  position: "relative",
                  zIndex: 2,

                  fontWeight: "bold",
                }}
              >
                Seu Atendimento no Automático
              </Typography>
            </Box>
            <Typography variant="h6">
              Um atendente virtual que responde a mensagens de forma acertiva e
              mantém sua agenda funcionando até mesmo fora do expediente
              <Typography
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                {" "}
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(mensagemBoasVindas);
                    alertCustom("Mensagem copiada!");
                  }}
                  size="large"
                  color="success"
                  variant="contained"
                  disableElevation
                  endIcon={<ContentCopyIcon />}
                  sx={{
                    color: "#fff !important",
                    maxWidth: "300px",
                  }}
                >
                  Copiar mensagem
                </Button>
              </Typography>{" "}
            </Typography>{" "}
            <Typography
              variant="h6"
              className="show-box"
              sx={{ textAlign: "left" }}
            >
              <Icon>📌</Icon> Como começar
              <Typography variant="body1">
                Copie a mensagem de <b>boas-vindas</b> e use no seu{" "}
                <b>WhatsApp Business</b> para direcionar seus clientes ao
                atendente virtual.
              </Typography>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                width: "350px",
                height: "500px",
                margin: "0 auto",
                position: "relative",
                backgroundColor: "#fff",
                boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  padding: 2,
                  overflowY: "auto",
                }}
              >
                {mensagensChat.map((mensagem, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf:
                        mensagem.remetente === "bot"
                          ? "flex-end"
                          : "flex-start",
                      background:
                        mensagem.remetente === "bot" ? "#d1f7d6" : "#ffffff",
                      borderRadius:
                        mensagem.remetente === "bot"
                          ? "10px 10px 0px 10px"
                          : "10px 10px 10px 0px",
                      padding: "8px 12px",
                      maxWidth: "80%",
                      whiteSpace: "pre-line",
                      color: "#000",
                      fontSize: "0.85rem",
                    }}
                  >
                    {mensagem.texto}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default WhatsApp;
