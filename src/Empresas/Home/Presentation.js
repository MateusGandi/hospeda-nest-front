import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { LocationOn, Share } from "@mui/icons-material";
import { Rows } from "../../Componentes/Lista/Rows";
import { useNavigate } from "react-router-dom";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

const BarberPresentation = ({ barbearia, handleAction, handleActionText }) => {
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    if (barbearia?.endereco) {
      const enderecoLimpo = barbearia.endereco.replace(/\s+,/g, ",").trim();
      setEndereco(enderecoLimpo);
    }
  }, [barbearia]);

  const getMapsLink = () =>
    `https://www.google.com/maps?q=${encodeURIComponent(
      `${endereco}, ${barbearia.nome}`
    )}`;

  const getWhatsAppLink = () => {
    const mensagem = [
      `*${barbearia.nome}* está no Tonsus!`,
      "",
      `Localização no mapa: ${getMapsLink()}`,
      "",
      `Agende seu horário ou saiba mais clicando no link`,
      window.location.href,
    ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  };

  const actions = [
    {
      titulo: handleActionText,
      action: handleAction,
      icon: <ContentCutRoundedIcon />,
    },
    {
      titulo: "Avaliar",
      action: () => navigate(`/review/${barbearia.id}`),
      icon: <StarRateRoundedIcon />,
    },
    {
      titulo: "Localização",
      action: () => window.open(getMapsLink(), "_blank"),
      icon: <LocationOn />,
    },
    {
      titulo: "Compartilhar",
      action: () => window.open(getWhatsAppLink(), "_blank"),
      icon: <Share />,
    },
  ];

  return (
    <>
      {barbearia ? (
        <Grid container>
          <Grid item size={{ xs: 12, mb: 0 }}>
            <Card elevation={0} sx={{ position: "relative" }}>
              <Box
                sx={{
                  backgroundImage: `url(${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/banner/${barbearia.banner})`,
                  backgroundColor: "#212121",
                  height: 160,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Avatar
                src={`${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                sx={{
                  width: 160,
                  height: 160,
                  position: "absolute",
                  top: 125,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <CardContent sx={{ textAlign: "center", marginTop: 4 }}>
                <Typography variant="h6">{barbearia.nome}</Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", wordBreak: "break-word" }}
                >
                  {barbearia.endereco.replace(/\s+,/g, ",").trim()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12 }} sx={{ mt: "10px" }}>
            <Rows
              items={actions}
              onSelect={({ action }) => action()}
              oneTapMode
              collapse
              distribution={3}
            />
          </Grid>
        </Grid>
      ) : (
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Estabelecimento não encontrado!</Typography>
        </div>
      )}
    </>
  );
};

export default BarberPresentation;
