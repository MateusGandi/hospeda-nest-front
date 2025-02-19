import React, { useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Box,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

const planos = [
  {
    titulo: "Plano Simples",
    preco: "R$ 29,90/mês",
    beneficios: ["Acesso ao App"],
    destaque: false,
    imagem: "https://placehold.co/300x150", // Imagem placeholder
  },
  {
    titulo: "Plano Premium",
    preco: "R$ 99,90/mês",
    beneficios: ["App", "Marketing Automático", "WhatsApp"],
    destaque: true,
    imagem: "https://placehold.co/300x150", // Imagem placeholder
  },
];

const ModalPlanos = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    onOpen: () => setModal((prev) => ({ ...prev, open: true })),
    onClose: () => setModal((prev) => ({ ...prev, open: false })),
    titulo: "Planos de Contratação",
    backAction: {
      action: () => setModal((prev) => ({ ...prev, open: false })),
      titulo: "Fechar",
    },
    loading: false,
  });

  return (
    <>
      <Button
        color="#fff"
        disableElevation
        onClick={modal.onOpen}
        variant="outlined"
        fullWidth
        sx={{ border: "1px solid #484848", color: "" }}
        startIcon={<VerifiedRoundedIcon />}
      >
        Ver Planos
      </Button>

      <Modal
        onClose={modal.onClose}
        open={modal.open}
        titulo={modal.titulo}
        backAction={modal.backAction}
        component="view"
        fullScreen="all"
        maxWidth="md"
        loading={modal.loading}
      >
        <Grid container spacing={3} justifyContent="center">
          {planos.map((plano, index) => (
            <Grid
              item
              size={{ xs: 12, md: 6 }}
              key={index}
              sx={{ height: "100%" }}
            >
              <Card
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 2,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                  backgroundColor: plano.destaque ? "#012FE5" : "transparent", // Plano Premium em destaque
                  border: plano.destaque ? "none" : "1px solid #484848", // Plano Premium sem borda
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <img
                    src={plano.imagem}
                    alt={plano.titulo}
                    style={{ width: "100%", height: "auto", borderRadius: 4 }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {plano.titulo}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    {plano.preco}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {plano.beneficios.map((beneficio, i) => (
                    <Typography key={i} variant="body2">
                      • {beneficio}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant={plano.destaque ? "contained" : "outlined"}
                    color={plano.destaque ? "secondary" : "primary"}
                    fullWidth
                    onClick={() => navigate("/contratar")}
                  >
                    Escolher Plano
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Modal>
    </>
  );
};

export default ModalPlanos;
