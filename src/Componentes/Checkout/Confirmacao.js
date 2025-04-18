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
import { QRCodeGenerator } from "../QRCode";
import { CustomInput } from "../Custom";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { PaperList } from "../Lista/Paper";
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
      subtitulo: "Escaneie o QR Code acima ou use o código copia e cola",
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

const PaymentStatus = ({ data = teste[0], alertCustom }) => {
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
        } catch (error) {
          setStatus("E" + error.status);
        }
      };

      fetchStatus();
      const interval = setInterval(fetchStatus, 5000); // Atualiza a cada 5 segundos

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
    <Container maxWidth="xs">
      <Grid container spacing={2}>
        {" "}
        {method === "pix" && (
          <>
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <QRCodeGenerator value={paymentData.qrCode} />
            </Grid>
            <Grid size={12}>
              {paymentData.linhaDigitavel && (
                <CustomInput
                  fullWidth
                  disabled
                  value={paymentData.linhaDigitavel}
                  label="Código copia e cola"
                  sx={{ mt: 2 }}
                  endIcon={
                    <IconButton
                      onClick={() =>
                        copyToClipboard(paymentData.linhaDigitavel)
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  }
                />
              )}
            </Grid>
          </>
        )}
        {method === "boleto" && (
          <Grid size={12} sx={{ textAlign: "center" }}>
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
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {paymentData.message}
            </Typography>
          </Grid>
        )}{" "}
        <Grid size={12}>
          {" "}
          <PaperList items={instructions[method]}>
            <Typography variant="h5" sx={{ p: 1 }}>
              {" "}
              Total: RS 18,99
            </Typography>
          </PaperList>{" "}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentStatus;
