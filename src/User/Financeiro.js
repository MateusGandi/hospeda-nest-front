import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import Modal from "../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../Componentes/Api/axios";
import { isMobile, Saudacao } from "../Componentes/Funcoes";
import SearchBarWithFilters from "../Componentes/Search";
import { PaperList } from "../Componentes/Lista/Paper";

const financasMock = {
  approved: { valor: 12500.75 },
  totalDiario: { valor: 850.0 },
  cancelled: { valor: 780.0 },
  vendas: [
    { id: 1, cliente: "João Silva", valor: 120.5, data: "10/02/2025" },
    { id: 2, cliente: "Maria Souza", valor: 85.0, data: "12/02/2025" },
  ],
};

const ModalRelatorio = ({ usuario, alertCustom, financas = financasMock }) => {
  const [dados, setDados] = useState(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);

  const handleGet = async () => {
    try {
      const data = await Api.query("GET", `/user/financial/${usuario.id}`);
      setDados(financasMock);
    } catch (error) {
      alertCustom("Erro ao buscar histórico financeiro!");
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <Grid container spacing={3} justifyContent={"center"}>
      <Grid size={12} sx={{ mb: "-75px" }}>
        <Paper
          sx={{
            height: "180px",
            width: "100%",
            left: 0,
            position: "relative",
            borderRadius: isMobile ? 0 : "10px",
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: "100%",
              background: "none",
              position: "absolute",
              top: "15px",
              ...(!isMobile ? { ml: "50px" } : {}),
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    width: "50px",
                    height: "50px",
                    fontSize: 30,
                    fontWeight: 600,
                  }}
                >
                  {usuario.nome[0].toUpperCase()}
                </Avatar>
              }
              title={<Typography variant="body1">{Saudacao()}</Typography>}
              subheader={
                <Typography variant="h6" sx={{ marginTop: "-8px" }}>
                  {usuario.nome}
                </Typography>
              }
              action={"oi"}
            />
          </Card>
        </Paper>
      </Grid>

      <Grid
        size={12}
        sx={{
          zIndex: 1,
          m: "0 10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            background: "#388E3C",
            position: "relative",
            minWidth: "350px",
          }}
        >
          <CardContent>
            <Typography variant="h6">Total Cash Back</Typography>
            <Typography variant="h5">
              {mostrarSaldo
                ? `R$ ${financas.approved.valor.toFixed(2)}`
                : "******"}
            </Typography>
            <IconButton
              onClick={() => setMostrarSaldo(!mostrarSaldo)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "#fff",
              }}
            >
              {mostrarSaldo ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ m: "0 10px" }}>
        <PaperList
          items={financas.vendas.map((venda) => ({
            ...venda,
            titulo: venda.cliente,
            subtitulo: `R$ ${venda.valor.toFixed(2)} em ${venda.data}`,
          }))}
        >
          {" "}
          <Typography variant="body1" sx={{ m: "10px 15px", fontWeight: 600 }}>
            Últimas Movimentações
          </Typography>{" "}
        </PaperList>
      </Grid>
    </Grid>
  );
};

export default ModalRelatorio;
