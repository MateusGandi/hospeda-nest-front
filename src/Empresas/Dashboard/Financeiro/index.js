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
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../../../Componentes/Api/axios";
import { isMobile, Saudacao } from "../../../Componentes/Funcoes";
import SearchBarWithFilters from "../../../Componentes/Search";
import { PaperList } from "../../../Componentes/Lista/Paper";

const financasMock = {
  approved: { valor: 12500.75 },
  totalDiario: { valor: 850.0 },
  cancelled: { valor: 780.0 },
  vendas: [
    { id: 1, cliente: "João Silva", valor: 120.5, data: "10/02/2025" },
    { id: 2, cliente: "Maria Souza", valor: 85.0, data: "12/02/2025" },
  ],
};

const ModalRelatorio = ({
  barbearia,
  alertCustom,
  financas = financasMock,
}) => {
  const [dados, setDados] = useState(null);
  const [search, setSearch] = useState("");
  const [vendasFiltradas, setVendasFiltradas] = useState([]);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);

  const handleGet = async () => {
    try {
      const data = await Api.query(
        "GET",
        `/establishment/financial/${barbearia.id}`
      );
      setDados(financasMock);
    } catch (error) {
      alertCustom("Erro ao buscar balanço financeiro!");
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <>
      <Button
        color="warning"
        disableElevation
        onClick={() => setDados({ ...dados, modalOpen: true })}
        variant="outlined"
        fullWidth
        startIcon={<AttachMoneyRoundedIcon />}
        sx={{ border: "1px solid rgba(256, 256, 256, 0.2)" }}
      >
        Ver Financeiro
      </Button>

      <Modal
        onClose={() => setDados({ ...dados, modalOpen: false })}
        open={dados?.modalOpen}
        titulo="Financeiro"
        fullScreen="all"
        maxWidth="lg"
        disablePadding={true}
      >
        <Grid
          container
          spacing={1}
          justifyContent={"center"}
          sx={{
            mt: "-10px",
          }}
        >
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
                      src={`${String(process.env.REACT_APP_BACK_TONSUS).replace(
                        /"/g,
                        ""
                      )}/images/establishment/${barbearia.id}/profile/${
                        barbearia.profile
                      }`}
                    >
                      {barbearia.nome[0].toUpperCase()}
                    </Avatar>
                  }
                  title={<Typography variant="body1">{Saudacao()}</Typography>}
                  subheader={
                    <>
                      <Typography variant="h6">{barbearia.nome}</Typography>
                      <Typography variant="body2" sx={{ mt: -0.5 }}>
                        CNPJ: 12.345.678/0001-95
                      </Typography>
                    </>
                  }
                />
              </Card>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
            <Card
              variant="outlined"
              sx={{
                background: "#388E3C",
                position: "relative",
              }}
            >
              <CardContent>
                <Typography variant="h6">Saldo Geral</Typography>
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

          <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Movimentado hoje</Typography>
                <Typography variant="h5">
                  {`R$ ${financas.totalDiario.valor.toFixed(2)}`}{" "}
                  <ArrowUpwardIcon fontSize="small" color="success" />
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Perdas/Despesas</Typography>
                <Typography variant="h5">{`R$ ${financas.cancelled.valor.toFixed(
                  2
                )}`}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, md: 12 }}
            sx={{
              m: "0 10px",
              mt: "30px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "end",
            }}
          >
            <SearchBarWithFilters
              initial={financas.vendas}
              elements={vendasFiltradas}
              setElements={setVendasFiltradas}
              label="Pesquisar vendas"
              searchValue={search}
              setSearchValue={setSearch}
              fullWidth={false}
            />
          </Grid>
          <Grid size={12} sx={{ m: "0 10px" }}>
            <PaperList
              items={vendasFiltradas.map((venda) => ({
                ...venda,
                titulo: venda.cliente,
                subtitulo: `R$ ${venda.valor.toFixed(2)} em ${venda.data}`,
              }))}
            >
              {" "}
              <Typography
                variant="body1"
                sx={{ m: "10px 15px", fontWeight: 600 }}
              >
                Últimas Movimentações
              </Typography>{" "}
            </PaperList>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalRelatorio;
