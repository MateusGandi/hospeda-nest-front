import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Stack,
  Typography,
  Button,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import Modal from "../../Modal/Simple";
import { getLocalItem, isMobile } from "../../Funcoes";
import { LoadingBox } from "../../Custom";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";

const LocationModalRequest = ({
  alertCustom,
  setLocation,
  location,
  extLoading,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const handleClose = () => {
    if (loading)
      return alertCustom(
        "Só mais um momento, estamos obtendo sua localização..."
      );
    setShowModal(false);
  };

  useEffect(() => {
    try {
      const savedLocation = getLocalItem("userLocation");

      if (savedLocation) {
        requestLocation(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const requestLocation = (force = false) => {
    setErro(false);
    if (!navigator.geolocation) {
      alertCustom("Geolocalização não é suportada.");
      return;
    }

    if (!force) setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const coordinates = { latitude, longitude };
          localStorage.setItem("userLocation", JSON.stringify(coordinates));

          // Buscar endereço (reverse)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          let address = "Endereço não encontrado";

          if (data?.display_name) {
            address = data.display_name.split(",").slice(0, 2).join(", ");
          }

          localStorage.setItem("userAddress", address);

          setLocation(coordinates);
          setShowModal(false);
        } catch (error) {
          alertCustom("Erro ao buscar endereço.");
        } finally {
          if (!force) setLoading(false);
        }
      },
      () => {
        alertCustom(
          "Você precisa permitir o acesso à localização no seu dispositivo!"
        );
        setErro(true);
        if (!force) setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };
  const buttons = [
    {
      titulo: "Permitir",
      disabled: loading,
      action: requestLocation,
      variant: "contained",
      color: "primary",
      sx: { width: "100%" },
    },
    {
      titulo: "Agora não",
      disabled: loading,
      action: handleClose,
      variant: "text",
      color: "secondary",
      sx: { width: "100%" },
    },
  ];
  const tutorialButton = [
    {
      titulo: "Saiba mais",
      action: () =>
        window.open(
          "https://support.google.com/chrome/answer/142065?co=GENIE.Platform%3DDesktop&hl=pt-BR",
          "_blank"
        ),
      variant: "contained",
      color: "secondary",
      sx: { width: "100%" },
    },
    {
      titulo: "Tentar novamente",
      disabled: loading,
      action: () => setErro(false) || requestLocation(true),
      variant: "text",
      color: "secondary",
      sx: { width: "100%" },
    },
  ];

  const renderButtons = () => {
    let btns = erro ? tutorialButton : buttons;

    return isMobile ? btns : btns.reverse();
  };

  return (
    <>
      {!location && !showModal && !extLoading && (
        <Stack
          onClick={() => setShowModal(true)}
          direction="row"
          spacing={2}
          sx={{
            cursor: "pointer",
            position: "fixed",
            bottom: { xs: 0, md: 32 },
            right: { xs: 0, md: 50 },
            alignItems: "center",
            justifyContent: { xs: "right", md: "center" },
            p: { xs: "10px", md: 0 },
            zIndex: 1300,
            width: { xs: "100vw", md: "auto" },
          }}
        >
          <Typography
            variant="body1"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            Habilite sua localização
          </Typography>
          <Paper
            sx={{
              bgcolor: "primary.main",
              boxShadow: 3,
              borderRadius: "50%",
            }}
          >
            <IconButton>
              <NearMeRoundedIcon fontSize="large" />
            </IconButton>
          </Paper>
        </Stack>
      )}
      <Modal
        open={showModal}
        onClose={handleClose}
        titulo=" "
        component="modal"
        maxWidth="xs"
        buttons={renderButtons()}
      >
        <Stack spacing={3} sx={{ width: "100%", textAlign: "center", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {erro
              ? "Você não está visível!"
              : "Permita acesso à sua localização!"}
          </Typography>

          {erro ? (
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Não conseguimos acessar sua localização pois está desabilitada,
              saiba como habilitar sua localização clicando em saiba mais
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Para obter as barbearias mais próximas, precisamos acessar sua
              localização atual.
            </Typography>
          )}
          <Box sx={{ height: "50px" }}>
            {loading && <LoadingBox message="Obtendo informações..." />}
          </Box>
        </Stack>
      </Modal>
    </>
  );
};

export default LocationModalRequest;
