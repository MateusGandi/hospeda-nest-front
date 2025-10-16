import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import SearchBarWithFilters from "../../../../Componentes/Search";
import { PaperList } from "../../../../Componentes/Lista/Paper";
import apiService from "../../../../Componentes/Api/axios";
import {
  getLocalItem,
  getStatus,
  toUTC,
} from "../../../../Componentes/Funcoes";
import { format } from "date-fns";
import CustomDateInput, { LoadingBox } from "../../../../Componentes/Custom";
import Modal from "../../../../Componentes/Modal/Simple";
import { ptBR } from "date-fns/locale";
import { Rows } from "../../../../Componentes/Lista/Rows";

const ListaMovimentacoes = ({ buscar, alertCustom }) => {
  const [dados, _setDados] = useState({
    vendas: [],
    vendasFiltradas: [],
    search: "",
    page: 1,
    pageSize: 10,
    data: toUTC({
      data: new Date().toISOString(),
      onlyDate: true,
      offsetHoras: -3,
    })
      .split("/")
      .reverse()
      .join("-"),
    loading: true,
  });

  const [detalhe, setDetalhe] = useState({
    open: false,
    movimentacao: null,
  });

  const setDados = (campo, info) =>
    _setDados((prev) => ({ ...prev, [campo]: info }));

  const handleGet = async () => {
    try {
      setDados("loading", true);
      const id =
        getLocalItem("accessType") === "adm"
          ? getLocalItem("establishmentId")
          : getLocalItem("userId");

      const data = await apiService.query(
        "GET",
        buscar[getLocalItem("accessType")].url_transacoes(
          id,
          dados.data,
          dados.page,
          dados.pageSize
        )
      );

      const vendas = data.map((item) => ({
        valor: item.preco,
        cliente: item.nomeCliente || "Cliente não informado",
        data: toUTC({ data: item.data }),
        atendimento: item,
        funcionario: item.atendenteNome,
      }));

      setDados("vendas", vendas);
      setDados("vendasFiltradas", vendas);
    } catch (error) {
      console.error(error);
      alertCustom("Erro ao buscar movimentações!");
    } finally {
      setDados("loading", false);
    }
  };

  useEffect(() => {
    handleGet();
  }, [dados.pageSize, dados.data]);

  const abrirDetalhes = (movimentacao) => {
    setDetalhe({ open: true, movimentacao });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid size={{ xs: 12, md: 3 }}>
            <CustomDateInput
              onChange={(v, valid) => {
                valid && setDados("data", format(v, "yyyy-MM-dd"));
              }}
              value={dados.data}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SearchBarWithFilters
              initial={dados.vendas}
              elements={dados.vendasFiltradas}
              setElements={(elements) => setDados("vendasFiltradas", elements)}
              search={dados.search}
              label="Pesquisar vendas"
              searchValue={dados.search}
              fullWidth={true}
              setSearchValue={(value) => setDados("search", value)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        {" "}
        <Typography variant="h6" sx={{ m: "10px 0", color: "#fff" }}>
          Histórico Movimentações
        </Typography>
        <Rows
          oneTapMode
          variant="contained"
          items={
            dados.vendasFiltradas.length > 0
              ? [
                  ...dados.vendasFiltradas.map((venda) => ({
                    ...venda,
                    action: () => abrirDetalhes(venda),
                    titulo: (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="h6">{venda.cliente}</Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 400, gap: 1 }}
                        >
                          Atendido por {venda.funcionario}{" "}
                        </Typography>
                      </Box>
                    ),
                    subtitulo: (
                      <Typography>
                        R$ {venda.valor} em {venda.data}
                        <Typography variant="body1">
                          Clique para ver Detalhes
                        </Typography>{" "}
                      </Typography>
                    ),
                  })),
                ]
              : [
                  {
                    sx: { background: "transparent" },
                    titulo: dados.loading ? (
                      <LoadingBox message="Buscando..." />
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{ width: "100%", textAlign: "center" }}
                      >
                        Nenhuma venda encontrada
                      </Typography>
                    ),
                    disabled: true,
                    subtitulo: "",
                  },
                ]
          }
        />
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Button
            color="secondary"
            variant="text"
            sx={{ my: 2, px: 2 }}
            disabled={dados.vendas.length < dados.pageSize}
            onClick={() =>
              dados.vendas.length === dados.pageSize &&
              setDados("pageSize", dados.pageSize + 10)
            }
          >
            Carregar mais
          </Button>
        </Box>
      </Grid>

      {/* Modal de Detalhes da Movimentação */}
      <Modal
        open={detalhe.open}
        onClose={() => setDetalhe((prev) => ({ ...prev, open: false }))}
        titulo="Detalhes da Movimentação"
        maxWidth="xs"
        buttons={[
          {
            titulo: "Fechar",
            variant: "contained",
            action: () => setDetalhe((prev) => ({ ...prev, open: false })),
          },
        ]}
        loading={detalhe.loading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
          <Typography variant="body1">
            <strong>Cliente:</strong> {detalhe.movimentacao?.cliente}
          </Typography>
          <Typography variant="body1">
            <strong>Valor:</strong> R$ {detalhe.movimentacao?.valor}
          </Typography>
          <Typography variant="body1">
            <strong>Data:</strong> {detalhe.movimentacao?.data}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <Chip
              label={getStatus(detalhe.movimentacao?.atendimento.status).valor}
              color={getStatus(detalhe.movimentacao?.atendimento.status).color}
              size="small"
            />
          </Typography>
          <Typography variant="body1">
            <strong>Atendente:</strong>{" "}
            {detalhe.movimentacao?.atendimento.atendenteNome}
          </Typography>
          <Typography variant="body1">
            <strong>Finalização:</strong>{" "}
            {detalhe.movimentacao?.atendimento.dataFinalizacao
              ? toUTC({
                  data: detalhe.movimentacao?.atendimento.dataFinalizacao,
                })
              : "Não finalizado"}
          </Typography>
          {detalhe.movimentacao?.atendimento.manual && (
            <Typography variant="body1">
              <strong>Inserido Manualmente</strong>
            </Typography>
          )}
          {detalhe.movimentacao?.atendimento.motivoCancelamento && (
            <Typography variant="body1">
              <strong>Cancelado:</strong>{" "}
              {detalhe.movimentacao?.atendimento.motivoCancelamento}
            </Typography>
          )}
        </Box>
      </Modal>
    </Grid>
  );
};

export default ListaMovimentacoes;
