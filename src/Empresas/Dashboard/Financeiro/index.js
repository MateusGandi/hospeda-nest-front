import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { format } from "date-fns";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../../../Componentes/Api/axios";
import {
  formatarHorario,
  formatCNPJ,
  getLocalItem,
  isMobile,
  Saudacao,
} from "../../../Componentes/Funcoes";
import SearchBarWithFilters from "../../../Componentes/Search";
import { PaperList } from "../../../Componentes/Lista/Paper";

const ModalRelatorio = ({ barbearia, alertCustom }) => {
  const [dados, setDados] = useState(null);
  const [search, setSearch] = useState("");
  const [vendasFiltradas, setVendasFiltradas] = useState([]);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [financas, setFinancas] = useState({
    ganho: 0,
    perda: 0,
    total: 0,
    previsto: 0,
    vendas: [],
  });
  const [pageSize, setPageSize] = useState(5);

  const handleGet = async () => {
    try {
      let url = "";
      const dataAtual = new Date().toISOString().split("T")[0];
      const userId = getLocalItem("userId");
      if (getLocalItem("accessType") == "adm") {
        url = `/financial/establishment/${userId}?data=${dataAtual}`;
      } else {
        url = `/financial/employee/${userId}?data=${dataAtual}`;
      }
      const data = await Api.query("GET", url);

      setFinancas({ ...data, vendas: [] });
    } catch (error) {
      alertCustom("Erro ao buscar balanço financeiro!");
    }
  };

  useEffect(() => {
    dados?.modalOpen && handleGet();
  }, [dados?.modalOpen]);

  useEffect(() => {
    const buscar = async () => {
      const dataAtual = new Date().toISOString().split("T")[0];
      await Api.query(
        "GET",
        `/financial/establishment/transactions/${getLocalItem(
          "establishmentId"
        )}?data=${dataAtual}&pageSize=${pageSize}&page=1`
      )
        .then((data) => {
          const vendas = data.map((item) => ({
            valor: item.preco,
            cliente: item.nomeCliente || "Cliente não informado",
            data: format(item.data, "dd/MM/yyyy' às 'HH:mm"),
            atendimento: item,
            funcionario: item.atendenteNome,
          }));

          // setVendasFiltradas(vendas);
          setFinancas((prev) => ({ ...prev, vendas: vendas }));
        })
        .catch((error) => alertCustom("Erro ao buscar vendas!"));
    };

    buscar();
  }, [pageSize]);

  useEffect(() => {
    // Ajusta a paginação baseado no número de itens filtrados
    if (search) {
      if (vendasFiltradas.length < 5) {
        setPageSize(5);
      } else if (vendasFiltradas.length > 10) {
        setPageSize(10);
      } else {
        setPageSize(vendasFiltradas.length);
      }
    } else {
      setPageSize(5);
    }
  }, [search]);

  return (
    <>
      <Button
        color="secondary"
        disableElevation
        onClick={() => setDados({ ...dados, modalOpen: true })}
        variant="outlined"
        size="large"
        fullWidth
        startIcon={<AttachMoneyRoundedIcon />}
        sx={{
          border: "1.5px solid rgba(256, 256, 256, 0.2)",
        }}
      >
        Ver Financeiro
      </Button>

      <Modal
        onClose={() => setDados({ ...dados, modalOpen: false })}
        open={dados?.modalOpen}
        titulo="Financeiro"
        fullScreen="all"
        maxWidth="md"
        disablePadding={true}
        route="financeiro"
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
                        width: "50px",
                        height: "50px",
                        fontSize: 30,
                        fontWeight: 600,
                      }}
                      src={`https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                    >
                      {barbearia.nome[0].toUpperCase()}
                    </Avatar>
                  }
                  title={<Typography variant="h6">{barbearia.nome}</Typography>}
                  subheader={
                    <Typography variant="body2" sx={{ mt: -0.5 }}>
                      CNPJ {formatCNPJ(barbearia.cnpj)}
                    </Typography>
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
                  {mostrarSaldo ? `R$ ${financas.ganho?.toFixed(2)}` : "******"}
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
                  {`R$ ${financas.total?.toFixed(2)}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Perdas/Despesas</Typography>
                <Typography variant="h5">{`R$ ${financas.perda?.toFixed(
                  2
                )}`}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={12}
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
              items={
                vendasFiltradas && vendasFiltradas.length > 0
                  ? vendasFiltradas.map((venda) => ({
                      ...venda,
                      titulo: venda.cliente,
                      subtitulo: `R$ ${venda.valor} em ${venda.data}`,
                    }))
                  : [
                      {
                        titulo: "Nenhuma venda encontrada...",
                        subtitulo: "",
                      },
                    ]
              }
            >
              <Typography
                variant="body1"
                sx={{ m: "10px 15px", fontWeight: 600 }}
              >
                Últimas Movimentações
              </Typography>
            </PaperList>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalRelatorio;
