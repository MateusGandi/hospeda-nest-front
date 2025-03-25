import React from "react";
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
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";

const BarberPresentation = ({ barbearia, handleAction, handleActionText }) => {
  const navigate = useNavigate();
  const actions = [
    {
      titulo: handleActionText,
      action: () => handleAction(),
      icon: <ContentCutRoundedIcon />,
    },
    {
      titulo: "Avaliar",
      action: () => navigate(`/${barbearia.nome}/avaliar`),
      icon: <StarRateRoundedIcon />,
    },
    {
      titulo: "Localização",
      action: () => navigate(`/${barbearia.nome}/localizacao`),
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
                  backgroundImage: `url(https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/banner/${barbearia.banner} )`,
                  backgroundColor: "#212121",
                  height: 160,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <Avatar
                src={`https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
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
                <Typography variant="body1">
                  {`A ${barbearia.distancia || "?"}km de você - ${
                    barbearia.endereco
                  }`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Rows
              items={actions}
              onSelect={({ action }) => action()}
              oneTapMode={true}
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
