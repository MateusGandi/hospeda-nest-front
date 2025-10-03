import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Rows } from "../../Componentes/Lista/Rows";
import { useNavigate } from "react-router-dom";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

const BarberPresentation = ({ barbearia, handleAction, handleActionText }) => {
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    if (barbearia && barbearia.endereco) {
      const enderecoLimpo = barbearia.endereco.replace(/\s+,/g, ",").trim();
      setEndereco(enderecoLimpo);
    }
  }, [barbearia]);

  const actions = [
    {
      titulo: handleActionText,
      action: () => handleAction(),
      icon: <ContentCutRoundedIcon />,
    },
    {
      titulo: "Avaliar",
      action: () => navigate(`/review/${barbearia.id}`),
      icon: <StarRateRoundedIcon />,
    },
    {
      titulo: "Localização",
      action: () => {
        const enderecoCompleto = `${endereco}, ${barbearia.nome}`;
        window.open(
          `https://www.google.com/maps?q=${encodeURIComponent(
            enderecoCompleto
          )}`,
          "_blank"
        );
      },
      icon: <LocationOn />,
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
                  backgroundImage: `url(${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/banner/${barbearia.banner} )`,
                  backgroundColor: "#212121",
                  height: 160,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <Avatar
                src={`${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                sx={{
                  width: "160px",
                  height: "160px",
                  position: "absolute",
                  top: "125px",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              <CardContent sx={{ textAlign: "center", marginTop: 4 }}>
                <Typography variant="h6">{barbearia.nome}</Typography>

                <Typography variant="body1">{endereco}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12 }} sx={{ mt: "10px" }}>
            <Rows
              items={actions}
              onSelect={({ action }) => action()}
              oneTapMode={true}
              collapse={true}
              distribution={3}
            />
          </Grid>{" "}
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
