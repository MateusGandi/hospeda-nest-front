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

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import StarIcon from "@mui/icons-material/Star";

import Api from "../../../Componentes/Api/axios";
import CustomTabs from "../../../Componentes/Tabs";
import Modal from "../../../Componentes/Modal";
import { formatCNPJ, getLocalItem } from "../../../Componentes/Funcoes";

import Avaliacoes from "./Movimentacoes/Avaliacoes";
import ListaMovimentacoes from "./Movimentacoes/Geral";
import ListaMovimentacoesFuncionarios from "./Movimentacoes/Funcionarios";
import FornecedoresInfo from "./Movimentacoes/Fornecedores";
import Dividas from "./Dividas";

const ModalRelatorio = ({ barbearia, alertCustom }) => {
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
  const tabs = tabsAccess[getLocalItem("accessType")] || [];
  const [dados, setDados] = useState({
    modalOpen: false,
    tab: tabs[0],
  });
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
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [financas, setFinancas] = useState({
    ganho: 0,
    perda: 0,
    total: 0,
    previsto: 0,
    vendas: [],
  });

  const handleTabChange = (tabId) => {
    setDados((prev) => ({
      ...prev,
      tab: tabs[tabId],
    }));
  };

  const handleGet = async () => {
    try {
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
    }
  };

  useEffect(() => {
    if (dados.modalOpen) handleGet();
  }, [dados.modalOpen]);

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
        Financeiro
      </Button>

      <Modal
        onClose={() => setDados({ ...dados, modalOpen: false })}
        open={dados.modalOpen}
        titulo="Financeiro"
        fullScreen="all"
        maxWidth="md"
        disablePadding={true}
        route="financeiro"
        component="view"
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{ mt: "-10px", p: 1 }}
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
                      src={`https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`}
                    >
                      {barbearia.nome[0].toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6">{getLocalItem("nome")}</Typography>
                  }
                  subheader={
                    <Typography variant="body2" sx={{ mt: -0.5 }}>
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
                <Typography variant="h5">
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
      </Modal>
    </>
  );
};

export default ModalRelatorio;
