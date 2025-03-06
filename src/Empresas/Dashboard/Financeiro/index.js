import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputBase,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Api from "../../../Componentes/Api/axios";

const dadosMock = {
  receita: 12500.75,
  estoque: [
    { id: 1, produto: "Shampoo", quantidade: 15 },
    { id: 2, produto: "Cera Modeladora", quantidade: 8 },
    { id: 3, produto: "Navalha Profissional", quantidade: 5 },
  ],
  vendas: [
    { id: 4, cliente: "João Silva", valor: 120.5, data: "10/02/2025" },
    { id: 5, cliente: "Maria Souza", valor: 85.0, data: "12/02/2025" },
    { id: 6, cliente: "Carlos Mendes", valor: 200.75, data: "15/02/2025" },
  ],
};

const ModalRelatorio = ({ barbearia, alertCustom, financas }) => {
  const hoje = new Date();
  const [mesReferencia, setMesReferencia] = useState(new Date());
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();

  const handleGet = async () => {
    try {
      const data = await Api.query(
        "GET",
        `/establishment/financial/${barbearia.id}`
      );
      setDados(dadosMock);
    } catch (error) {
      alertCustom("Erro ao buscar balanço financeiro!");
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  const colunas = [
    {
      field: "produto",
      headerName: "Produto/Cliente",
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "quantidade",
      headerName: "Quantidade/Valor",
      flex: 1,
      renderCell: (params) =>
        params.row.quantidade ?? `R$ ${params.row.valor.toFixed(2)}`,
      headerClassName: "custom-header",
    },
    {
      field: "data",
      headerName: "Data",
      flex: 1,
      hide: (row) => !row.data,
      headerClassName: "custom-header",
    },
  ];

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
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{ padding: 2, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Receita Mensal
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span>{`R$ ${financas?.approved.valor.toFixed(2)}`}</span>
                  <ArrowUpwardIcon fontSize="10" color="success" />
                  <FormControl variant="outlined" sx={{ marginLeft: "auto" }}>
                    <Select
                      value={`${mesReferencia.getMonth()}-${mesReferencia.getFullYear()}`}
                      onChange={(event) => {
                        const [selectedMonth, selectedYear] = event.target.value
                          .split("-")
                          .map(Number);
                        const selectedDate = new Date(
                          selectedYear,
                          selectedMonth + 1,
                          0
                        );
                        setMesReferencia(
                          selectedDate.getMonth() === new Date().getMonth()
                            ? new Date()
                            : selectedDate
                        );
                      }}
                      input={<InputBase />}
                    >
                      {[...Array(6)].map((_, index) => {
                        const monthDate = new Date();
                        monthDate.setMonth(new Date().getMonth() - index, 1);
                        const monthAbbreviation = monthDate.toLocaleString(
                          "default",
                          { month: "short" }
                        );
                        return (
                          <MenuItem
                            key={index}
                            value={`${monthDate.getMonth()}-${monthDate.getFullYear()}`}
                          >
                            {`${monthAbbreviation
                              .toUpperCase()
                              .replace(".", "")} ${monthDate.getFullYear()}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <Typography variant="body2" color="textSecondary">
                  {`+ ${financas?.totalDiario.valor.toFixed(
                    2
                  )} acumulados hoje`}
                </Typography>
                <Typography variant="body2">{`R$ ${(
                  financas?.pending.valor ?? 0
                ).toFixed(2)} pendentes`}</Typography>
                <Typography variant="body2">{`R$ ${(
                  financas?.cancelled.valor ?? 0
                ).toFixed(2)} em cancelamentos`}</Typography>
                <Button
                  fullWidth
                  sx={{ marginTop: 1 }}
                  onClick={() => navigate("/dash/volumetria")}
                >
                  Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="h6">Movimentação</Typography>
            <DataGrid
              rows={[]}
              columns={colunas}
              sx={{
                "& .custom-header": {
                  background: "#404040",
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
                background: "#404040",
              }}
              pageSize={5}
              disableSelectionOnClick
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalRelatorio;
