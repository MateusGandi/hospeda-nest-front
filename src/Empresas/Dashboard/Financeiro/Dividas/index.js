import React, { useEffect, useState } from "react";
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
import { getLocalItem, toUTC } from "../../../../Componentes/Funcoes";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Modal from "../../../../Componentes/Modal/Simple";
import Banner from "../../../../Assets/Cobranca/cobranca_banner.png";
import EditableTable from "../../../../Componentes/Table";
import CustomDateInput, { LoadingBox } from "../../../../Componentes/Custom";
import BannerFind from "../../../../Assets/Cobranca/find_banner.png";
import apiService from "../../../../Componentes/Api/axios";

const chipColors = {
  PENDING: "warning",
  OK: "success",
  OVERDUE: "inherit",
};

const Dividas = ({ alertCustom }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    data: new Date(),
    status: null,
  });
  const [content, _setContent] = useState({
    loading: true,
    transacoes: [],
    total: 0,
  });

  const setContent = (value) => _setContent((prev) => ({ ...prev, ...value }));

  const handleGetData = async () => {
    setContent({ loading: true });
    try {
      const data = await apiService.query(
        "GET",
        `/payment/pending-payment/${getLocalItem("establishmentId")}`
      );

      const transacoes_pendentes = data.filter(
        ({ status }) => status == "PENDING"
      );
      const total = transacoes_pendentes
        .filter(({ status }) => status == "PENDING")
        .reduce((acc, item) => acc + parseFloat(item.precoSemTaxa || 0), 0);

      const transacoes = data.map((item) => {
        const vencimento = item.dataCreated
          ? new Date(item.dataCreated)
          : new Date();
        return {
          id: item.checkoutId ?? item.id ?? item.hiredPlan.id,
          nome: item.description || "Não informado",
          valor: parseFloat(item.precoSemTaxa || 0),
          juros: 0,
          atraso: 0,
          vencimento,
          status: item.status,
        };
      });

      setContent({
        transacoes,
        total,
        dividas_titulo:
          total > 0
            ? `Total de R$ ${total.toFixed(2)} pendentes`
            : "Nenhuma conta a pagar",
        dividas_subtitulo:
          total > 0
            ? `Constam ${transacoes_pendentes.length} dívidas em aberto`
            : "Você não possui dívidas em aberto",
      });
    } catch (error) {
      console.error(error);
      setContent({ transacoes: [], total: 0 });
    } finally {
      setContent({ loading: false });
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

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
          disabled={!["PENDING", "OVERDUE"].includes(params.status)}
          onClick={() => navigate(`/checkout/${params.id}`)}
        >
          Pagar
        </Button>
      ),
    },
  ];

  return (
    <Grid container spacing={1}>
      <Grid
        size={{ xs: 12, md: 4.5 }}
        sx={{
          display: "flex",
          alignItems: { xs: "center", md: "start" },
          justifyContent: "start",
          flexDirection: "column",
          gap: 1,
          flex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            width: "100%",
            minHeight: "120px",
            backgroundImage: `url(${BannerFind})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          <Typography variant="body2">
            <Typography
              component="span"
              variant="body1"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#fff",
              }}
            >
              {content.dividas_titulo}
            </Typography>
            {content.dividas_subtitulo}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 2.5 }}></Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        {content.loading ? (
          <LoadingBox message="Carregando..." />
        ) : content.transacoes.length ? (
          <Rows
            oneTapMode={true}
            items={content.transacoes.slice(0, 3).map((item) => ({
              action: () => setOpen(true),
              icon: <DiscountRoundedIcon />,
              titulo: (
                <Typography
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{item.nome}</span>
                </Typography>
              ),
              subtitulo: (
                <Typography
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{`R$ ${item.valor.toFixed(2)}`}</span>
                  <span>{toUTC(new Date(item.vencimento).toISOString())}</span>
                </Typography>
              ),
            }))}
          />
        ) : null}
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
                <CustomDateInput
                  value={filter.data}
                  onChange={(data, valid) =>
                    valid && setFilter((prev) => ({ ...prev, data }))
                  }
                  label="Filtrar por data"
                />
              </Grid>
              <Grid size={12}>
                <SwipeIndicaton>
                  <EditableTable
                    columns={colunas}
                    rows={content.transacoes}
                    onChange={(e) => console.log(e)}
                  />
                </SwipeIndicaton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default Dividas;
