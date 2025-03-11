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
import { Rows } from "../Lista/Rows";
import { PaperList } from "../Lista/Paper";
import apiService from "../Api/axios";

const Checkout = ({ alertCustom }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
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

  return (
    <Modal
      open={modal.open}
      component="view"
      fullScreen="all"
      maxWidth="lg"
      titulo="Pedido #12323988390-272024"
      loading={modal.loading}
      onClose={modal.onClose}
      onAction={handleSubmit}
      actionText={modal.actionText}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }} order={{ xs: 3, md: 1 }}>
            {" "}
            <PaymentMethods
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
          <Grid size={{ xs: 12, md: 7 }} order={{ xs: 3, md: 2 }}>
            <Container
              maxWidth="sm"
              sx={{
                p: 0,
              }}
            >
              {modal.method === "PIX" && (
                <PixPayment form={form} setForm={setForm} />
              )}
              {modal.method === "CARTAO" && (
                <CardPayment form={form} setForm={setForm} />
              )}
              {modal.method === "BOLETO" && (
                <BoletoPayment form={form} setForm={setForm} />
              )}
              {!modal.method && (
                <Typography>
                  Selecione uma forma de pagamento para prosseguir
                </Typography>
              )}
            </Container>
          </Grid>
          <Grid size={12} order={{ xs: 1, md: 2 }}>
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
        </Grid>
      </Container>
    </Modal>
  );
};

export default Checkout;
