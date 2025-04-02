import React, { useEffect, useState } from "react";
import { Chip, Typography, Box, CircularProgress } from "@mui/material";
import Modal from "../Componentes/Modal";
import { Rows } from "../Componentes/Lista/Rows";
import apiService from "../Componentes/Api/axios";
import { format } from "date-fns";
import { PaperList } from "../Componentes/Lista/Paper";
import { formatarHorario, isMobile } from "../Componentes/Funcoes";
import ReviewBarbershopModal from "./Evaluation";
import Filter from "../Componentes/Filter";
import Confirm from "../Componentes/Alert/Confirm";
import { useNavigate, useParams } from "react-router-dom";

const ListaAgendamentos = ({ alertCustom, usuario }) => {
  const navigate = useNavigate();
  const { agendamentoId } = useParams();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filterOptions] = useState({
    PENDING: "Agendados",
    NOT_ATTEND: "Não Compareci",
    CANCELLED: "Cancelados",
    OK: "Concluídos",
  });
  const [modal, setModal] = useState({
    confirm: { open: false },
    open: false,
    modalActions: [],
    agendamento: null,
    ratingModal: false,
    filter: { id: 0, valor: "PENDING", titulo: "Agendados" },
    loading: false,
    update: true,
  });

  useEffect(() => {
    if (!agendamentoId) {
      setModal((prev) => ({
        ...prev,
        agendamento: null,
        open: false,
      }));
      navigate("/me");
    }
  }, [agendamentoId]);

  const handleRatingModal = () => {
    setModal((prev) => ({
      ...prev,
      ratingModal: !modal.ratingModal,
      open: false,
    }));
  };

  const handleCancel = async (id) => {
    try {
      const data = await apiService.query("PATCH", `/scheduling/cancel/${id}`);
    } catch (error) {
      alertCustom("Erro ao cancelar agendamento, comunique seu barbeiro!");
    }
  };

  const getStatus = (status, id) => {
    switch (status) {
      case "PENDING":
        return {
          color: "success",
          valor: "Agendado",
          buttons: [
            {
              titulo: "Cancelar agendamento",
              color: "error",
              action: () =>
                setModal((prev) => ({
                  ...prev,
                  confirm: {
                    open: true,
                    message:
                      "Tem certeza que deseja cancelar este agendamento?",
                    exec: async () => {
                      await handleCancel(id);
                      handleClose();
                      setModal((prev) => ({
                        ...prev,
                        update: true,
                        confirm: { ...prev.confirm, open: false },
                      }));
                    },
                  },
                })),
            },
          ],
        };
      case "NOT_ATTEND":
        return {
          color: "error",
          valor: "Não Compareceu",
          buttons: [],
        };
      case "CANCELLED":
        return {
          color: "terciary",
          valor: "Cancelado",
          buttons: [],
        };
      case "OK":
        return {
          color: "primary",
          valor: "Concluído",
          buttons: [],
        };
      default:
        return { color: "warning", valor: "Não atendido", buttons: [] };
    }
  };

  const handleOpen = (agendamento) => {
    navigate(`${agendamento.id}`);
    setModal((prev) => ({ ...prev, open: true, agendamento }));
  };

  const handleClose = () => {
    setModal((prev) => ({ ...prev, open: false, agendamento: null }));
  };

  const handleGetScheduling = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await apiService.query(
        "GET",
        `/scheduling/user/${usuario.id}?status=${modal.filter.valor}`
      );
      setAgendamentos(data);
    } catch (error) {
      console.log("error", error);
      alertCustom("Erro ao buscar agendamentos");
    }
    setModal((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    if (modal.update) {
      handleGetScheduling();
      setModal((prev) => ({ ...prev, update: false }));
    }
  }, [modal.update]);

  useEffect(() => {
    handleGetScheduling();
  }, [modal.filter]);

  return (
    <>
      <Confirm
        open={modal.confirm.open}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            confirm: { ...prev.confirm, open: false },
          }))
        }
        onConfirm={modal.confirm.exec}
        message={modal.confirm.message}
      />
      {modal.agendamento && (
        <ReviewBarbershopModal
          barbearia={modal.agendamento.barbearia}
          open={modal.ratingModal}
          onClose={handleRatingModal}
          alertCustom={alertCustom}
        />
      )}
      <Typography
        variant="h6"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        Meus agendamentos
        <Filter
          title="Filtrar por"
          options={filterOptions}
          filter={modal.filter}
          setFilter={(filter) =>
            setModal((prev) => ({ ...prev, filter: filter }))
          }
        />
      </Typography>
      {modal.loading ? (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Typography>
      ) : agendamentos.length > 0 ? (
        <Rows
          items={agendamentos.map((agendamento) => {
            const agendamentoStatus = getStatus(
              agendamento.status,
              agendamento.id
            );
            return {
              id: agendamento.id,
              titulo: (
                <Box
                  sx={{
                    alignItems: "center",
                    gap: 1,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1">
                    {agendamento.barbearia.nome ?? "Barbearia Nome"}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: -0.5 }}
                    >
                      Funcionário:{" "}
                      {agendamento.atendente?.nome ?? "Desconhecido"}
                    </Typography>
                  </Typography>

                  {!isMobile && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mt: 1 }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        {agendamento.data
                          ? format(
                              new Date(agendamento.data).setHours(
                                new Date(agendamento.data).getHours() + 3
                              ),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "Data não informada"}
                      </Typography>
                      {
                        <Chip
                          label={agendamentoStatus.valor}
                          color={agendamentoStatus.color}
                          size="small"
                        />
                      }
                    </Box>
                  )}
                </Box>
              ),
              subtitulo: isMobile && (
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                  <Chip
                    label={agendamentoStatus.valor}
                    color={agendamentoStatus.color}
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary">
                    {agendamento.data
                      ? format(
                          new Date(agendamento.data).setHours(
                            new Date(agendamento.data).getHours() + 3
                          ),
                          "dd/MM/yyyy HH:mm"
                        )
                      : "Data não informada"}
                  </Typography>
                </Box>
              ),

              action: () =>
                handleOpen({
                  ...agendamento,
                  modalActions: agendamentoStatus.buttons,
                }),
            };
          })}
          onSelect={handleOpen}
          selectedItems={[]}
          multipleSelect={false}
          oneTapMode={true}
          disableTouchRipple={false}
        />
      ) : (
        <Typography
          className="show-box"
          typography="body1"
          sx={{ m: "10px 0" }}
        >
          <Typography variant="h6">
            🎯
            {modal.filter?.valor
              ? `Nenhum registro ${modal.filter?.titulo
                  .toLowerCase()
                  .slice(0, -1)} encontrado!`
              : "Nenhum agendamento ainda!"}
          </Typography>
          Encontre a barbearia mais próxima de você e aproveite a facilidade de
          agendar de forma prática, direta e com inúmeros benefícios!
        </Typography>
      )}
      {modal.agendamento && (
        <Modal
          open={modal.open}
          onClose={handleClose}
          titulo={`${format(
            new Date(modal.agendamento.data).setHours(
              new Date(modal.agendamento.data).getHours() + 3
            ),
            "dd/MM/yyyy HH:mm"
          )}`}
          buttons={modal.agendamento.modalActions}
          fullScreen="mobile"
        >
          {modal.agendamento && (
            <>
              <PaperList
                items={modal.agendamento.servico.map((item) => ({
                  titulo: item.nome,
                  subtitulo: formatarHorario(item.tempoGasto),
                }))}
              >
                <Typography variant="h6" sx={{ p: 1 }}>
                  Produtos e serviços
                </Typography>
              </PaperList>

              <Typography sx={{ p: 1 }}>
                Funcionário:{" "}
                {modal.agendamento.atendente?.nome ?? "Não informado"}
                <Typography>
                  Situação:{" "}
                  <Chip
                    label={
                      getStatus(modal.agendamento.status, modal.agendamento.id)
                        .valor
                    }
                    color={
                      getStatus(modal.agendamento.status, modal.agendamento.id)
                        .color
                    }
                    size="small"
                  />
                </Typography>{" "}
              </Typography>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default ListaAgendamentos;
