import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid2 as Grid,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import SearchBarWithFilters from "../../../../Componentes/Search";
import { PaperList } from "../../../../Componentes/Lista/Paper";
import apiService from "../../../../Componentes/Api/axios";
import {
  getLocalItem,
  getStatus,
  toUTC,
} from "../../../../Componentes/Funcoes";
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import CustomDateInput from "../../../../Componentes/Custom";
import Modal from "../../../../Componentes/Modal";

const ListaMovimentacoes = ({ buscar, alertCustom }) => {
  const [dados, _setDados] = useState({
    funcionarios: [],
    vendas: [],
    vendasFiltradas: [],
    search: "",
    page: 1,
    pageSize: 10,
    data: new Date(),
    loading: true,
  });

  const [details, _setDetails] = useState({
    open: false,
    funcionario: null,
    loading: false,
    page: 1,
    pageSize: 10,
  });

  const [modalDetalhe, setModalDetalhe] = useState({
    open: false,
    movimentacao: null,
  });

  const setDados = (campo, valor) =>
    _setDados((prev) => ({ ...prev, [campo]: valor }));

  const setDetails = (campo, valor) =>
    _setDetails((prev) => ({ ...prev, [campo]: valor }));

  const fetchFuncionarios = async () => {
    try {
      setDados("loading", true);
      const { funcionarios } = await apiService.query(
        "GET",
        `/establishment?establishmentId=${getLocalItem("establishmentId")}`
      );

      setDados(
        "funcionarios",
        funcionarios.map((item) => ({
          ...item,
          image: item.foto
            ? `https://srv744360.hstgr.cloud/tonsus/api/images/user/${item.id}/${item.foto}`
            : null,
          titulo: `${item.nome} - ${item.telefone}`,
          subtitulo: (
            <Typography
              variant="body1"
              className="show-link"
              onClick={() => {
                setDetails("funcionario", item);
                setDetails("open", true);
              }}
              sx={{ cursor: "pointer", color: "#1976d2" }}
            >
              Ver Movimentações
            </Typography>
          ),
        }))
      );
    } catch (error) {
      alertCustom("Erro ao buscar funcionários!");
    } finally {
      setDados("loading", false);
    }
  };

  const fetchVendasFuncionario = async () => {
    if (!details.funcionario) return;
    try {
      setDetails("loading", true);

      const data = await apiService.query(
        "GET",
        buscar["employee"].url_transacoes(
          getLocalItem("userId"),
          dados.data,
          dados.page,
          dados.pageSize
        )
      );

      const vendas = data.map((item) => ({
        valor: item.preco,
        cliente: item.nomeCliente || "Cliente não informado",
        data: toUTC(item.data),
        atendimento: item,
        funcionario: item.atendenteNome,
      }));
      setDados("vendas", vendas);
      setDados("vendasFiltradas", vendas);
    } catch (error) {
      alertCustom("Erro ao buscar movimentações!");
    } finally {
      setDetails("loading", false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    if (details.open && details.funcionario) {
      fetchVendasFuncionario();
    }
  }, [details.open, dados.data]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={12}>
        <PaperList
          variant="contained"
          items={
            dados.funcionarios.length
              ? dados.funcionarios
              : [
                  {
                    titulo: dados.loading
                      ? "Buscando..."
                      : "Nenhuma venda encontrada...",
                    subtitulo: "",
                  },
                ]
          }
        >
          <Typography variant="h6" sx={{ m: "10px 15px", color: "#fff" }}>
            Movimentações dos Funcionários
          </Typography>
        </PaperList>
      </Grid>

      <Modal
        component="view"
        fullScreen="all"
        maxWidth="md"
        titulo={`Movimentações de ${details.funcionario?.nome || ""}`}
        open={details.open}
        onClose={() => {
          setDetails("open", false);
          setDados("data", new Date());
        }}
        buttons={[
          {
            action: () => {
              setDetails("open", false);
              setDados("data", new Date());
            },
            variant: "contained",
            titulo: "Fechar",
          },
        ]}
      >
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomDateInput
              onChange={(v, valid) => {
                if (valid) {
                  setDados("data", format(v, "yyyy-MM-dd"));
                }
              }}
              value={dados.data}
            />
          </Grid>
          <Grid size={{ xs: 0, md: 2 }}></Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SearchBarWithFilters
              initial={dados.vendas}
              elements={dados.vendasFiltradas}
              setElements={(v) => setDados("vendasFiltradas", v)}
              search={dados.search}
              label="Pesquisar venda"
              searchValue={dados.search}
              setSearchValue={(v) => setDados("search", v)}
              fullWidth
            />
          </Grid>

          <Grid size={12}>
            {details.loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <PaperList
                items={
                  dados.vendasFiltradas?.length > 0
                    ? [
                        ...dados.vendasFiltradas.map((venda) => ({
                          titulo: (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="h6">
                                {venda.cliente}
                              </Typography>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontSize: "16px" }}
                                >
                                  {venda.data}
                                </Typography>
                              </Box>
                            </Box>
                          ),
                          subtitulo: (
                            <Typography>
                              R$ ${venda.valor}
                              <Typography
                                className="show-link"
                                onClick={() =>
                                  setModalDetalhe({
                                    open: true,
                                    movimentacao: venda,
                                  })
                                }
                              >
                                Ver Detalhes
                              </Typography>
                            </Typography>
                          ),
                        })),
                        {
                          titulo: (
                            <Box sx={{ textAlign: "center", width: "100%" }}>
                              <Button
                                variant="text"
                                disabled={dados.vendas.length < dados.pageSize}
                                onClick={() =>
                                  dados.vendas.length === dados.pageSize &&
                                  setDados("pageSize", dados.pageSize + 10)
                                }
                              >
                                Carregar mais
                              </Button>
                            </Box>
                          ),
                          subtitulo: "",
                        },
                      ]
                    : [
                        {
                          titulo: dados.loading
                            ? "Buscando..."
                            : "Nenhuma venda encontrada...",
                          subtitulo: "",
                        },
                      ]
                }
              />
            )}

            <Modal
              open={modalDetalhe.open}
              onClose={() =>
                setModalDetalhe((prev) => ({ ...prev, open: false }))
              }
              titulo="Detalhes da Movimentação"
              maxWidth="sm"
              buttons={[
                {
                  titulo: "Fechar",
                  variant: "contained",
                  action: () =>
                    setModalDetalhe((prev) => ({ ...prev, open: false })),
                },
              ]}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}
              >
                <Typography variant="body1">
                  <strong>Cliente:</strong> {modalDetalhe.movimentacao?.cliente}
                </Typography>
                <Typography variant="body1">
                  <strong>Valor:</strong> R$ {modalDetalhe.movimentacao?.valor}
                </Typography>
                <Typography variant="body1">
                  <strong>Data:</strong> {modalDetalhe.movimentacao?.data}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={
                      getStatus(modalDetalhe.movimentacao?.atendimento.status)
                        .valor
                    }
                    color={
                      getStatus(modalDetalhe.movimentacao?.atendimento.status)
                        .color
                    }
                    size="small"
                  />
                </Typography>
                <Typography variant="body1">
                  <strong>Atendente:</strong>{" "}
                  {modalDetalhe.movimentacao?.atendimento.atendenteNome}
                </Typography>
                <Typography variant="body1">
                  <strong>Finalização:</strong>{" "}
                  {toUTC(
                    modalDetalhe.movimentacao?.atendimento.dataFinalizacao
                  )}
                </Typography>
                {modalDetalhe.movimentacao?.atendimento.manual && (
                  <Typography variant="body1">
                    <strong>Inserido Manualmente</strong>
                  </Typography>
                )}
                {modalDetalhe.movimentacao?.atendimento.motivoCancelamento && (
                  <Typography variant="body1">
                    <strong>Cancelado:</strong>{" "}
                    {modalDetalhe.movimentacao.atendimento.motivoCancelamento}
                  </Typography>
                )}
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
};

export default ListaMovimentacoes;
