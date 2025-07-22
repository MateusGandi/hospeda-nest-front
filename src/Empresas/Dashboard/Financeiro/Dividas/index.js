import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid2 as Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SwipeIndicaton from "../../../../Componentes/Motion/Helpers/swipeIndicator";
import { data, useNavigate } from "react-router-dom";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { Rows } from "../../../../Componentes/Lista/Rows";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import { toUTC } from "../../../../Componentes/Funcoes";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Modal from "../../../../Componentes/Modal";
import Banner from "../../../../Assets/Cobranca/cobranca_banner.png";
import EditableTable from "../../../../Componentes/Table";
import CustomDateInput from "../../../../Componentes/Custom";
import Icon from "../../../../Assets/Emojis";

const contasMock = [
  {
    id: 1,
    nome: "Conta Luz",
    valor: 150.5,
    juros: 0,
    atraso: 0,
    vencimento: "2025-07-10",
    status: "Pendente",
  },
  {
    id: 2,
    nome: "Conta Água",
    valor: 80,
    juros: 2.5,
    atraso: 3,
    vencimento: "2025-07-08",
    status: "Atrasada",
  },
  {
    id: 3,
    nome: "Internet",
    valor: 120,
    juros: 0,
    atraso: 0,
    vencimento: "2025-07-12",
    status: "Pendente",
  },
  {
    id: 4,
    nome: "Telefone",
    valor: 60,
    juros: 1,
    atraso: 1,
    vencimento: "2025-07-09",
    status: "Pago",
  },
  {
    id: 5,
    nome: "Telefone",
    valor: 60,
    juros: 1,
    atraso: 1,
    vencimento: "2025-07-09",
    status: "Pago",
  },
  {
    id: 6,
    nome: "Telefone",
    valor: 60,
    juros: 1,
    atraso: 1,
    vencimento: "2025-07-09",
    status: "Atrasada",
  },
];

const chipColors = {
  Pendente: "warning",
  Atrasada: "error",
  Pago: "success",
};

const Dividas = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({ data: new Date(), status: null });
  const navigate = useNavigate();

  const totalPagar = contasMock
    .filter((i) => "Pendente" == i.status)
    .reduce((acc, c) => acc + (c.valor ?? 0) + (c.juros ?? 0), 0);

  const colunas = [
    {
      field: "nome",
      headerName: "Dívida",
      width: 130,
    },
    {
      field: "valor",
      headerName: "Valor",
      width: 110,
      renderCell: (value) => `R$ ${value.valor.toFixed(2)}`,
    },
    {
      field: "juros",
      headerName: "Juros",
      width: 110,
      renderCell: (value) => `R$ ${value.juros.toFixed(2)}`,
    },
    {
      field: "atraso",
      headerName: "Atraso",
      width: 110,
      renderCell: (value) => `${value.atraso} dias`,
    },
    {
      field: "vencimento",
      headerName: "Vencimento",
      width: 160,
      renderCell: (value) => toUTC(new Date(value.vencimento).toISOString()),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => {
        const status = params.status || "Pendente";
        return (
          <Chip
            sx={{ color: "#fff" }}
            label={status}
            color={chipColors[status] || "default"}
            size="small"
          />
        );
      },
    },
    {
      field: "pagar",
      headerName: "Ação",
      width: 100,
      renderCell: (params) => (
        <Button
          fullWidth
          variant="text"
          size="small"
          disabled={!["Pendente", "Atrasada"].includes(params.status)}
          onClick={() => navigate(`/checkout/${params.id}`)}
        >
          Pagar
        </Button>
      ),
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: 2,
      }}
    >
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: { xs: "center", md: "start" },
          justifyContent: "start",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {" "}
        <Paper
          elevation={0}
          sx={{ p: 2, width: { xs: "100%", md: "300px" }, background: "none" }}
        >
          <Typography variant="body2">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: "#00FF2F",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span style={{ color: "#fff" }}> Cerca de </span>
              R$ {totalPagar.toFixed(2)}{" "}
              <ArrowUpwardRoundedIcon fontSize="small" />{" "}
              <span style={{ color: "#fff" }}> pendentes</span>
            </Typography>
            {`Total de ${contasMock.length} dívidas em aberto`}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Rows
          oneTapMode={true}
          items={contasMock.slice(0, 3).map((item) => ({
            action: () => setOpen(true),
            icon: <DiscountRoundedIcon />,
            titulo: (
              <Typography
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span> {item.nome}</span>
                <span> {toUTC(new Date(item.vencimento).toISOString())}</span>
              </Typography>
            ),
            subtitulo: `R$ ${item.valor.toFixed(2)}`,
          }))}
        />
      </Grid>

      <Modal
        fullScreen="all"
        component="view"
        open={open}
        onClose={() => setOpen(false)}
        titulo={"Gestão de Dívidas"}
        maxWidth="lg"
        alignItems="center"
      >
        <Grid container spacing={2}>
          {" "}
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              position: "relative",
            }}
          >
            <Typography
              variant="body1"
              sx={{ position: "absolute", top: 0, left: 0, zIndex: 1, p: 2 }}
            >
              <Typography variant="h6">Gestão de contas</Typography>A listagem
              de contas permite que você visualize e gerencie dívidas pendentes,
              tudo de forma simplificada.
            </Typography>
            <img
              src={Banner}
              alt="Placeholder"
              style={{ width: "100%", borderRadius: "16px" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", flexWrap: "wrap", justifyContent: "end" }}
            >
              <Grid size={{ xs: 8, md: 3 }} sx={{ mt: 3 }}>
                {" "}
                <CustomDateInput
                  value={filter.data}
                  onChange={(data, valid) =>
                    valid && setFilter((prev) => ({ ...prev, data }))
                  }
                  label="Filtrar por data"
                />
              </Grid>
              <Grid size={12}>
                {" "}
                <SwipeIndicaton>
                  <EditableTable
                    columns={colunas}
                    rows={contasMock}
                    onChange={(e) => console.log(e)}
                  />
                </SwipeIndicaton>
              </Grid>{" "}
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default Dividas;
