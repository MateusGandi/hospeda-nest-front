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
  CardActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../Componentes/Api/axios";
import { isMobile, Saudacao } from "../Componentes/Funcoes";
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
    <>
      <Grid size={12}>
        <Card
          sx={{
            top: "15px",
            height: "150px",
            overflow: "visible",
            m: "-16px -16px 60px -16px",
            p: "8px 24px",
            borderRadius: isMobile ? 0 : "10px",
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
              <Typography variant="h6" sx={{ mt: "-8px" }}>
                {usuario.nome}
              </Typography>
            }
            action={<Button color="#fff">Editar</Button>}
          />
          <CardActions
            sx={{
              display: "flex",
              justifyContent: isMobile ? "center" : "left",
            }}
          >
            {" "}
            <Card
              variant="outlined"
              sx={{
                background: "#388E3C",
                minWidth: "350px",
                position: "relative",
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
          </CardActions>
        </Card>
      </Grid>

      <Grid size={12}>
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
    </>
  );
};

export default ModalRelatorio;
