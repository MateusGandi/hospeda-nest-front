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
          <Grid item size={{ xs: 12 }}>
            <Card elevation={0} button>
              <CardActionArea sx={{ borderRadius: "10px !important", p: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#46663B",
                      animation: "pulse 1.5s infinite",
                      marginRight: "20px",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                        "100%": { transform: "scale(1)" },
                      },
                      color: "#fff",
                    }}
                  >
                    <GpsFixedRoundedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontSize: "18px" }}>
                      Explore barbearias parceiras
                      <Typography variant="body2">
                        Ainda mais próximas de você...
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
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
