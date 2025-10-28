import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid2,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { getLocalItem } from "../../Funcoes";

const GetUserLocation = ({
  alertCustom,
  setLocation,
  setLoading,
  loading,
  children,
}) => {
  const [address, setAddress] = useState("");

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedLocation = getLocalItem("userLocation");
      const savedAddress = getLocalItem("userAddress");

      if (savedLocation && savedAddress) {
        setLocation(savedLocation);
        setAddress(savedAddress);
      } else {
        handleGetLocation();
      }
    } catch (error) {
      handleGetLocation();
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alertCustom("Geolocalização não é suportada no navegador.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = { latitude, longitude };
        setLocation(locationData);
        localStorage.setItem("userLocation", JSON.stringify(locationData));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            const formattedAddress = data.display_name
              .split(",")
              .slice(0, 2)
              .join(", ");
            setAddress(formattedAddress);
            localStorage.setItem("userAddress", formattedAddress);
          } else {
            setAddress("Endereço não encontrado");
            localStorage.removeItem("userAddress");
          }
        } catch (err) {
          setAddress("Erro ao buscar endereço.");
          localStorage.removeItem("userAddress");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alertCustom("Por favor, permita o acesso à localização.");
        setLoading(false);
      }
    );
  };

  const handleClearLocation = () => {
    setAddress("");
    setLocation(null);
    localStorage.removeItem("userLocation");
    localStorage.removeItem("userAddress");
  };

  return (
    <>
      <Grid2 size={12}>
        <Typography
          variant="body1"
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          {address || ""}
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 2, md: 1.2 }}>
        <Tooltip title="Exibir barbearias próximas">
          <IconButton
            disabled={loading}
            onClick={
              loading
                ? () => {}
                : address
                ? handleClearLocation
                : handleGetLocation
            }
            size="large"
            sx={{ background: "#363636", maxWidth: "50px" }}
          >
            {loading ? (
              <CircularProgress sx={{ color: "#fff" }} size={28} />
            ) : (
              <PlaceIcon
                sx={{ width: 28, height: 28 }}
                color={address ? "info" : "secondary"}
              />
            )}
          </IconButton>
        </Tooltip>
      </Grid2>
    </>
  );
};

export default GetUserLocation;
