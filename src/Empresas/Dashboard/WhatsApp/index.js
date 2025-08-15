import React, { useEffect, useState } from "react";
import {
  Grid2 as Grid,
  Typography,
  Box,
  Avatar,
  Badge,
  Button,
} from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple"; // Sua Modal personalizada
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../Componentes/Funcoes";
import View from "../../../Componentes/View";
import passo1 from "../../../Assets/WhatsApp/passo1.png";
import passo2 from "../../../Assets/WhatsApp/passo2.png";
import passo3 from "../../../Assets/WhatsApp/passo3.png";
import passo4 from "../../../Assets/WhatsApp/passo4.png";
import TonsusLogo from "../../../Assets/tonsus_logo.png";

const WhatsApp = ({ barbearia, alertCustom }) => {
  const navigate = useNavigate();

  // Estados das duas modais
  const [modalBarbeiroAberto, setModalBarbeiroAberto] = useState(false);
  const [modalBotAberto, setModalBotAberto] = useState(false);

  const [mensagensBarbeiro, setMensagensBarbeiro] = useState([]);
  const [mensagensBot, setMensagensBot] = useState([]);
  const [isTypingBarbeiro, setIsTypingBarbeiro] = useState(false);
  const [isTypingBot, setIsTypingBot] = useState(false);

  const [mensagemBoasVindas, setMensagemBoasVindas] = useState("");

  // Conversa do barbeiro (ponto de vista dele)
  const conversaBarbeiro = [
    { remetente: "cliente", texto: "Oi, bom dia, tem horário pra hoje?" },
    {
      remetente: "barbeiro",
      texto: `Olá! 👋 Seja bem-vindo à ${barbearia?.nome || "Barbearia"}.

Em breve lhe atenderemos, mas se quiser ajuda a qualquer momento, conte com o nosso atendente virtual para te ajudar com agendamentos, horários e informações, está sempre disponível.
Basta clicar no link abaixo e começar a conversar
👉 api.whatsapp.com/send?phone=556292324267
Se preferir, estamos no Tonsus, pode agendar com a gente por lá também!
👉 tonsus.com.br`,
    },
    { remetente: "cliente", texto: "Certo, obrigado!" },
  ];

  // Conversa do bot (ponto de vista bot)
  const conversaBot = [
    { remetente: "cliente", texto: "Olá, bom dia." },
    {
      remetente: "bot",
      texto:
        "🤝 Olá Edu, como podemos te ajudar hoje?\n\nPor hora, podemos te ajudar com:\n- Notificações\n- Cancelamentos\n- Agendamentos\n- Dúvidas sobre o app\n- Recuperar sua conta perdida",
    },
    { remetente: "cliente", texto: "Quero agendar um horário" },
    {
      remetente: "bot",
      texto:
        "Ah sim! Você pode agendar diretamente na plataforma:\n👉 tonsus.com.br/estabelecimentos\n Lá você agenda a hora que quiser, quando e onde estiver!",
    },
    { remetente: "cliente", texto: "Opa, vou agendar agora mesmo!" },
  ];

  useEffect(() => {
    if (!barbearia) return;
    setMensagemBoasVindas(`Olá! 👋 Seja bem-vindo à *${barbearia.nome}*.

Em breve lhe atenderemos, mas se quiser ajuda a qualquer momento, conte com o nosso atendente virtual para te ajudar com agendamentos, horários e informações, está sempre disponível.
Basta clicar no link abaixo e começar a conversar
👉 api.whatsapp.com/send?phone=556292324267

Se preferir, estamos no Tonsus, pode agendar com a gente por lá também!
👉 tonsus.com.br`);
  }, [barbearia]);

  // Função para mostrar mensagens em sequência na modal do barbeiro
  useEffect(() => {
    if (!modalBarbeiroAberto) return;

    setMensagensBarbeiro([]);
    let i = 0;

    const showMessage = () => {
      if (i >= conversaBarbeiro.length) return;

      const msg = conversaBarbeiro[i];

      if (msg.remetente === "barbeiro") {
        setIsTypingBarbeiro(true);
        setTimeout(() => {
          setIsTypingBarbeiro(false);
          setMensagensBarbeiro((prev) => [...prev, msg]);
          i++;
          setTimeout(showMessage, 1800);
        }, 1500);
      } else {
        setMensagensBarbeiro((prev) => [...prev, msg]);
        i++;
        setTimeout(showMessage, 1800);
      }
    };

    setTimeout(showMessage, 1000);
  }, [modalBarbeiroAberto]);

  // Função para mostrar mensagens em sequência na modal do bot
  useEffect(() => {
    if (!modalBotAberto) return;

    setMensagensBot([]);
    let i = 0;

    const showMessage = () => {
      if (i >= conversaBot.length) return;

      const msg = conversaBot[i];

      if (msg.remetente === "bot") {
        setIsTypingBot(true);
        setTimeout(() => {
          setIsTypingBot(false);
          setMensagensBot((prev) => [...prev, msg]);
          i++;
          setTimeout(showMessage, 2000);
        }, 1500);
      } else {
        setMensagensBot((prev) => [...prev, msg]);
        i++;
        setTimeout(showMessage, 2000);
      }
    };

    setTimeout(showMessage, 1000);
  }, [modalBotAberto]);

  const renderPassos = () => (
    <Grid
      container
      spacing={4}
      sx={{ mt: 2, mb: 4, justifyContent: "center", pt: 5 }}
    >
      {[passo1, passo2, passo3, passo4].map((img, index) => (
        <Grid key={index} size={{ xs: 12, md: 3 }}>
          <Box sx={{ height: "100%" }}>
            <Avatar
              src={img}
              alt={`Passo ${index + 1}`}
              sx={{ width: 200, height: 200, mb: 2, mx: "auto" }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Passo {index + 1}
            </Typography>
            <Typography variant="body1" mt={1} color="text.secondary">
              {
                [
                  "Clique no botão para copiar a mensagem de boas-vindas.",
                  "Abra o seu WhatsApp Business no celular e vá até as configurações de mensagem de saudação.",
                  "Cole a mensagem copiada no campo da mensagem de saudação e salve.",
                  "Agora, seu cliente, ao enviar uma mensagem, receberá outra direcionando ao nosso assistente virtual.",
                ][index]
              }
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  // Modal do barbeiro com botão "Continuar"
  const renderModalBarbeiro = () => (
    <Modal
      open={modalBarbeiroAberto}
      onClose={() => setModalBarbeiroAberto(false)}
      maxWidth="xs"
      fullScreen="mobile"
      component="modal"
      titulo={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge
            overlap="circular"
            color="error"
            variant="dot"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar
              src={
                barbearia &&
                `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
              }
              sx={{ width: 40, height: 40 }}
              alt="Barbearia"
            />
          </Badge>
          <Box sx={{ mr: 1 }}>
            <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
              {barbearia?.nome || "Barbearia"}
            </Typography>
            <Typography sx={{ color: "#ccc", fontSize: "0.75rem" }}>
              Visto por último hoje às 09:00
            </Typography>
          </Box>
        </Box>
      }
      sx={{
        color: "#fff",
        borderRadius: 2,
        p: 0,
      }}
      buttons={[
        {
          action: () => {
            setModalBarbeiroAberto(false);
            setModalBotAberto(true);
          },
          variant: "text",
          color: "secondary",
          titulo: "Continuar",
        },
      ]}
    >
      <Box
        sx={{
          minHeight: 340,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          px: 2,
        }}
      >
        {mensagensBarbeiro.map((mensagem, index) => (
          <Box
            key={index}
            sx={{
              alignSelf:
                mensagem.remetente === "barbeiro" ? "flex-start" : "flex-end",
              backgroundColor:
                mensagem.remetente === "barbeiro" ? "#414141" : "#25D366",
              color: mensagem.remetente === "barbeiro" ? "#eee" : "#000",
              borderRadius:
                mensagem.remetente === "barbeiro"
                  ? "10px 10px 10px 0"
                  : "10px 10px 0 10px",
              px: 2,
              py: 1,
              mb: 1,
              maxWidth: "90%",
              fontSize: "0.85rem",
              whiteSpace: "pre-line",
            }}
          >
            {mensagem.texto}
          </Box>
        ))}
        {isTypingBarbeiro && (
          <Box
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#414141",
              color: "#ccc",
              borderRadius: "10px 10px 10px 0",
              px: 2,
              py: 1,
              fontSize: "0.85rem",
              fontStyle: "italic",
              width: "auto",
            }}
          >
            Digitando...
          </Box>
        )}
      </Box>
    </Modal>
  );

  // Modal do bot (igual à anterior)
  const renderModalBot = () => (
    <Modal
      open={modalBotAberto}
      onClose={() => setModalBotAberto(false)}
      maxWidth="xs"
      fullScreen="mobile"
      component="modal"
      titulo={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge
            overlap="circular"
            color="success"
            variant="dot"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar src={TonsusLogo} sx={{ width: 40, height: 40 }} alt="Bot" />
          </Badge>
          <Box sx={{ mr: 1 }}>
            <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
              Tonsus Bot
            </Typography>
            <Typography sx={{ color: "#ccc", fontSize: "0.75rem" }}>
              Online
            </Typography>
          </Box>
        </Box>
      }
      sx={{
        color: "#fff",
        borderRadius: 2,
        p: 0,
      }}
    >
      <Box
        sx={{
          minHeight: 340,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          px: 2,
          py: 1,
        }}
      >
        {mensagensBot.map((mensagem, index) => (
          <Box
            key={index}
            sx={{
              alignSelf:
                mensagem.remetente === "bot" ? "flex-start" : "flex-end",
              backgroundColor:
                mensagem.remetente === "bot" ? "#414141" : "#25D366",
              color: mensagem.remetente === "bot" ? "#eee" : "#000",
              borderRadius:
                mensagem.remetente === "bot"
                  ? "10px 10px 10px 0"
                  : "10px 10px 0 10px",
              px: 2,
              py: 1,
              mb: 1,
              maxWidth: "80%",
              fontSize: "0.85rem",
              whiteSpace: "pre-line",
            }}
          >
            {mensagem.texto}
          </Box>
        ))}
        {isTypingBot && (
          <Box
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#414141",
              color: "#ccc",
              borderRadius: "10px 10px 10px 0",
              px: 2,
              py: 1,
              fontSize: "0.85rem",
              fontStyle: "italic",
              width: "auto",
            }}
          >
            Digitando...
          </Box>
        )}
      </Box>
    </Modal>
  );

  const buttons = [
    {
      action: () => setModalBarbeiroAberto(true),
      variant: "text",
      color: "secondary",
      titulo: "Como funciona?",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(mensagemBoasVindas);
    alertCustom("Mensagem copiada!");
  };

  return (
    <>
      {isMobile ? (
        <Modal
          onClose={() => navigate(-1)}
          open={true}
          titulo="Tonsus no WhatsApp"
          maxWidth="lg"
          fullScreen="all"
          component="view"
          actionText="Copiar mensagem"
          onAction={handleCopy}
          buttons={buttons}
        >
          {renderPassos()}
          {renderModalBarbeiro()}
          {renderModalBot()}
        </Modal>
      ) : (
        <View
          onClose={() => navigate(-1)}
          open={true}
          titulo="Tonsus no WhatsApp"
          maxWidth="lg"
          fullScreen="all"
          component="view"
          actionText="Copiar mensagem"
          onAction={handleCopy}
          buttons={buttons}
        >
          {renderPassos()}
          {renderModalBarbeiro()}
          {renderModalBot()}
        </View>
      )}
    </>
  );
};

export default WhatsApp;
