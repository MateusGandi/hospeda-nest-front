import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "../../../Componentes/Modal";
import { isMobile } from "../../Funcoes";

const WhatsAppButton = () => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [continuar, setContinuar] = useState(false);
  const phoneNumber = "+556292324267";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isLeaving && !continuar) {
        e.preventDefault();
        setShowExitModal(true);
        return (e.returnValue =
          "Tem dúvidas? Fale agora mesmo com nosso especialista!");
      }
    };

    const handleMouseOut = (e) => {
      // Verifica se o mouse está saindo pelo topo da janela
      if (e.clientY < 10 && !continuar && !showExitModal) {
        setShowExitModal(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isLeaving, continuar, showExitModal]); // Adicionei showExitModal nas dependências

  const handleCloseModal = () => {
    setContinuar(true);
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setIsLeaving(true);
    setShowExitModal(false);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Botão Flutuante do WhatsApp */}
      <Box
        sx={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
        }}
      >
        <IconButton
          variant="contained"
          color="success"
          onClick={handleWhatsAppClick}
          sx={{
            backgroundColor: "success.main",
            color: "white",
            ":hover": {
              backgroundColor: "success.dark",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 38 }} />
        </IconButton>
      </Box>

      {/* Modal de Saída */}
      <Modal
        open={showExitModal}
        onClose={handleCloseModal}
        titulo=" "
        sx={{ textAlign: "center" }}
        component="modal"
        maxWidth="xs"
        buttons={[
          {
            titulo: "Continuar navegando",
            variant: "text",
            color: "secaondary",
            action: handleCloseModal,
          },
          {
            titulo: "Conversar agora",
            variant: "contained",
            color: "success",
            icon: <WhatsAppIcon />,
            action: handleConfirmExit,
          },
        ]}
        buttonStyle={{
          width: { md: "45%", xs: "100%" },
          mr: { md: "2.5%", xs: 0 },
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tem dúvidas?
          </Typography>

          <Typography variant="body1" sx={{ pb: 4 }}>
            Fale agora mesmo com nosso especialista online! Ele pode tirar suas
            dúvidas e te apresentar uma solução personalizada.
          </Typography>
        </Stack>
      </Modal>
    </>
  );
};

export default WhatsAppButton;
