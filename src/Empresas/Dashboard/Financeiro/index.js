import React, { use, useEffect, useState } from "react";
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
  Box,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import StarIcon from "@mui/icons-material/Star";

import Api from "../../../Componentes/Api/axios";
import CustomTabs from "../../../Componentes/Tabs";
import Modal from "../../../Componentes/Modal/Simple";
import {
  formatCNPJ,
  getLocalItem,
  isMobile,
} from "../../../Componentes/Funcoes";

import Avaliacoes from "./Movimentacoes/Avaliacoes";
import ListaMovimentacoes from "./Movimentacoes/Geral";
import ListaMovimentacoesFuncionarios from "./Movimentacoes/Funcionarios";
import FornecedoresInfo from "./Movimentacoes/Fornecedores";
import Dividas from "./Dividas";

import View from "../../../Componentes/View";
import { useNavigate } from "react-router-dom";

const GestaoFinancas = ({ alertCustom, barbearia }) => {
  const navigate = useNavigate();
  const tabsAccess = {
    adm: [
      { icon: <RequestPageIcon />, label: "Geral", id: 0 },
      { icon: <AttachMoneyRoundedIcon />, label: "Movimentações", id: 1 },
      { icon: <PeopleAltRoundedIcon />, label: "Funcionários", id: 2 },
      { icon: <LocalShippingRoundedIcon />, label: "Fornecedores", id: 3 },
      { icon: <StarIcon />, label: "Avaliações", id: 4 },
    ],
    employee: [
      { icon: <AttachMoneyRoundedIcon />, label: "Movimentações", id: 0 },
      { icon: <StarIcon />, label: "Avaliações", id: 1 },
    ],
  };
  const search = {
    adm: {
      url_financeiro: (id, dt) => `/financial/establishment/${id}?data=${dt}`,
      url_transacoes: (id, dt, p, pz) =>
        `/financial/establishment/transactions/${id}?data=${dt}&pageSize=${pz}&page=${p}`,
    },
    employee: {
      url_financeiro: (id, dt) => `/financial/employee/${id}?data=${dt}`,
      url_transacoes: (id, dt, p, pz) =>
        `/financial/employee/transactions/${id}?data=${dt}&pageSize=${pz}&page=${p}`,
    },
    client: {
      url_financeiro: (id, dt) => `/financial/user/${id}?data=${dt}`,
      url_transacoes: (id, dt, p, pz) =>
        `/financial/user/transactions/${id}?data=${dt}&pageSize=${pz}&page=${p}`,
    },
  };
  const tabs = tabsAccess[getLocalItem("accessType")] || [];
  const [dados, setDados] = useState({
    tab: tabs[0],
    loading: true,
  });
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [financas, setFinancas] = useState({
    ganho: 0,
    perda: 0,
    total: 0,
    previsto: 0,
    vendas: [],
  });
  const setLoading = (loading) => setDados((prev) => ({ ...prev, loading }));

  const onClose = () => navigate("/dashboard");

  const handleTabChange = (tabId) => {
    setDados((prev) => ({
      ...prev,
      tab: tabs[tabId],
    }));
  };

  const handleGet = async () => {
    try {
      setLoading(true);
      const dataAtual = new Date().toISOString().split("T")[0];
      const req = {
        adm: getLocalItem("establishmentId"),
        client: getLocalItem("userId"),
        employee: getLocalItem("userId"),
      };
      const url = search[getLocalItem("accessType")].url_financeiro(
        req[getLocalItem("accessType")],
        dataAtual
      );

      const data = await Api.query("GET", url);
      setFinancas(data);
    } catch (error) {
      alertCustom("Erro ao buscar balanço financeiro!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <>
      {" "}
      {!isMobile ? (
        <View
          onClose={onClose}
          open={true}
          titulo="Financeiro"
          fullScreen="all"
          maxWidth="lg"
          loading={dados.loading}
          route="financeiro"
          component="view"
        >
          {!dados.loading && (
            <Grid
              container
              spacing={1}
              justifyContent="center"
              sx={{ pt: "10px", mx: -1, mt: -1 }}
            >
              <Grid size={12} sx={{ mb: "-75px" }}>
                {barbearia && barbearia.nome && (
                  <Paper
                    elevation={0}
                    sx={{
                      height: "180px",
                      width: "100%",
                      backgroundImage: `url(${`${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/banner/${barbearia.banner}`})`,
                      //background: { xs: "none", lg: "#363636" },
                      position: "relative",
                      borderRadius: { xs: 0, lg: "10px" },
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        background: "none",
                        position: "absolute",
                        top: "15px",
                        ml: { xs: 0, md: "50px" },
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{
                              width: 70,
                              height: 70,
                              fontSize: 30,
                              fontWeight: 600,
                            }}
                            src={`${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                          >
                            {barbearia.nome[0].toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Typography
                            variant="h6"
                            sx={{ textShadow: "0px 0px 10px #000" }}
                          >
                            {getLocalItem("nome")}
                          </Typography>
                        }
                        subheader={
                          <Typography
                            variant="body1"
                            sx={{ mt: -0.5, textShadow: "0px 0px 10px #000" }}
                          >
                            {barbearia.nome}
                          </Typography>
                        }
                      />
                    </Card>
                  </Paper>
                )}
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
                    {" "}
                    <Typography variant="h6">
                      <Typography variant="body1">Total vendas</Typography>

                      {mostrarSaldo
                        ? `R$ ${financas.ganho?.toFixed(2)}`
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
                      {mostrarSaldo ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
                <Card variant="outlined">
                  <CardContent>
                    {" "}
                    <Typography variant="h6">
                      <Typography variant="body1">Movimentado hoje</Typography>

                      {`R$ ${financas.total?.toFixed(2)}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
                <Card variant="outlined">
                  <CardContent>
                    {" "}
                    <Typography variant="h6">
                      <Typography variant="body1">Perdas/Despesas</Typography>

                      {`R$ ${financas.perda?.toFixed(2)}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={11}>
                <CustomTabs
                  selected={dados.tab.id}
                  tabs={tabs}
                  onChange={handleTabChange}
                  views={
                    {
                      adm: [
                        <Dividas alertCustom={alertCustom} />,
                        <ListaMovimentacoes
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <ListaMovimentacoesFuncionarios
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <FornecedoresInfo />,
                        <Avaliacoes
                          alertCustom={alertCustom}
                          barbearia={barbearia}
                        />,
                      ],
                      employee: [
                        <ListaMovimentacoes
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <Avaliacoes
                          alertCustom={alertCustom}
                          barbearia={barbearia}
                        />,
                      ],
                    }[getLocalItem("accessType") || []]
                  }
                />
              </Grid>
            </Grid>
          )}
        </View>
      ) : (
        <Modal
          onClose={onClose}
          open={true}
          titulo="Financeiro"
          fullScreen="all"
          maxWidth="md"
          disablePadding={true}
          loading={dados.loading}
          route="financeiro"
          component="view"
        >
          {!dados.loading && barbearia && (
            <Grid
              container
              spacing={1}
              justifyContent="center"
              sx={{ mt: "-10px" }}
            >
              <Grid size={12} sx={{ mb: "-75px" }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "180px",
                    width: "100%",
                    background: { xs: "none", lg: "#363636" },
                    position: "relative",
                    borderRadius: { xs: 0, lg: "10px" },
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      background: "none",
                      position: "absolute",
                      top: "15px",
                      ml: { xs: 0, md: "50px" },
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            width: 70,
                            height: 70,
                            fontSize: 30,
                            fontWeight: 600,
                          }}
                          src={`${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                        >
                          {barbearia.nome[0].toUpperCase()}
                        </Avatar>
                      }
                      title={
                        <Typography
                          variant="h6"
                          sx={{ textShadow: "0px 0px 10px #000" }}
                        >
                          {getLocalItem("nome")}
                        </Typography>
                      }
                      subheader={
                        <Typography
                          variant="body1"
                          sx={{ mt: -0.5, textShadow: "0px 0px 10px #000" }}
                        >
                          {barbearia.nome} | {formatCNPJ(barbearia.cnpj)}
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
                    {" "}
                    <Typography variant="h6">
                      <Typography variant="body1">Total vendas</Typography>

                      {mostrarSaldo
                        ? `R$ ${financas.ganho?.toFixed(2)}`
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
                      {mostrarSaldo ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
                <Card variant="outlined">
                  <CardContent>
                    {" "}
                    <Typography variant="h6">
                      <Typography variant="body1">Movimentado hoje</Typography>

                      {`R$ ${financas.total?.toFixed(2)}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3.5 }} sx={{ zIndex: 1, m: "0 10px" }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">
                      <Typography variant="body1">Perdas/Despesas</Typography>

                      {`R$ ${financas.perda?.toFixed(2)}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <CustomTabs
                  sx={{ mt: 5 }}
                  selected={dados.tab.id}
                  tabs={tabs}
                  onChange={handleTabChange}
                  views={
                    {
                      adm: [
                        <Dividas />,
                        <ListaMovimentacoes
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <ListaMovimentacoesFuncionarios
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <FornecedoresInfo />,
                        <Avaliacoes
                          alertCustom={alertCustom}
                          barbearia={barbearia}
                        />,
                      ],
                      employee: [
                        <ListaMovimentacoes
                          buscar={search}
                          alertCustom={alertCustom}
                        />,
                        <Avaliacoes
                          alertCustom={alertCustom}
                          barbearia={barbearia}
                        />,
                      ],
                    }[getLocalItem("accessType") || []]
                  }
                />
              </Grid>
            </Grid>
          )}
        </Modal>
      )}
    </>
  );
};

export default GestaoFinancas;
