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
import {
  getLocalItem,
  isMobile,
  removeLocalItem,
  setLocalItem,
} from "../../Funcoes";
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
  const [actions, setActions] = useState([]);

  const handleClose = () => {
    if (loading)
      return alertCustom(
        "Só mais um momento, estamos obtendo sua localização..."
      );
    setLocalItem("disable_location_request", true);
    setShowModal(false);
  };

  useEffect(() => {
    try {
      const perm = getLocalItem("disable_location_request");
      if (perm) return;

      const savedLocation = getLocalItem("userLocation");

      if (savedLocation) {
        requestLocation();
      } else {
        setShowModal(true);
      }
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  // ⭐ Transformar geolocation em Promise REAL
  const getPosition = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

  const requestLocation = async () => {
    setErro(false);

    if (!navigator.geolocation) {
      alertCustom("Geolocalização não é suportada.");
      return;
    }

    setLoading(true);

    try {
      const position = await getPosition();

      const { latitude, longitude } = position.coords;

      const coordinates = { latitude, longitude };
      localStorage.setItem("userLocation", JSON.stringify(coordinates));

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
      alertCustom(
        "Você precisa permitir o acesso à localização no seu dispositivo!"
      );
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    {
      titulo: "Permitir",
      action: requestLocation,
      variant: "contained",
      color: "primary",
      sx: { width: "100%" },
    },
    {
      titulo: "Agora não",
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
      action: () => {
        setErro(false);
        requestLocation();
      },
      variant: "text",
      color: "secondary",
      sx: { width: "100%" },
    },
  ];

  const renderButtons = () => {
    let btns = erro ? tutorialButton : buttons;

    return isMobile ? btns : btns.reverse();
  };

  useEffect(() => {
    setActions(renderButtons());
  }, [showModal]);

  const handleOpen = () => {
    removeLocalItem("disable_location_request");
    setShowModal(true);
  };

  return (
    <>
      {!location && !showModal && !extLoading && (
        <Paper
          onClick={handleOpen}
          sx={{
            position: "fixed",
            bottom: { xs: 20, md: 32 },
            right: { xs: 10, md: 50 },
            bgcolor: "primary.main",
            boxShadow: 3,
            borderRadius: "50%",
            zIndex: 1500,
          }}
        >
          <IconButton>
            <NearMeRoundedIcon fontSize="large" />
          </IconButton>
        </Paper>
      )}
      <Modal
        open={showModal}
        onClose={handleClose}
        titulo=" "
        component="modal"
        maxWidth="xs"
        buttons={actions.map((btn) => ({ ...btn, disabled: loading }))}
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
