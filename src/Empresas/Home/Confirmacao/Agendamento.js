import { Button, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";
import { useNavigate } from "react-router-dom";
import Icon from "../../../Assets/Emojis";
import { getLocalItem } from "../../../Componentes/Funcoes";
import BannerFind from "../../../Assets/Cobranca/find_banner.png";
import { useState, useEffect } from "react";

const ConfirmacaoAgendamento = ({ form }) => {
  const navigate = useNavigate();

  // 🔹 Estado inicial com objeto "content"
  const initialContent = {
    dataAgendada: "Carregando data...",
    confirmacao_label: "Agendamento confirmado!",
    notificacao_label: "",
    cancelamento_label:
      "Cancelamentos só podem ocorrer com 1h de antecedência.",
    endereco: form?.barbearia?.endereco || "",
  };

  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    // Ajuste de data
    const getAgendamentoDate = () => {
      try {
        if (!form?.agendamento?.id) return new Date();
        const data = new Date(form.agendamento.id);
        data.setHours(data.getHours() + 3);
        return data;
      } catch {
        return new Date();
      }
    };

    const dataAgendada = format(
      getAgendamentoDate(),
      "dd/MM/yyyy 'às' HH:mm'h'"
    );
    const notificacao_label = getLocalItem("flagWhatsapp")
      ? "Você será notificado por mensagem no WhatsApp quando estiver próximo do horário marcado!"
      : "Você não será notificado! Considere permitir as notificações via WhatsApp em 'configurações' para ser notificado sobre seus agendamentos";

    setContent((prev) => ({
      ...prev,
      dataAgendada,
      notificacao_label,
    }));
  }, [form]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: "60vh",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Banner */}
      <Grid size={{ md: 12, xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            width: "100%",
            minHeight: "120px",
            backgroundImage: `url(${BannerFind})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          <Typography variant="h4" sx={{ color: "#fff" }}>
            {content.dataAgendada}
          </Typography>
          <Typography variant="h6">{content.confirmacao_label}</Typography>
        </Paper>
      </Grid>

      {/* Informações */}
      <Grid
        size={{ md: 12, xs: 12 }}
        sx={{ textAlign: "start", display: "flex", flexWrap: "wrap", gap: 2 }}
        className="show-box"
      >
        <Typography variant="h6">
          <Icon>🔔</Icon> Notificação{" "}
          <Typography variant="body1">{content.notificacao_label}</Typography>
        </Typography>

        <Typography variant="h6">
          <Icon>💡</Icon> Cancelamentos{" "}
          <Typography variant="body1">{content.cancelamento_label}</Typography>
        </Typography>
      </Grid>

      {/* Botão localização */}
      <Grid size={{ md: 12, xs: 12 }}>
        <a
          href={`https://www.google.com/maps?q=${content.endereco}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            disableElevation
            color="primary"
            size="large"
            variant="contained"
            startIcon={<NavigationIcon />}
          >
            Ver Localização
          </Button>
        </a>
      </Grid>

      {/* Botão voltar */}
      <Grid size={{ md: 12, xs: 12 }}>
        <Button
          disableElevation
          color="terciary"
          size="large"
          onClick={() => navigate("/home")}
        >
          Voltar à tela inicial
        </Button>
      </Grid>
    </Grid>
  );
};

export default ConfirmacaoAgendamento;
