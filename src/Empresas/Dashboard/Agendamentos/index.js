import React, { useEffect, useState } from "react";
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
    PENDING: "Agendados",
    NOT_ATTEND: "Não Compareci",
    CANCELLED: "Cancelados",
    OK: "Concluídos",
  });
  const [form, setForm] = useState({
    barbearia: barbearia,
    servicos: null,
    horario: null,
    dia: null,
    barbeiro: { id: getLocalItem("userId") },
  });
  const [modalConteudo, setModalConteudo] = useState({
    open: false,
    view: "agendamento",
    titulo: "",
    dados: null,
    agendamentos: [],
    filter: [{ PENDING: "Agendados" }],
  });
  const status = {
    reschedule: "reagendamento",
    cancel: "cancelamento",
    report: "reporte",
  };
  const buttons = [
    {
      titulo: "Cancelar",
      color: "error",
      route: "cancelled",
      action: () => handleAction("cancel"),
    },
    {
      titulo: "Reagendar",
      color: "terciary",
      route: "reschedule",
      action: () =>
        setModalConteudo((prev) => ({
          ...prev,
          open: true,
          fullScreen: "all",
          titulo: "Reagendar cliente",
          view: "reagendar",
        })),
    },

    {
      titulo: "Não compareceu",
      color: "terciary",
      route: "report",
      action: () => handleAction("report"),
    },
  ];

  const buscarAgendamentos = async () => {
    try {
      const dataFormatted = dataSelecionada.toISOString().split("T")[0];
      const userId = getLocalItem("userId");
      const agendamentos = await apiService.query(
        "GET",
        `/scheduling/employee/scheduleds/${userId}/${dataFormatted}?filter=${modalConteudo.filter.valor}`
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

      // Simulando resposta da API

      const agFormatted = agendas.map((item) => {
        const status = getStatus(item.status);
        return {
          ...item,
          servicosPrestados: [
            {
              nome: "Corte de Cabelo",
              tempoGasto: "00:30:00",
              foto: "1743085070375as2_MateusHenriqueGandi.png",
              id: 1,
              descricao: "",
              preco: "35.00",
            },
            {
              nome: "Barba",
              tempoGasto: "00:10:00",
              foto: "1743085072312Diagrama sem nome.png",
              id: 2,
              descricao: "",
              preco: "10.00",
            },
          ].map((item) => ({
            ...item,
            titulo: `${item.nome} | R$ ${item.preco}`,
            subtitulo: formatarHorario(item.tempoGasto),
          })),
          imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/7/profile/1743508933036Imagem%20do%20WhatsApp%20de%202025-03-30%20%C3%83%C2%A0(s)%2001.jpeg`,
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
        agendamentos: agFormatted,
      }));
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? "Erro ao buscar agendamentos!"
      );
    }
  };

  useEffect(() => {
    buscarAgendamentos();
  }, [modalConteudo.filter, dataSelecionada]);

  const handleAction = async (acao, data) => {
    try {
      await Api.query(
        "PATCH",
        `/scheduling/${acao}/${modalConteudo.dados.id}`,
        { data }
      );
      alertCustom(`${status[acao]} realizado com sucesso!`);
      setModalConteudo({ open: false, titulo: "", dados: null });
      buscarAgendamentos();
    } catch (error) {
      alertCustom(
        error?.response?.data?.message ?? `Erro ao realizar ${status[acao]}!`
      );
    }
  };

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
                setForm((prev) => ({
                  ...prev,
                  servicos: item.servicosPrestados,
                }));
                setModalConteudo((prev) => ({
                  ...prev,
                  view: "agendamento",
                  open: true,
                  titulo: item.nomeCliente,
                  dados: item,
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

      {/* Modal reutilizável */}
      <Modal
        open={modalConteudo.open}
        onClose={() => setModalConteudo((prev) => ({ ...prev, open: false }))}
        titulo={modalConteudo.titulo || "Agendamento"}
        maxWidth={modalConteudo.view === "calendario" ? "xs" : "md"}
        buttons={modalConteudo.view != "calendario" && buttons}
        onAction={
          modalConteudo.view == "calendario" ? null : () => console.log("oi")
        }
        actionText="Concluído"
        fullScreen={modalConteudo.fullScreen || "mobile"}
      >
        {modalConteudo.view === "calendario" ? (
          <Calendario
            all={true}
            onSelect={(date) => {
              setDataSelecionada(date);
              setModalConteudo((prev) => ({ ...prev, open: false }));
            }}
          />
        ) : modalConteudo.view === "reagendar" ? (
          <Reagendamento
            setForm={setForm}
            form={modalConteudo.dados}
            alertCustom={alertCustom}
            onConfirm={(data) => handleAction("reschedule", data)}
          />
        ) : (
          modalConteudo.dados && (
            <PaperList items={modalConteudo.dados.servicosPrestados}>
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
