import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Grid2 as Grid,
  Paper,
} from "@mui/material";
import PaymentMethods from "./PaymentMethods";
import PixPayment from "./PixPayment";
import CardPayment from "./CardPayment";
import BoletoPayment from "./BoletoPayment";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";
import { PaperList } from "../Lista/Paper";
import apiService from "../Api/axios";
import Confirmacao from "./Confirmacao";

const Checkout = ({ alertCustom }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleSubmit = async () => {
    setPaymentConfirmed(true);
    console.log("tetse mateus", modal.method);
    try {
      await apiService.query("POST");
    } catch (error) {
      alertCustom(
        "Erro ao proceder com o pagamento, tente novamente mais tarde!"
      );
    }
  };
  const [modal, setModal] = useState({
    open: true,
    method: null,
    loading: false,
    onClose: () => navigate(-1),
    actionText: "Próximo",
  });

  const orderDetails = [
    {
      id: 0,
      titulo: "Fone de Ouvido Bluetooth",
      preco: 199.99,
      subtitulo:
        "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
    },
    {
      id: 1,
      titulo: "Fone de Ouvido Bluetooth",
      preco: 199.99,
      subtitulo:
        "Fone sem fio com cancelamento de ruído e bateria de longa duração.",
    },
  ];

  const itens = [
    {
      id: 0,
      titulo: "Pix",
      subtitulo: "Pagamento com confirmação em segundos",
      value: "PIX",
      renderDetails: <PixPayment form={form} setForm={setForm} />,
      icon: <PixIcon />,
    },
    {
      id: 1,
      titulo: "Boleto Bancário",
      subtitulo: "Aprovação pode levar até dois dias",
      value: "BOLETO",
      renderDetails: <BoletoPayment form={form} setForm={setForm} />,
      icon: (
        <img
          src={BarcodeIcon}
          style={{ filter: "invert(100%)", width: "24px" }}
        />
      ),
    },
    {
      id: 2,
      titulo: "Cartão Crédito",
      subtitulo: "Pague em até 12 vezes",
      value: "CARTAO",
      renderDetails: <CardPayment form={form} setForm={setForm} />,
      icon: <CardIcon />,
    },
  ];

  return (
    <Modal
      open={modal.open}
      component="view"
      fullScreen="all"
      maxWidth="lg"
      titulo="Pedido #12323988390"
      loading={modal.loading}
      onClose={modal.onClose}
      onAction={handleSubmit}
      actionText={modal.actionText}
      backAction={
        paymentConfirmed && {
          action: () => setPaymentConfirmed(false),
          titulo: "Voltar",
        }
      }
    >
      <Container maxWidth="lg">
        {paymentConfirmed ? (
          <Confirmacao alertCustom={alertCustom} />
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h6" gutterBottom>
                Resumo do pedido
              </Typography>
              <PaperList items={orderDetails}>
                <Paper sx={{ p: 2, borderRadius: 0 }}>
                  <Typography>Subtotal: R$ 29,90</Typography>
                  <Typography>Desconto: R$ 9,90</Typography>
                  <Typography>Total: R$ 20,00</Typography>
                </Paper>
              </PaperList>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              {" "}
              <Typography variant="h6" gutterBottom>
                Escolha uma forma de pagamento
              </Typography>
              <PaymentMethods
                itens={itens}
                value={modal.method}
                onChange={(item) =>
                  setModal((prev) => ({
                    ...prev,
                    method: item.value,
                    action: item.action,
                    actionText: item.actionText,
                  }))
                }
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Modal>
  );
};

export default Checkout;
