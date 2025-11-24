import React, { useEffect, useState } from "react";
import WeekCalendar from "../../../Componentes/Calendar/Schedule";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  Chip,
  duration,
  IconButton,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import Icon from "../../../Assets/Emojis";
import Filter from "../../../Componentes/Filter";
import Search from "../../../Componentes/Search/ApplyFilter";
import { useNavigate } from "react-router-dom";
import {
  diferencaEmMinutos,
  formatarHorario,
  getLocalItem,
  getStatus,
  primeiraMaiuscula,
} from "../../../Componentes/Funcoes";
import { format } from "date-fns";
import apiService from "../../../Componentes/Api/axios";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import Modal from "../../../Componentes/Modal/Simple";
import { PaperList } from "../../../Componentes/Lista/Paper";
import { Rows } from "../../../Componentes/Lista/Rows";
import Confirm from "../../../Componentes/Alert/Confirm";
import { CustomSelect } from "../../../Componentes/Custom";
const CONFIRM_INITIAL = {
  open: false,
  action: () => {},
  loading: false,
  message: "",
  title: "",
};
export default function AgendamentosByCalendario({
  alertCustom,
  data,
  setData,
}) {
  const navigate = useNavigate();

  const colors = {
    primary: "#0195F7",
    success: "#23C45D",
    warning: "#E57F01",
    error: "#f44336",
  };
  const colorsByStatus = {
    PENDING: "#0195F7",
    OK: "#23C45D",
    CANCELLED: "#E57F01",
    NOT_ATTEND: "#f44336",
  };

  const statusNames = {
    PENDING: "Agendado",
    NOT_ATTEND: "Não Compareceu",
    CANCELLED: "Cancelado",
    OK: "Concluído",
  };

  const [filterOptions] = useState({
    "": "Todos",
    PENDING: "Agendados",
    NOT_ATTEND: "Não Compareceu",
    CANCELLED: "Cancelados",
    OK: "Concluídos",
  });
  const marcarComoConcluido = {
    PENDING: {
      text: "Já concluído",
      action: () => handleAction("confirm"),
    },
    NOT_ATTEND: {
      text: "Já concluído",
      action: () => handleAction("confirm"),
    },
    CANCELLED: {},
    OK: {},
  };

  const buttons = {
    "": [],
    PENDING: [
      {
        titulo: "Cancelar",
        color: "error",
        route: "cancelled",
        status: "CANCELLED",
        action: () => handleAction("cancel"),
      },
    ],
    NOT_ATTEND: [],
    CANCELLED: [],
    OK: [],
  };

  const status = {
    reschedule: "reagendamento",
    cancel: "cancelamento",
    report: "reporte",
    confirm: "confirmação",
  };

  const [params, _setParams] = useState({
    search: "",
    filter: {
      titulo: "Todos",
      valor: "",
      id: 0,
    },
    inicio: "",
    fim: "",
  });
  const [content, _setContent] = useState({
    loading: true,
    filtred: [],
    eventos: [],
  });
  const [modal, _setModal] = useState({
    open: false,
    titulo: "",
    selecionado: null,
  });

  const [confirmModal, setConfirmModal] = useState(CONFIRM_INITIAL);

  const setContent = (newContent) => {
    _setContent((prev) => ({ ...prev, ...newContent }));
  };
  const setParams = (newContent) => {
    _setParams((prev) => ({ ...prev, ...newContent }));
  };
  const setModal = (newContent) => {
    _setModal((prev) => ({ ...prev, ...newContent }));
  };

  const handleChangeDate = (fim, inicio) => {
    setParams({
      inicio: inicio.toISOString().split("T")[0],
      fim: fim.toISOString().split("T")[0],
    });
  };

  const handleGetAgendamentos = async () => {
    try {
      const { inicio, fim, filter } = params;
      if (!inicio || !fim) return;
      const userId = data.funcionarioId || getLocalItem("userId");

      setContent({ loading: true });

      let baseUrl = `/scheduling/employee/scheduleds/${userId}/${inicio}`;
      const queryParams = new URLSearchParams();

      if (filter.valor) queryParams.append("status", filter.valor);
      if (fim) queryParams.append("dataFinal", fim);

      const url = `${baseUrl}?${queryParams.toString()}`;

      const agendamentos = await apiService.query("GET", url);

      const agendamentos_formatados = agendamentos
        .filter((item) => (!filter.valor ? item.status !== "CANCELLED" : true))
        .map((item) => {
          const data = new Date(item.data);
          data.setHours(data.getHours() + 3);

          const dataFinalizacao = new Date(item.dataFinalizacao);
          dataFinalizacao.setHours(dataFinalizacao.getHours() + 3);

          return {
            ...item,
            data,
            dataFinalizacao,
          };
        })
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
            title: `${format(item.data, "HH:mm")} ${
              item.nomeCliente || "Desconhecido"
            }`,
            description:
              item.motivoCancelamento ||
              item.servico.map(({ nome }) => nome).join("\n"),
            color: colors[status.color],
            date: item.data,
            duration: diferencaEmMinutos(item.data, item.dataFinalizacao),
            status: status,
            statusKey: item.status,
            finalizacao: format(
              new Date(item.dataFinalizacao),
              "'Previsão de finalização até 'HH:mm' horas'"
            ),
          };
        });
      setContent({
        filtred: agendamentos_formatados,
        eventos: agendamentos_formatados,
      });
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    } finally {
      setContent({ loading: false });
    }
  };

  const handleAction = (acao) => {
    setConfirmModal({
      open: true,
      action: async () => await handleConfirmAction(acao),
      title: `Confirmação de ${status[acao]}`,
      message: `Você tem certeza que deseja realizar o(a) ${status[acao]} deste agendamento?`,
    });
  };

  const handleConfirmAction = async (acao) => {
    try {
      setConfirmModal((prev) => ({ ...prev, loading: true }));
      await apiService.query(
        "PATCH",
        `/scheduling/${acao}/${modal.selecionado?.id}`,
        modal.dados
      );
      alertCustom(`${primeiraMaiuscula(status[acao])} realizado com sucesso!`);
      setModal({
        open: false,
      });
      handleGetAgendamentos();
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar ${status[acao]}!`
      );
    } finally {
      setConfirmModal((prev) => ({ ...prev, loading: false, open: false }));
    }
  };

  const handleUpdateAgendamento = async (item, data, discount) => {
    try {
      if (item.statusKey === "CANCELLED")
        throw new Error("Não é possível reagendar um agendamento cancelado!");

      setContent({ loading: true });
      const dataCorrigida = new Date(data);
      dataCorrigida.setHours(dataCorrigida.getHours() - 3);

      await apiService.query("PUT", `/scheduling/${item.id}`, {
        data: dataCorrigida.toISOString(),
        establishmentId: getLocalItem("establishmentId"),
        barberId: item.funcionario.id,
        services: item.servico.map((service) => service.id),
        status: "PENDING",
        ...(discount
          ? { discountId: discount.id, discountValue: discount.value }
          : {}),
      });

      alertCustom("Reagendamento realizado com sucesso!");
      handleGetAgendamentos();
    } catch (error) {
      handleGetAgendamentos();
      alertCustom(
        error.message ||
          error?.response?.data?.message ||
          "Erro ao atualizar agendamento!"
      );
    } finally {
      setContent({ loading: false });
    }
  };

  useEffect(() => {
    handleGetAgendamentos();
  }, [params]);

  const onClose = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        fullScreen="all"
        titulo="Agendamentos"
        maxWidth="lg"
      >
        <Confirm
          loading={confirmModal.loading}
          open={confirmModal.open}
          onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
          onConfirm={confirmModal.action}
          title={confirmModal.title || "Confirmação"}
          message={confirmModal.message || "Deseja continuar?"}
        />
        <WeekCalendar
          loading={content.loading}
          legend={
            <Box
              className="justify-between-wrap show-box"
              sx={{
                alignItems: "top",
                gap: 1,
                pt: 5,
                mb: 2,
              }}
            >
              <CustomSelect
                value={data.funcionarioId}
                onChange={({ target: { value } }) => {
                  setData({ funcionarioId: value });
                }}
                options={data.options}
                label="Funcionário"
                placeholder="Selecione o funcionário"
                sx={{
                  width: "100%",
                  maxWidth: 250,
                }}
              />
              <Typography variant="body1" sx={{ mt: -3 }}>
                Legenda
                <Typography className="justify-between" sx={{ gap: 1, mt: 2 }}>
                  {Object.keys(colorsByStatus).map((key) => (
                    <Chip
                      label={filterOptions[key]}
                      sx={{ background: colorsByStatus[key] }}
                    />
                  ))}
                </Typography>
              </Typography>
            </Box>
          }
          tools={
            <Box className="justify-between" sx={{ gap: 1 }}>
              <Search
                initial={content.eventos}
                elements={content.filtred}
                setElements={(elements) => setContent({ filtred: elements })}
                label="Pesquisar eventos"
                searchValue={params.search}
                setSearchValue={(value) => setParams({ search: value })}
                variant="outlined"
                size="small"
              />
              <Filter
                title="Filtrar por"
                options={filterOptions}
                filter={params.filter}
                setFilter={(filter) => setParams({ filter })}
              />
            </Box>
          }
          events={content.filtred}
          allowEventMove={true}
          onEventClick={(ev) => {
            setModal({ open: true, titulo: ev.title, selecionado: ev });
          }}
          onEventMove={(updatedEvent, newDate) => {
            setContent(
              content.eventos.map((e) =>
                e.id === updatedEvent.id ? updatedEvent : e
              )
            );
            handleUpdateAgendamento(updatedEvent, newDate);
          }}
          onWeekChange={handleChangeDate}
          actionText="Novo"
          actionIcon={<AddRoundedIcon />}
          onAction={() => navigate("/dashboard/agendamento/cliente")}
          startHour={data.startHour ?? 8}
          endHour={data.endHour ?? 18}
        />
      </Modal>
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        titulo={
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <Chip
              sx={{
                bgcolor: colorsByStatus[modal.selecionado?.statusKey],
                my: 1,
              }}
              label={statusNames[modal.selecionado?.statusKey]}
            />
            {modal.titulo}
          </Typography>
        }
        maxWidth="sm"
        buttons={buttons[modal.selecionado?.statusKey]}
        onAction={marcarComoConcluido[modal.selecionado?.statusKey]?.action}
        actionText={marcarComoConcluido[modal.selecionado?.statusKey]?.text}
      >
        {modal.selecionado && (
          <Grid container sx={{ mt: -3 }} spacing={2}>
            <Grid size={12}>
              <Rows
                disabled={true}
                items={[
                  {
                    titulo: modal.selecionado.funcionario.nome,
                    subtitulo: "Atendente responsável",
                    size: 50,
                    imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${modal.selecionado.funcionario.id}/${modal.selecionado.funcionario.foto}`,
                  },
                ]}
              />
            </Grid>
            <Grid size={12}>
              <PaperList
                items={[
                  ...modal.selecionado.servico,
                  {
                    titulo: "Telefone do cliente",
                    subtitulo: modal.selecionado.telefone || "N/A",
                  },
                  {
                    titulo: "E-mail do cliente",
                    subtitulo: modal.selecionado.email || "N/A",
                  },
                  ...(modal.selecionado.motivoCancelamento
                    ? [
                        {
                          titulo: "Motivo do cancelamento",
                          subtitulo: modal.selecionado.motivoCancelamento,
                        },
                      ]
                    : []),
                ]}
              >
                <Typography variant="h6" sx={{ p: "5px 10px" }}>
                  Resumo do pedido
                </Typography>
              </PaperList>
            </Grid>
          </Grid>
        )}
      </Modal>
    </>
  );
}
