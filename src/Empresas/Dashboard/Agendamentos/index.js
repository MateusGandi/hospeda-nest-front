import React, { useEffect, useState } from "react";
import WeekCalendar from "../../../Componentes/Calendar/Schedule";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, Chip, duration, IconButton, Typography } from "@mui/material";
import Icon from "../../../Assets/Emojis";
import Filter from "../../../Componentes/Filter";
import Search from "../../../Componentes/Search";
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
import Modal from "../../../Componentes/Modal";
import { PaperList } from "../../../Componentes/Lista/Paper";

export default function App({ alertCustom }) {
  const navigate = useNavigate();

  const colors = {
    primary: "#0195F7",
    success: "#03E55B",
    warning: "#E57F01",
    error: "#f44336",
  };
  const colorsByStatus = {
    PENDING: "#0195F7",
    OK: "#03E55B",
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
      {
        titulo: "Não compareceu",
        color: "terciary",
        route: "report",
        status: "NOT_ATTEND",
        action: () => handleAction("report"),
      },
    ],
    NOT_ATTEND: [],
    CANCELLED: [
      {
        titulo: "Não compareceu",
        color: "terciary",
        route: "report",
        status: "NOT_ATTEND",
        action: () => handleAction("report"),
      },
    ],
    OK: [
      {
        titulo: "Não compareceu",
        color: "terciary",
        route: "report",
        status: "NOT_ATTEND",
        action: () => handleAction("report"),
      },
    ],
  };

  const status = {
    reschedule: "reagendamento",
    cancel: "cancelamento",
    report: "reporte",
    confirm: "confirmação",
  };

  const [params, _setParams] = useState(() => {
    const inicio = new Date();
    const fim = new Date();
    fim.setDate(fim.getDate() + 7);

    return {
      search: "",
      filter: "",
      inicio: inicio.toISOString().split("T")[0],
      fim: fim.toISOString().split("T")[0],
    };
  });
  const [content, _setContent] = useState({
    filtred: [
      {
        id: "1",
        title: "Reunião",
        date: new Date(2025, 6, 22, 14, 10),
        duration: 30,
      },
      {
        id: "2",
        title: "Treinamento",
        date: new Date(2025, 6, 23, 15, 0),
        duration: 45,
      },
    ],
    eventos: [
      {
        id: "1",
        title: "Reunião",
        date: new Date(2025, 6, 22, 14, 10),
        duration: 30,
      },
      {
        id: "2",
        title: "Treinamento",
        date: new Date(2025, 6, 23, 15, 0),
        duration: 45,
      },
    ],
  });
  const [modal, _setModal] = useState({
    open: false,
    titulo: "",
    selecionado: null,
  });

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
      const userId = getLocalItem("userId");

      let baseUrl = `/scheduling/employee/scheduleds/${userId}/${inicio}`;
      const queryParams = new URLSearchParams();

      if (filter.valor) queryParams.append("status", filter.valor);
      if (fim) queryParams.append("dataFinal", fim);

      const url = `${baseUrl}?${queryParams.toString()}`;

      const agendamentos = await apiService.query("GET", url);

      const agendamentos_formatados = agendamentos
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
      console.log(agendamentos_formatados);
      setContent({
        filtred: agendamentos_formatados,
        eventos: agendamentos_formatados,
      });
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    }
  };

  const handleAction = async (acao) => {
    try {
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
    }
  };

  useEffect(() => {
    handleGetAgendamentos();
  }, [params]);

  return (
    <>
      <WeekCalendar
        legend={
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              mb: 1,
              mt: -1,
            }}
          >
            {Object.keys(colorsByStatus).map((key) => (
              <>
                {" "}
                <SquareRoundedIcon
                  fontSize="small"
                  sx={{ color: colorsByStatus[key] }}
                />
                <Typography
                  component={"span"}
                  variant="body2"
                  color="GrayText"
                  sx={{ mr: 1 }}
                >
                  {filterOptions[key]}
                </Typography>
              </>
            ))}
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
            />{" "}
            <Filter
              title="Filtrar por"
              options={filterOptions}
              filter={params.filter}
              setFilter={(filter) => setParams({ filter })}
            />{" "}
          </Box>
        }
        disable={[
          {
            inicio: new Date("2025-07-20T13:00:00"),
            fim: new Date("2025-07-20T15:10:00"),
          },
          {
            inicio: new Date("2025-07-21T14:00:00"),
            fim: new Date("2025-07-21T17:00:00"),
          },
        ]}
        events={content.filtred}
        allowEventMove={true}
        onEventClick={(ev) => {
          console.log(ev);
          setModal({ open: true, titulo: ev.title, selecionado: ev });
        }}
        onEventMove={(updatedEvent, newDate) => {
          setContent(
            content.eventos.map((e) =>
              e.id === updatedEvent.id ? updatedEvent : e
            )
          );
          console.log("Evento movido:", updatedEvent, newDate);
        }}
        onWeekChange={handleChangeDate}
        // onCellClick={(day, hour, minute) =>
        //   navigate("/dashboard/agendamento/cliente")
        // }
        actionText="Novo"
        actionIcon={<AddRoundedIcon />}
        onAction={() => navigate("/dashboard/agendamento/cliente")}
      />

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        titulo={modal.titulo}
        maxWidth="sm"
        buttons={buttons[modal.selecionado?.statusKey]}
        onAction={marcarComoConcluido[modal.selecionado?.statusKey]?.action}
        actionText={marcarComoConcluido[modal.selecionado?.statusKey]?.text}
      >
        {modal.selecionado && (
          <>
            <Typography variant="body1">
              <Chip
                sx={{
                  bgcolor: colorsByStatus[modal.selecionado?.statusKey],
                  my: 1,
                }}
                label={statusNames[modal.selecionado?.statusKey]}
              />
            </Typography>
            <PaperList
              items={[
                ...modal.selecionado.servico,
                ...(modal.selecionado.motivoCancelamento
                  ? [
                      {
                        titulo: "Motivo do cancelamento",
                        subtitulo: modal.selecionado.motivoCancelamento,
                      },
                    ]
                  : []),
                {
                  titulo: modal.selecionado.funcionario.nome,
                  subtitulo: "Atendente",
                  size: 50,
                  image: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${modal.selecionado.funcionario.id}/${modal.selecionado.funcionario.foto}`,
                },
              ]}
            >
              <Typography variant="h6" sx={{ p: "5px 10px" }}>
                Resumo do pedido
              </Typography>
            </PaperList>
          </>
        )}
      </Modal>

      {/* <Typography
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
      </Typography> */}
    </>
  );
}
