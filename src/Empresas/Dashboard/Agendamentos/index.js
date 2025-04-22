import React, { use, useEffect, useState } from "react";
import {
  Button,
  Chip,
  Container,
  Grid2 as Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import Api from "../../../Componentes/Api/axios";
import { Rows } from "../../../Componentes/Lista/Rows";
import Calendario from "../../../Componentes/Calendar";
import { format } from "date-fns";
import {
  formatarHorario,
  formatDataToString,
  formatTime,
  getLocalItem,
  getStatus,
  isMobile,
} from "../../../Componentes/Funcoes";
import Reagendamento from "./Reschedule";
import apiService from "../../../Componentes/Api/axios";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import Icon from "../../../Assets/Emojis";
import { PaperList } from "../../../Componentes/Lista/Paper";
import Filter from "../../../Componentes/Filter";

const AgendamentoManual = ({ open, handleClose, alertCustom, barbearia }) => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [filterOptions] = useState({
    "": "Todos",
    PENDING: "Agendados",
    NOT_ATTEND: "Não Compareci",
    CANCELLED: "Cancelados",
    OK: "Concluídos",
  });
  const [modalConteudo, setModalConteudo] = useState({
    open: false,
    view: "agendamento",
    titulo: "",
    dados: null,
    fullScreen: "mobile",
    agendamentos: [],
    size: "md",
    filter: { titulo: "Todos", id: 0, valor: "" },
    action: { titulo: "Concluído", do: () => handleAction("confirm") },
  });
  const status = {
    reschedule: "reagendamento",
    cancel: "cancelamento",
    report: "reporte",
    confirm: "confirmação",
  };

  const buscarAgendamentos = async () => {
    try {
      const dataFormatted = dataSelecionada.toISOString().split("T")[0];
      const userId = getLocalItem("userId");
      const agendamentos = await apiService.query(
        "GET",
        `/scheduling/employee/scheduleds/${userId}/${dataFormatted}${
          modalConteudo.filter.valor
            ? `?status=${modalConteudo.filter.valor}`
            : ""
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

      const agFormatted = agendas.map((item) => {
        const status = getStatus(item.status);
        return {
          ...item,
          servico: item.servico.map((service) => ({
            ...service,
            titulo: `${service.nome} | R$ ${service.preco}`,
            subtitulo: formatarHorario(service.tempoGasto),
          })),
          imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/user/${item.funcionario.id}/${item.funcionario.foto}`,
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
                {" "}
                <span className="show-art"> {format(item.data, "HH:mm")}</span>
                {item.nomeCliente || "Desconhecido"}{" "}
              </span>
              <span>
                {" "}
                {status.manual && <Chip size="small" label={"Manual"} />}
                <Chip size="small" label={status.valor} color={status.color} />
              </span>
            </Typography>
          ),
          //disabled: ["NOT_ATTEND"].includes(item.status),
          subtitulo: (
            <>
              <Typography variant="body2" sx={{ display: "flex", gap: 1 }}>
                {format(
                  new Date(item.dataFinalizacao),
                  "'Previsão para finalizar até ' HH:mm ' horas'"
                )}
              </Typography>
            </>
          ),
        };
      });

      setModalConteudo((prev) => ({
        ...prev,
        size: "md",
        agendamentos: agFormatted,
      }));
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    }
  };

  const buttons = {
    agendamento: [
      {
        titulo: "Cancelar",
        color: "error",
        route: "cancelled",
        status: "CANCELLED",
        action: () => handleAction("cancel"),
      },
      {
        titulo: "Reagendar",
        color: "terciary",
        route: "reschedule",
        status: "RESCHEDULED",
        action: () =>
          setModalConteudo((prev) => ({
            ...prev,
            open: true,
            fullScreen: "all",
            titulo: "Reagendar cliente",
            view: "reagendar",
            action: {
              titulo: "Confirmar",
              do: () => handleAction("reschedule"),
            },
          })),
      },

      {
        titulo: "Não compareceu",
        color: "terciary",
        route: "report",
        status: "NOT_ATTEND",
        action: () => handleAction("report"),
      },
    ],
    calendario: [],
  };

  useEffect(() => {
    buscarAgendamentos();
  }, [modalConteudo.filter, dataSelecionada]);

  const handleAction = async (acao) => {
    try {
      console.log(modalConteudo.dados);
      await Api.query(
        "PATCH",
        `/scheduling/${acao}/${modalConteudo.dados?.id}`,
        modalConteudo.dados
      );
      alertCustom(`${status[acao]} realizado com sucesso!`);
      setModalConteudo((prev) => ({
        ...prev,
        open: false,
      }));
      buscarAgendamentos();
    } catch (error) {
      console.log(error);
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar ${status[acao]}!`
      );
    }
  };

  useEffect(() => {
    console.log("modalConteudo.dados", modalConteudo.dados);
  }, [modalConteudo.dados]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      titulo="Agendamentos"
      fullScreen="all"
      maxWidth="sm"
    >
      <Grid container spacing={2}>
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
            <span className="show-text">
              {formatDataToString(dataSelecionada.toLocaleDateString())}
            </span>
          </Typography>
          <span>
            <Filter
              title="Filtrar por"
              options={filterOptions}
              filter={modalConteudo.filter}
              setFilter={(filter) =>
                setModalConteudo((prev) => ({ ...prev, filter: filter }))
              }
            />
            <IconButton
              onClick={() =>
                setModalConteudo((prev) => ({
                  ...prev,
                  open: true,
                  titulo: "Selecione um dia",
                  view: "calendario",
                  size: "xs",
                }))
              }
            >
              <InsertInvitationRoundedIcon />
            </IconButton>
          </span>
        </Grid>
        <Grid item size={{ xs: 12 }}>
          {modalConteudo.agendamentos?.length ? (
            <Rows
              items={modalConteudo.agendamentos}
              onSelect={(item) => {
                setModalConteudo((prev) => ({
                  ...prev,
                  view: "agendamento",
                  open: true,
                  titulo: item.nomeCliente,
                  size: "md",
                  fullScreen: "mobile",
                  dados: {
                    ...item,
                    dia: item.data,
                    barbearia: barbearia,
                    servicos: item.servico,
                    barbeiro: { id: getLocalItem("userId") },
                  },
                }));
              }}
              oneTapMode={true}
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

      <Modal
        open={modalConteudo.open}
        onClose={() => setModalConteudo((prev) => ({ ...prev, open: false }))}
        titulo={modalConteudo.titulo}
        maxWidth={modalConteudo.size}
        buttons={buttons[modalConteudo.view]}
        onAction={modalConteudo.action.do}
        actionText={modalConteudo.action.titulo}
        fullScreen={modalConteudo.fullScreen}
      >
        {modalConteudo.view === "calendario" ? (
          <Calendario
            all={true}
            data={dataSelecionada}
            onSelect={(date) => {
              setDataSelecionada(date);
              setModalConteudo((prev) => ({ ...prev, open: false }));
            }}
          />
        ) : modalConteudo.view === "reagendar" ? (
          <Reagendamento
            setForm={(form) =>
              setModalConteudo((prev) => ({
                ...prev,
                dados: {
                  ...prev.dados,
                  ...form,
                },
              }))
            }
            form={modalConteudo.dados}
            alertCustom={alertCustom}
          />
        ) : (
          modalConteudo.dados && (
            <PaperList items={modalConteudo.dados.servico}>
              <Typography variant="h6" sx={{ p: "5px 10px" }}>
                Resumo do pedido
              </Typography>
            </PaperList>
          )
        )}
      </Modal>
    </Modal>
  );
};

export default AgendamentoManual;
