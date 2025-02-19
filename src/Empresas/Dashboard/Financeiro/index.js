import React, { useState } from "react";
import { Typography, Divider, Grid2 as Grid, Button } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { Rows } from "../../../Componentes/Lista/Rows";
import { useNavigate } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

const dadosMock = {
  receita: 12500.75,
  estoque: [
    { produto: "Shampoo", quantidade: 15 },
    { produto: "Cera Modeladora", quantidade: 8 },
    { produto: "Navalha Profissional", quantidade: 5 },
  ],
  vendas: [
    { cliente: "João Silva", valor: 120.5, data: "10/02/2025" },
    { cliente: "Maria Souza", valor: 85.0, data: "12/02/2025" },
    { cliente: "Carlos Mendes", valor: 200.75, data: "15/02/2025" },
  ],
  servicos: [
    {
      nome: "Corte Masculino",
      profissional: "Lucas Pereira",
      data: "10/02/2025",
    },
    {
      nome: "Barba Completa",
      profissional: "Fernando Almeida",
      data: "12/02/2025",
    },
    { nome: "Hidratação", profissional: "Ana Beatriz", data: "15/02/2025" },
  ],
};

const ModalRelatorio = ({ open, onClose, dados = dadosMock }) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    onOpen: () => setModal((prev) => ({ ...prev, open: true })),
    onClose: () => setModal((prev) => ({ ...prev, open: false })),
    titulo: "Financeiro",
    backAction: {
      action: () => setModal((prev) => ({ ...prev, open: false })),
      titulo: "Voltar",
    },
    loading: false,
  });

  return (
    <>
      <Button
        color="warning"
        disableElevation
        onClick={modal.onOpen}
        variant="outlined"
        fullWidth
        startIcon={<AttachMoneyRoundedIcon />}
        sx={{
          border: "1px solid #484848",
        }}
      >
        ver financeiro
      </Button>

      <Modal
        onClose={modal.onClose}
        open={modal.open}
        titulo={modal.titulo}
        backAction={modal.backAction}
        component="view"
        fullScreen="all"
        maxWidth="lg"
        loading={modal.loading}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="h6">Receita Gerada</Typography>
            <Typography variant="body1" color="primary">
              R$ {dados.receita.toFixed(2)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            {" "}
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Estoque Movimentado</Typography>
            <Rows
              items={dados.estoque.map((item) => ({
                titulo: item.produto,
                subtitulo: `Quantidade: ${item.quantidade}`,
                icon: <InventoryIcon color="primary" />,
              }))}
              disableTouchRipple={true}
              oneTapMode={true}
            />{" "}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {" "}
            <Typography variant="h6">Histórico de Vendas</Typography>
            <Rows
              items={dados.vendas.map((venda) => ({
                titulo: `Cliente: ${venda.cliente}`,
                subtitulo: `Valor: R$ ${venda.valor.toFixed(2)} - Data: ${
                  venda.data
                }`,
                icon: <ShoppingCartIcon color="success" />,
              }))}
              disableTouchRipple={true}
              oneTapMode={true}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {" "}
            <Typography variant="h6">Últimos Serviços</Typography>
            <Rows
              items={dados.servicos.map((servico) => ({
                titulo: `Serviço: ${servico.nome}`,
                subtitulo: `Profissional: ${servico.profissional} - Data: ${servico.data}`,
                icon: <BuildIcon color="secondary" />,
              }))}
              disableTouchRipple={true}
              oneTapMode={true}
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalRelatorio;
