import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

const GetUserLocation = ({
  alertCustom,
  setLocation,
  setLoading,
  loading,
  children,
}) => {
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
    <>
      {" "}
      <Typography
        variant="body2"
        sx={{
          width: "100%",
          p: 1,
          textAlign: "center",
        }}
      >
        {address}
      </Typography>
      <IconButton
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
        sx={{ background: "#363636", maxWidth: "50px" }}
      >
        {loading ? (
          <CircularProgress sx={{ color: "#fff" }} size={28} />
        ) : (
          <PlaceIcon
            sx={{ width: 28, height: 28 }}
            color={address ? "success" : "secondary"}
          />
        )}
      </IconButton>
    </>
  );
};

export default GetUserLocation;
