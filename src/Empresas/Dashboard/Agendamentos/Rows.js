import React, { use, useEffect, useState } from "react";
import { Chip, Grid2 as Grid, IconButton, Typography } from "@mui/material";

import { format } from "date-fns";
import {
  formatarHorario,
  formatDataToString,
  getLocalItem,
  getStatus,
  primeiraMaiuscula,
  toUTC,
} from "../../../Componentes/Funcoes";

import Modal from "../../../Componentes/Modal/Simple";
import Api from "../../../Componentes/Api/axios";
import { Rows } from "../../../Componentes/Lista/Rows";
import Calendario from "../../../Componentes/Calendar/Simple";
import Reagendamento from "./Reschedule";
import apiService from "../../../Componentes/Api/axios";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import Icon from "../../../Assets/Emojis";
import { PaperList } from "../../../Componentes/Lista/Paper";
import Filter from "../../../Componentes/Filter";
import { useNavigate } from "react-router-dom";
import Confirm from "../../../Componentes/Alert/Confirm";
import { Add } from "@mui/icons-material";
import { CustomSelect } from "../../../Componentes/Custom";

const FILTER = {
  "": "Todos",
  PENDING: "Agendados",
  NOT_ATTEND: "Não Compareceu",
  CANCELLED: "Cancelados",
  OK: "Concluídos",
};
const STATUS = {
  reschedule: "reagendamento",
  cancel: "cancelamento",
  report: "reporte",
  confirm: "confirmação",
};

const Agendamentos = ({ alertCustom, data, setData }) => {
  const navigate = useNavigate();
  const [filter, _setFilter] = useState({
    status: { titulo: "Agendados", id: 1, valor: "PENDING" },
    data_selecionada: null,
    calendario: {
      open: false,
    },
  });
  const [modal, _setModal] = useState({
    open: false,
    agendamento_selecionado: null,
    agendamentos: [],
    confirmacao: {
      open: false,
      loading: false,
      action: null,
      title: "",
      message: "",
    },
  });
  const [reagendamento, _setReagendamento] = useState({
    open: false,
    agendamento_selecionado: null,
    data_selecionada: null,
  });
  const setReagendamento = (d) => _setReagendamento((p) => ({ ...p, ...d }));
  const setFilter = (d) => _setFilter((p) => ({ ...p, ...d }));
  const setModal = (d) => _setModal((p) => ({ ...p, ...d }));

  useEffect(() => {
    const data = new Date();
    data.setHours(data.getHours() - 3);

    setFilter({ data_selecionada: data.toISOString() });
  }, []);

  const buscarAgendamentos = async () => {
    try {
      if (!filter.data_selecionada) return;
      const { data_selecionada, status } = filter;
      const dataFormatted = toUTC({
        data: data_selecionada,
        onlyDate: true,
        format: "en",
      });
      const userId = data.funcionarioId || getLocalItem("userId");

      const agendamentos = await apiService.query(
        "GET",
        `/scheduling/employee/scheduleds/${userId}/${dataFormatted}${
          status.valor ? `?status=${status.valor}` : ""
        }`
      );

      const agendas = agendamentos.map((item) => {
        const data = new Date(item.data);
        data.setHours(data.getHours() + 3);

        const dataFinalizacao = new Date(item.dataFinalizacao);
        dataFinalizacao.setHours(dataFinalizacao.getHours() + 3);

        return {
          ...item,
          data,
          dataFinalizacao,
        };
      });

      const agFormatted = agendas
        .slice() // para não mutar o array original
        .sort((a, b) => new Date(a.data) - new Date(b.data)) // menor para maior
        .map((item) => {
          const status = getStatus(item.status);
          return {
            ...item,
            servico: item.servico.map((service) => ({
              ...service,
              titulo: `${service.nome} | R$ ${service.preco}`,
              subtitulo: formatarHorario(service.tempoGasto),
            })),
            imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.funcionario.id}/${item.funcionario.foto}`,
            titulo: (
              <Typography
                variant="h6"
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <span className="show-art">
                    {" "}
                    {format(item.data, "HH:mm")}
                  </span>
                  {item.nomeCliente || "Desconhecido"}
                </span>
                <span>
                  {status.manual && <Chip size="small" label={"Manual"} />}
                  <Chip
                    size="small"
                    label={status.valor}
                    color={status.color}
                  />
                </span>
              </Typography>
            ),
            subtitulo: (
              <Typography variant="body2" sx={{ display: "flex", gap: 1 }}>
                {format(
                  new Date(item.dataFinalizacao),
                  "'Previsão de finalização até ' HH:mm ' horas'"
                )}
              </Typography>
            ),
          };
        });

      setModal({
        agendamentos: agFormatted,
      });
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    }
  };

  const buttons = [
    {
      titulo: "Confirmar",
      variant: "contained",
      color: "primary",
      route: "confirm",
      status: "OK",
      action: () => handleAction("confirm"),
    },
    {
      titulo: "Reagendar",
      color: "terciary",
      route: "reschedule",
      status: "PENDING",
      action: () =>
        setReagendamento({
          open: true,
          agendamento_selecionado: modal.agendamento_selecionado,
        }),
    },

    {
      titulo: "Não compareceu",
      color: "terciary",
      route: "report",
      status: "NOT_ATTEND",
      action: () => handleAction("report"),
    },
    {
      titulo: "Cancelar",
      color: "error",
      route: "cancelled",
      status: "CANCELLED",
      action: () => handleAction("cancel"),
    },
  ];

  useEffect(() => {
    buscarAgendamentos();
  }, [filter]);

  const handleAction = async (acao) => {
    setModal({
      confirmacao: {
        open: true,
        action: async () => await handleConfirm(acao),
        title: "Confirmação",
        message: `Você tem certeza que deseja realizar o(a) ${STATUS[acao]} deste agendamento?`,
      },
    });
  };

  const handleConfirm = async (acao) => {
    try {
      if (!modal.agendamento_selecionado) return;

      setModal({ confirmacao: { ...modal.confirmacao, loading: true } });

      await Api.query(
        "PATCH",
        `/scheduling/${acao}/${modal.agendamento_selecionado.id}`,
        modal.agendamento_selecionado
      );
      alertCustom(`${primeiraMaiuscula(STATUS[acao])} realizado com sucesso!`);
      setModal({
        open: false,
      });
      buscarAgendamentos();
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar ${STATUS[acao]}!`
      );
    } finally {
      setModal({
        confirmacao: { ...modal.confirmacao, open: false, loading: false },
      });
    }
  };

  const handleReeschedule = async () => {
    try {
      if (
        !reagendamento.agendamento_selecionado ||
        !reagendamento.data_selecionada
      )
        return;
      const { funcionario, servico: servicos } =
        reagendamento.agendamento_selecionado;
      await Api.query(
        "PUT",
        `/scheduling/${reagendamento.agendamento_selecionado.id}`,
        {
          data: new Date(reagendamento.data_selecionada.id).toISOString(),
          establishmentId: getLocalItem("establishmentId"),
          barberId: funcionario.id,
          services: servicos.map((s) => s.id),
          status: "PENDING",
          // ...(discount
          //   ? { discountId: discount.id, discountValue: discount.value }
          //   : {}),
        }
      );
      alertCustom(`Reagendamento realizado com sucesso!`);
      setReagendamento({
        open: false,
        agendamento_selecionado: null,
        data_selecionada: null,
      });
      setModal({ open: false });

      buscarAgendamentos();
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar Reagendamento!`
      );
    }
  };

  const onClose = () => {
    navigate("/dashboard");
  };

  const getDescription = () => {
    if (!modal.agendamento_selecionado) return [];
    const {
      servico: servicos,
      funcionario,
      ...agendamento
    } = modal.agendamento_selecionado;
    return [
      ...servicos.map((service) => ({
        titulo: service.nome,
        subtitulo: `R$ ${service.preco} | ${formatarHorario(
          service.tempoGasto
        )}`,
      })),
      ...(agendamento.motivoCancelamento && {
        titulo: "Motivo do cancelamento",
        subtitulo: agendamento.motivoCancelamento,
      }),
    ];
  };

  return (
    <Modal
      open
      onClose={onClose}
      titulo="Agendamentos"
      fullScreen="all"
      maxWidth="sm"
    >
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <CustomSelect
            value={data.funcionarioId}
            onChange={({ target: { value } }) => {
              setData({ funcionarioId: value });
            }}
            options={data.options}
            label="Funcionário"
            placeholder="Selecione o funcionário"
            sx={{
              width: { xs: "100%", md: "300px" },
              borderRadius: "50px",
            }}
          />
        </Grid>
        <Grid
          item
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <span>{formatDataToString(filter.data_selecionada)}</span>
          </Typography>
          <span>
            <IconButton
              onClick={() => navigate("/dashboard/agendamento/cliente")}
            >
              <Add />
            </IconButton>

            <Filter
              title="Filtrar por"
              options={FILTER}
              filter={filter.status}
              setFilter={(s) => setFilter({ status: s })}
            />
            <IconButton
              onClick={() => setFilter({ calendario: { open: true } })}
            >
              <InsertInvitationRoundedIcon />
            </IconButton>
          </span>
        </Grid>
        <Grid item size={{ xs: 12 }}>
          {modal.agendamentos.length ? (
            <Rows
              items={modal.agendamentos}
              onSelect={(item) => {
                setModal({
                  agendamento_selecionado: item,
                  open: true,
                });
              }}
              oneTapMode
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                marginTop: "20vh",
                alignContent: "center",
              }}
              className="show-box"
            >
              <Icon>🎯</Icon> Uffa!
              <Typography variant="body1">
                Sua agenda está vazia para este dia...
              </Typography>
            </Typography>
          )}
        </Grid>
      </Grid>

      {/*Calendar*/}
      <Modal
        open={filter.calendario.open}
        onClose={() => setFilter({ calendario: { open: false } })}
        titulo="Selecionar data"
        fullScreen="mobile"
        component="modal"
      >
        <Calendario
          all
          data={filter.data_selecionada}
          onSelect={(date) =>
            setFilter({ calendario: { open: false }, data_selecionada: date })
          }
        />
      </Modal>

      {/* Reagendamento */}
      <Modal
        open={reagendamento.open}
        onClose={() => setReagendamento({ open: false })}
        titulo="Reagendar"
        fullScreen="mobile"
        component="modal"
        buttons={[
          {
            titulo: "Confirmar",
            color: "primary",
            variant: "contained",
            action: handleReeschedule,
          },
        ]}
      >
        <Reagendamento
          filter={filter}
          setFilter={setFilter}
          onChange={(novaData) =>
            setReagendamento({
              data_selecionada: novaData,
            })
          }
          novaData={reagendamento.data_selecionada}
          agendamentoSelecionado={reagendamento.agendamento_selecionado}
          alertCustom={alertCustom}
        />
      </Modal>

      {modal.agendamento_selecionado && (
        <Modal
          open={modal.open}
          onClose={() => setModal({ open: false })}
          titulo={modal.agendamento_selecionado?.nomeCliente || ""}
          buttons={
            modal.agendamento_selecionado?.status != "CANCELLED" && buttons
          }
          component="view"
          fullScreen="mobile"
        >
          <>
            <PaperList sx={{ mx: 2 }} items={getDescription()}>
              <Typography
                variant="h6"
                sx={{ p: "5px 10px", background: "#333" }}
              >
                Resumo do pedido
              </Typography>
            </PaperList>
          </>
        </Modal>
      )}

      <Confirm
        loading={modal.confirmacao.loading}
        open={modal.confirmacao.open}
        onClose={() =>
          setModal({
            confirmacao: {
              ...modal.confirmacao,
              open: false,
            },
          })
        }
        onConfirm={modal.confirmacao.action}
        title={modal.confirmacao.title || "Confirmação"}
        message={modal.confirmacao.message || "Deseja continuar?"}
      />
    </Modal>
  );
};

export default Agendamentos;
