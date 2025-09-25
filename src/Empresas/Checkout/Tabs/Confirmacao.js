import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Container,
  IconButton,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardActions,
  CardActionArea,
} from "@mui/material";
import { QRCodeGenerator } from "../../../Componentes/QRCode";
import { CustomInput, LoadingBox } from "../../../Componentes/Custom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toUTC } from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";
import { Download } from "@mui/icons-material";
import BoletoImage from "../../../Assets/Cobranca/boleto.svg";

const instructions = {
  BOLETO: [
    {
      id: 0,
      titulo: "Prazos para confirmação",
      subtitulo: "Boletos podem levar até dois dias para serem aprovados",
    },
  ],
  PIX: [
    {
      id: 1,
      titulo: "Instruções",
      subtitulo: "Escaneie o QR Code ou use o código copia e cola",
    },
    {
      id: 0,
      titulo: "Prazos",
      subtitulo: "Realize o pagamento até dia {expirationDate} horas",
    },
  ],
  CREDIT_CARD: [
    {
      id: 0,
      titulo: "O banco está confirmando seus dados",
      subtitulo: "Aguarde até a conclusão",
    },
  ],
};

const PaymentStatus = ({ info, alertCustom, onConfirm }) => {
  const [data] = useState(info);
  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const response = await apiService.query(
          "GET",
          `/payment/checkout-payment-status/${data.checkoutId}`
        );

        if (response.status === "VENCIDO") {
          throw new Error("Pagamento expirado!");
        }

        if (response.status !== "PAGO") return;

        clearInterval(intervalId);
        onConfirm(response.data, false);
      } catch (error) {
        clearInterval(intervalId);
        onConfirm(error.message, true);
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, [data]);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alertCustom("Código PIX copiado para a área de tranferência");
      })
      .catch((err) => {
        console.error("Falha ao copiar texto:", err);
      });
  };

  return (
    <Grid container spacing={2}>
      {data && data.metodoPagamento && (
        <>
          {data.metodoPagamento.nomeApi === "PIX" && (
            <>
              <Grid size={{ xs: 12, md: 7 }} className="justify-center">
                {!data.payload ? (
                  <LoadingBox message="Carregando informações..." />
                ) : (
                  <Grid
                    elevation={0}
                    container
                    component={Paper}
                    sx={{
                      justifyItems: "center",
                      backgroundColor: "#fff",
                      p: 2,
                      borderRadius: "16px",
                      boxShadow: 2,
                      justifyContent: "center",
                    }}
                  >
                    {/* QR Code */}
                    <Grid size={12} item>
                      <Box display="flex" justifyContent="center">
                        <QRCodeGenerator value={data.payload} />
                      </Box>
                    </Grid>

                    {/* Linha Digitável */}
                    <Grid size={12} item sx={{ mt: 2 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 1.5,
                          backgroundColor: "#e3e3e3ff",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#000",
                            pr: 1,
                          }}
                        >
                          {data.payload}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(data.linhaDigitavel)}
                        >
                          <ContentCopyIcon
                            fontSize="small"
                            sx={{ color: "#000" }}
                          />
                        </IconButton>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          {data.metodoPagamento.nomeApi === "BOLETO" && (
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                textAlign: "center",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Card elevation={0}>
                <CardActionArea
                  sx={{ borderRadius: "0 !important" }}
                  onClick={() => window.open(data.bankSlipUrl, "_blank")}
                >
                  <CardMedia component="img" image={BoletoImage} alt="boleto" />
                  <CardActions
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      color="terciary"
                      sx={{ px: 2 }}
                      disableElevation
                      size="large"
                      endIcon={<Download />}
                    >
                      Download Boleto
                    </Button>
                  </CardActions>
                </CardActionArea>
              </Card>

              <CustomInput
                fullWidth
                label="Linha digitável"
                value={data.barCode}
                endIcon={
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(data.barCode)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                }
              />
            </Grid>
          )}
          {data.metodoPagamento.nomeApi === "CREDIT_CARD" && (
            <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {data.message}
              </Typography>
            </Grid>
          )}
          {data.metodoPagamento.nomeApi && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h6" className="show-box">
                Instruções
                {instructions[data.metodoPagamento.nomeApi].map(
                  ({ subtitulo }, index) => (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {`${index + 1}. ${subtitulo.replace(
                        "{expirationDate}",
                        toUTC(data.expirationDate?.replace(" ", "T"))
                      )}.`}
                    </Typography>
                  )
                )}
              </Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default PaymentStatus;
