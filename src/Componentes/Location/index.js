import React, { useState } from "react";
import { Button, Chip, Typography } from "@mui/material";

const GetUserLocation = ({ alertCustom, setLocation, setLoading, loading }) => {
  const [address, setAddress] = useState("");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alertCustom("Geolocalização não é suportada no navegador.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({ latitude, longitude });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            setAddress(data.display_name.split(",").slice(0, 2).join(", "));
          } else {
            setAddress("Endereço não encontrado");
          }
        } catch (err) {
          setAddress("Erro ao buscar endereço.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alertCustom(err.message);
        setLoading(false);
      }
    );
  };

  return (
    <Chip
      color={address ? "warning" : "inherit"}
      label={loading ? "Carregando..." : address || "Usar minha Localização"}
      disabled={loading}
      onClick={
        address
          ? () => {
              setAddress("");
              setLocation(null);
            }
          : () => handleGetLocation()
      }
      size="large"
    />
  );
};

export default GetUserLocation;
