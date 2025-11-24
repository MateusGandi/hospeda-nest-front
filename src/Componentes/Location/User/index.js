import React, { useEffect, useState } from "react";
import { CircularProgress, Stack, Typography, Button } from "@mui/material";
import Modal from "../../Modal/Simple";
import { getLocalItem } from "../../Funcoes";
import { LoadingBox } from "../../Custom";

const LocationModalRequest = ({ alertCustom, setLocation }) => {
  const [showModal, setShowModal] = useState(false);

  // ⭐ LOADING INTERNO
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedLocation = getLocalItem("userLocation");

      if (savedLocation) {
        setLocation(savedLocation);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alertCustom("Geolocalização não é suportada.");
      return;
    }

    setLoading(true);

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
          setLoading(false);
        }
      },
      () => {
        alertCustom("Você precisa permitir o acesso à localização.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Modal
      open={showModal}
      onClose={() => {}}
      titulo=" "
      component="modal"
      maxWidth="xs"
      buttons={[
        {
          titulo: "Permitir",
          disabled: loading,
          action: requestLocation,
          variant: "contained",
          color: "primary",
          sx: { width: "100%", height: 45 },
        },
      ]}
    >
      <Stack spacing={3} sx={{ width: "100%", textAlign: "center", p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Permita acesso à sua localização
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Para obter as barbearias mais próximas, precisamos acessar sua
          localização atual.
        </Typography>

        {loading && <LoadingBox message="Obtendo informações..." />}
      </Stack>
    </Modal>
  );
};

export default LocationModalRequest;
