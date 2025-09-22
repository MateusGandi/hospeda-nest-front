import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Grid2 as Grid,
  Chip,
  IconButton,
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import SendIcon from "@mui/icons-material/Send";
import apiService from "../Componentes/Api/axios";
import Modal from "../Componentes/Modal/Simple";
import Confirm from "../Componentes/Alert/Confirm";
import { CustomMonthSelector } from "../Componentes/Custom";
import { CustomInput, LoadingBox } from "../Componentes/Custom";
import { Rows } from "../Componentes/Lista/Rows";
import SuportImage from "../Assets/Support/support_banner.png";
import { getLocalItem, toUTC } from "../Componentes/Funcoes";

export default function Suporte({ alertCustom }) {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const [state, setState] = useState({
    tickets: [],
    loading: false,
    selectedTicket: null,
    openModal: false,
    newMessage: "",
    openChamado: false,
    title: "",
    body: "",
    labels: [],
    confirmOpen: false,
    mesSelecionado: new Date(),
  });

  const allLabels = ["Problema", "Nova Funcionalidade", "Outros"];

  const scrollToElement = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchTickets = async (force = true) => {
    if (!state.mesSelecionado) return;
    setState((prev) => ({ ...prev, loading: force }));

    try {
      const statusMap = {
        open: "Aberto",
        closed: "Fechado",
        pending: "Pendente",
      };

      const inicio = format(startOfMonth(state.mesSelecionado), "yyyy-MM-dd");
      const fim = format(endOfMonth(state.mesSelecionado), "yyyy-MM-dd");
      const query = `?start=${inicio}&end=${fim}`;

      const data = await apiService.query(
        "GET",
        `/establishment/ticket/${getLocalItem("establishmentId")}${query}`
      );

      const ticketsAtualizados = data.map((t) => ({
        ...t,
        titulo: `#${t.id} ${t.titulo} ${toUTC(t.criadoEm)}`,
        subtitulo: (
          <Typography variant="body2" color="textSecondary">
            <Chip label={statusMap[t.status] || t.status} size="small" /> Clique
            para ver mais detalhes
          </Typography>
        ),
        sx: t.historico.map((h) => ({
          backgroundColor: h.role === "user" ? "#bbdefb" : "#c8e6c9",
          color: "#000",
          p: 1,
          borderRadius: 1,
          mb: 0.5,
        })),
      }));

      setState((prev) => ({
        ...prev,
        tickets: ticketsAtualizados,
        // atualiza ticket selecionado se houver
        selectedTicket: prev.selectedTicket
          ? ticketsAtualizados.find((t) => t.id === prev.selectedTicket.id) ||
            prev.selectedTicket
          : null,
      }));
    } catch (err) {
      console.error(err);
      alertCustom("Erro ao carregar tickets.");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [state.mesSelecionado]);

  useEffect(() => {
    const intervalo = setInterval(() => fetchTickets(false), 60000);

    return () => clearInterval(intervalo);
  }, [state.selectedTicket]);

  const handleOpenTicket = (ticket) => {
    setState((prev) => ({ ...prev, selectedTicket: ticket, openModal: true }));
    setTimeout(() => {
      scrollToElement();
    }, 500);
  };
  const handleCloseTicket = () =>
    setState((prev) => ({
      ...prev,
      selectedTicket: null,
      openModal: false,
      newMessage: "",
    }));
  const handleAbrirChamado = () =>
    setState((prev) => ({ ...prev, openChamado: true }));
  const handleCloseChamado = () =>
    setState((prev) => ({ ...prev, openChamado: false }));

  const handleSendMessage = async () => {
    if (!state.newMessage) return alertCustom("Digite uma mensagem.");

    const novaMensagem = {
      role: "author",
      author: "Você",
      message: state.newMessage,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      selectedTicket: {
        ...prev.selectedTicket,
        historico: [...prev.selectedTicket.historico, novaMensagem],
      },
      newMessage: "",
    }));

    try {
      await apiService.query(
        "POST",
        `/establishment/ticket/${state.selectedTicket.id}/message`,
        { message: novaMensagem.message }
      );
      scrollToElement();
      fetchTickets(false);
    } catch (err) {
      console.error(err);
      alertCustom("Erro ao enviar mensagem.");
    }
  };

  const toggleLabel = (label) => {
    setState((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const handleSubmitChamado = () =>
    setState((prev) => ({ ...prev, confirmOpen: true }));

  const handleConfirmChamado = async () => {
    try {
      await apiService.query(
        "POST",
        `/establishment/ticket/${getLocalItem("establishmentId")}`,
        {
          title: state.title,
          body: state.body,
          labels: state.labels,
        }
      );
      setState((prev) => ({
        ...prev,
        title: "",
        body: "",
        labels: [],
        confirmOpen: false,
        openChamado: false,
      }));
      fetchTickets();
      alertCustom("Chamado aberto com sucesso!");
    } catch (err) {
      console.error(err);
      alertCustom("Erro ao abrir chamado.");
      setState((prev) => ({ ...prev, confirmOpen: false }));
    }
  };

  return (
    <Container sx={{ flexGrow: 1, p: 4 }} maxWidth="lg">
      {/* Cabeçalho */}
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid size={{ xs: 12, md: 5 }} display="flex" justifyContent="center">
          <Box
            component="img"
            src={SuportImage}
            alt="Suporte"
            sx={{ maxWidth: 350, width: "100%" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }} textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Suporte
            <Typography variant="h6" gutterBottom>
              Entre em contato direto com os desenvolvedores do Tonsus para
              qualquer dúvida ou suporte necessário.
            </Typography>
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
              startIcon={<QuestionAnswerIcon />}
              onClick={handleAbrirChamado}
            >
              Abrir chamado
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ px: 3 }}
              startIcon={<AlternateEmailIcon />}
              onClick={() => navigate("/faq")}
            >
              Central de Dúvidas
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ order: 998 }}>
          {" "}
          <Box gap={2} className="show-box">
            <Typography variant="body1" sx={{ mb: 1 }}>
              Selecione o mês
            </Typography>
            <CustomMonthSelector
              onSelect={(item) =>
                setState((prev) => ({
                  ...prev,
                  mesSelecionado: new Date(
                    new Date().getFullYear(),
                    item.id,
                    1
                  ),
                }))
              }
              selected={
                state.mesSelecionado
                  ? [{ id: state.mesSelecionado.getMonth() }]
                  : []
              }
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ order: 999 }}>
          {state.loading ? (
            <LoadingBox message="Carregando chamados..." />
          ) : (
            <Rows
              items={state.tickets}
              onSelect={handleOpenTicket}
              oneTapMode
              onDelete={handleCloseTicket}
            />
          )}
        </Grid>
      </Grid>

      {state.selectedTicket && (
        <Modal
          open={state.openModal}
          titulo={state.selectedTicket.titulo}
          onClose={handleCloseTicket}
          maxWidth="sm"
          fullScreen="mobile"
          component="modal"
          modalStyle={{ position: "relative" }}
          dialogAction={
            <CustomInput
              placeholder="Digite sua mensagem..."
              value={state.newMessage}
              onChange={(e) =>
                setState((prev) => ({ ...prev, newMessage: e.target.value }))
              }
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              endIcon={
                <IconButton onClick={handleSendMessage} sx={{ mr: -1 }}>
                  <SendIcon />
                </IconButton>
              }
            />
          }
        >
          <Stack spacing={2}>
            <Box
              sx={{
                overflowY: "auto",
                pr: 1,
                display: "flex",
                flexDirection: "column",
              }}
              id="chat-container"
            >
              {state.selectedTicket.historico.map((h, idx) => {
                const isUser = h.role === "author"; // cliente
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: isUser ? "#0195F7" : "#4a4a4a",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        borderRadius: isUser
                          ? "10px 10px 0 10px"
                          : "10px 10px 10px 0",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography variant="body2">{h.message}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", mt: 0.5, textAlign: "right" }}
                      >
                        {toUTC(h.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              <Typography
                variant="body2"
                color="textSecondary"
                className="show-box-outlined"
                sx={{ mt: 1 }}
                ref={targetRef}
              >
                Respondemos em até 2 dias úteis. Volte aqui caso precise de mais
                informações.
              </Typography>
            </Box>
          </Stack>
        </Modal>
      )}
      {/* Modal abertura chamado */}
      <Modal
        open={state.openChamado}
        titulo="Abertura de chamado"
        onClose={handleCloseChamado}
        maxWidth="sm"
        buttons={[
          {
            titulo: "Enviar",
            action: handleSubmitChamado,
            color: "primary",
            variant: "contained",
          },
        ]}
      >
        <Stack spacing={3}>
          <CustomInput
            label="Título do problema"
            value={state.title}
            onChange={(e) =>
              setState((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <CustomInput
            label="Descrição"
            placeholder="Descreva seu problema ou sugestão..."
            minRows={8}
            multiline
            value={state.body}
            onChange={(e) =>
              setState((prev) => ({ ...prev, body: e.target.value }))
            }
          />
          <Typography variant="body1">
            Selecione o tipo de chamado
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
              {allLabels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  clickable
                  color={state.labels.includes(label) ? "primary" : "default"}
                  onClick={() => toggleLabel(label)}
                />
              ))}
            </Stack>
          </Typography>
        </Stack>
      </Modal>

      {/* Confirm abertura chamado */}
      <Confirm
        open={state.confirmOpen}
        onClose={() => setState((prev) => ({ ...prev, confirmOpen: false }))}
        onConfirm={handleConfirmChamado}
        title="Confirmar Abertura"
        message="Confirmar a abertura do chamado?"
        confirmText="Sim, enviar"
        cancelText="Cancelar"
      />
    </Container>
  );
}
