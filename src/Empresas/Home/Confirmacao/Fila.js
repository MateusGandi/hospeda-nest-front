import { Button, Grid2 as Grid, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";
import { useNavigate } from "react-router-dom";
import { getLocalItem } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import BannerFind from "../../../Assets/Cobranca/find_banner.png";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const ConfirmacaoFila = ({ form, alertCustom }) => {
  const [content, setContent] = useState({
    notificacao_label:
      "Você será notificado por mensagem no WhatsApp quando estiver próximo de ser atendido!",
    notificacao_title: (
      <>
        <Icon>🔔</Icon> Notificação
      </>
    ),

    atendimento_title: (
      <>
        <Icon>🕐</Icon> Horário previsto para atendimento
      </>
    ),
    atendimento_label: "",

    posicao_label: "",
    tempo_espera_label: "",
  });

  useEffect(() => {
    if (!form.in_fila || !form.fila_info) return;

    const temp = content;

    const whatsapp_enabled = getLocalItem("flagWhatsapp");

    if (!whatsapp_enabled)
      temp.notificacao_label =
        "Você não será notificado! Considere permitir as notificações via WhatsApp em 'configurações' para ser notificado sobre modificações na fila";
    const {
      agendamento: { posicaoFila, horarioPrevisto, tempoEspera },
    } = form.fila_info;

    temp.posicao_label = `Você é o ${posicaoFila}º na fila`;
    temp.tempo_espera_label = `Tempo médio de espera: ${tempoEspera}`;
    temp.atendimento_label = format(
      new Date(horarioPrevisto),
      "dd/MM/yyyy' às 'HH:mm'h'"
    );

    setContent(temp);
  }, []);

  const navigate = useNavigate();

  return (
    <Grid
      container
      sx={{
        height: "60vh",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      spacing={2}
    >
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
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
              }}
            >
              {content.posicao_label}
            </Typography>
            {content.tempo_espera_label}
          </Typography>
        </Paper>
      </Grid>

      <Grid
        size={{ md: 12, xs: 12 }}
        className="show-box"
        sx={{ textAlign: "start", display: "flex", flexWrap: "wrap", gap: 2 }}
      >
        {" "}
        <Typography variant="h6">
          {content.atendimento_title}
          <Typography variant="body1">{content.atendimento_label}</Typography>
        </Typography>
        <Typography variant="h6">
          {content.notificacao_title}
          <Typography variant="body1">{content.notificacao_label}</Typography>
        </Typography>
      </Grid>

      <Grid size={{ md: 12, xs: 12 }}>
        <a
          href={`https://www.google.com/maps?q=${form?.barbearia?.endereco}`}
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

      <Grid size={{ md: 12, xs: 12 }}>
        <Button
          disableElevation
          color="terciary"
          size="large"
          onClick={() => navigate("/home")}
        >
          Voltar À tela inicial
        </Button>
      </Grid>
    </Grid>
  );
};

export default ConfirmacaoFila;
