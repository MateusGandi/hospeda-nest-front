import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Grid2 as Grid,
  Chip,
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SuportImage from "../Assets/Support/support_banner.png";
import Modal from "../Componentes/Modal/Simple";
import { CustomInput } from "../Componentes/Custom";
import Confirm from "../Componentes/Alert/Confirm";
import { getLocalItem, validarCampos } from "../Componentes/Funcoes";
import apiService from "../Componentes/Api/axios";

export default function Suporte({ alertCustom }) {
  const navigate = useNavigate();
  const telefone = "+55 62 9232-4267";

  const [open, setOpen] = useState(false); // modal abrir chamado
  const [confirmOpen, setConfirmOpen] = useState(false); // modal de confirmação antes do envio
  const [successOpen, setSuccessOpen] = useState(false); // modal de confirmação após envio
  const [successMessage, setSuccessMessage] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [labels, setLabels] = useState([]);

  const allLabels = ["Problema", "Nova Funcionalidade", "Outros"];

  const handleAbrirCentral = () => {
    navigate("/faq");
  };

  const handleAbrirWhatsApp = () => {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  const handleAbrirChamado = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleLabel = (label) => {
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      body,
      assignees: ["mateusgandi"],
      labels,
    };
    const validacoes = {
      ticket: [
        {
          campo: "title",
          label: "O título do chamado",
          validacoes: "required, minLength(5)",
        },
        {
          campo: "body",
          label: "A descrição do chamado",
          validacoes: "required, minLength(20)",
        },
        {
          campo: "labels",
          label: "O tipo do chamado",
          validacoes: "required, minLength(1)",
        },
      ],
    };
    await validarCampos("ticket", payload, validacoes)
      .then(() => setConfirmOpen(true))
      .catch((err) => {
        alertCustom(err.message);
      });
  };

  const handleConfirm = async () => {
    try {
      const payload = {
        title,
        body,
        assignees: ["mateusgandi"],
        labels,
      };

      const {
        data: { solicitacao },
      } = await apiService.query(
        "POST",
        `/establishment/ticket/${getLocalItem("establishmentId")}`,
        payload
      );

      setTitle("");
      setBody("");
      setLabels([]);
      setConfirmOpen(false);
      handleClose();
      setSuccessOpen(true); // abre confirmação de sucesso
      setSuccessMessage(
        `Chamado #${solicitacao} aberto com sucesso! Nossa equipe entrará em contato em breve.`
      );
    } catch (error) {
      console.error("Erro ao abrir chamado:", error);
      alertCustom(
        "Erro ao abrir chamado, tente novamente mais tarde ou tente outro método..."
      );
      setConfirmOpen(false);
    }
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
              disableElevation
            >
              Abrir chamado
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ px: 3 }}
              startIcon={<AlternateEmailIcon />}
              onClick={handleAbrirCentral}
              disableElevation
            >
              Central de Dúvidas
            </Button>
          </Stack>
        </Grid>
        <Grid size={12} sx={{ order: { xs: 2, md: 3 }, textAlign: "center" }}>
          <Typography variant="body1" sx={{ mt: 1 }} color="textSecondary">
            <Typography variant="body1">Telefone para contato</Typography>
            {telefone}
          </Typography>
        </Grid>
      </Grid>

      {/* Confirmação antes de enviar */}
      <Confirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmar Abertura"
        message="Confirmar a abertura do chamado?"
        confirmText="Sim, enviar"
        cancelText="Cancelar"
      />

      {/* Confirmação após envio */}
      <Confirm
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Chamado enviado"
        message={successMessage}
        confirmText="Ok"
        hideCancel
      />

      {/* Modal de abertura de chamado */}
      <Modal
        open={open}
        titulo="Abertura de chamado"
        onClose={handleClose}
        maxWidth="sm"
        buttons={[
          {
            titulo: "Enviar",
            action: handleSubmit,
            color: "primary",
            variant: "contained",
          },
        ]}
      >
        <Stack spacing={3}>
          <CustomInput
            label="Título do problema"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomInput
            label="Descrição"
            placeholder="Descreva seu problema ou sua sugestão de melhoria com detalhes..."
            minRows={8}
            multiline
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Typography variant="body1">
            Selecione o tipo de chamado
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
              {allLabels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  clickable
                  color={labels.includes(label) ? "primary" : "default"}
                  onClick={() => toggleLabel(label)}
                />
              ))}
            </Stack>
          </Typography>
        </Stack>
      </Modal>
    </Container>
  );
}
