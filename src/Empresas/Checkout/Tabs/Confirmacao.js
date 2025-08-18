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
} from "@mui/material";
import { QRCodeGenerator } from "../../../Componentes/QRCode";
import { CustomInput, LoadingBox } from "../../../Componentes/Custom";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { PaperList } from "../../../Componentes/Lista/Paper";

const teste = [
  {
    method: "pix",
    data: {
      qrCode: "000201010211...",
      url: "https://api.exemplo.com/status-pix",
      linhaDigitavel:
        "12345.67890 12345.678904 12345.678904 5 678900000000006789000000000067890000000000",
    },
  },
  {
    method: "boleto",
    data: {
      url: "https://api.exemplo.com/ver-boleto",
    },
  },
  {
    method: "cartao",
    data: {
      message: "Pagamento em processamento...",
      url: "https://api.exemplo.com/status-cartao",
    },
  },
];

const instructions = {
  boleto: [
    {
      id: 0,
      titulo: "Realize o pagamento até dia 14/05/2025 as 14:00 horas",
      subtitulo: "Boletos podem leva até dois dias para serem aprovados",
    },
  ],
  pix: [
    {
      id: 1,
      titulo: "Instruções",
      subtitulo: "Escaneie o QR Code ou use o código copia e cola",
    },
    {
      id: 0,
      titulo: "Prazos",
      subtitulo: "Realize o pagamento até dia 12/05/2025 as 14:00 horas",
    },
  ],
  cartao: [
    {
      id: 0,
      titulo: "O banco está confirmando seus dados",
      subtitulo: "Aguarde até a conclusão",
    },
  ],
};

const PaymentStatus = ({ data = teste[0], alertCustom, onConfirm }) => {
  const code = {
    E500: "Erro no servidor",
    E400: "Erro ao aprovar pagamento!",
    E0: "Aguardando pagamento...",
    E200: "Pagamento realizado com sucesso!",
  };
  const [status, setStatus] = useState("E0");
  const { method, data: paymentData } = data;

  useEffect(() => {
    if (paymentData.url) {
      const fetchStatus = async () => {
        try {
          const response = await axios.get(paymentData.url);
          setStatus("E" + response.data.status);
          onConfirm(response.data, false);
        } catch (error) {
          setStatus("E" + error.status);
          onConfirm(error.message, true);
        }
      };

      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);

      return () => clearInterval(interval);
    }
  }, [paymentData.url]);

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
      {method === "pix" && (
        <>
          <Grid size={{ xs: 12, md: 7 }} className="justify-center">
            {!paymentData.qrCode ? (
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
                    <QRCodeGenerator value={paymentData.qrCode} />
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
                      {paymentData.linhaDigitavel}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(paymentData.linhaDigitavel)
                      }
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
      {method === "boleto" && (
        <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disableElevation
            onClick={() => window.open(paymentData.url, "_blank")}
          >
            Clique aqui e baixe seu Boleto
          </Button>
        </Grid>
      )}
      {method === "cartao" && (
        <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {paymentData.message}
          </Typography>
        </Grid>
      )}
      {method && (
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h6" className="show-box">
            Instruções
            {instructions[method].map(({ subtitulo }, index) => (
              <Typography variant="body1" sx={{ mb: 1 }}>
                {`${index + 1}. ${subtitulo}.`}
              </Typography>
            ))}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default PaymentStatus;
