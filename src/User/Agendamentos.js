import React, { useEffect, useState, useRef } from "react";
import { Chip, Typography, Box, CircularProgress } from "@mui/material";
import Modal from "../Componentes/Modal";
import { Rows } from "../Componentes/Lista/Rows";
import apiService from "../Componentes/Api/axios";
import { format } from "date-fns";
import { PaperList } from "../Componentes/Lista/Paper";
import { formatarHorario, isMobile } from "../Componentes/Funcoes";
import ReviewBarbershopModal from "../Evaluation";
import Filter from "../Componentes/Filter";
import Confirm from "../Componentes/Alert/Confirm";
import { useNavigate, useParams } from "react-router-dom";
import { CustomInput } from "../Componentes/Custom";
import Icon from "../Assets/Emojis";

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

  // Estado separado para o motivo
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  // Ref para guardar o ID do agendamento a ser cancelado
  const agendamentoParaCancelar = useRef(null);

  const [modal, setModal] = useState({
    open: false,
    agendamento: null,
    ratingModal: false,
    filter: { id: 0, valor: "PENDING", titulo: "Agendados" },
    loading: false,
    update: true,
    confirmOpen: false,
    confirmMessage: "",
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
      ratingModal: !prev.ratingModal,
      open: false,
    }));
  };

  const handleCancel = async () => {
    if (!motivoCancelamento.trim()) {
      return alertCustom("Informe o motivo do cancelamento!");
    }
    try {
      await apiService.query(
        "PATCH",
        `/scheduling/cancel/${agendamentoParaCancelar.current}`,
        {
          motivoCancelamento: motivoCancelamento,
        }
      );
      handleClose();
      setModal((prev) => ({
        ...prev,
        update: true,
        confirmOpen: false,
      }));
      setMotivoCancelamento("");
    } catch (error) {
      alertCustom(
        error.response.data?.message ??
          "Erro ao cancelar agendamento, comunique seu barbeiro!"
      );
    }
  };
  const getStatus = (status, id) => {
    switch (status) {
      case "PENDING":
        return {
          color: "primary",
          valor: "Agendado",
          buttons: [
            {
              titulo: "Cancelar agendamento",
              color: "error",
              action: () => {
                agendamentoParaCancelar.current = id;
                setModal((prev) => ({
                  ...prev,
                  confirmOpen: true,
                  confirmMessage:
                    "Tem certeza que deseja cancelar este agendamento?",
                }));
              },
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
          color: "warning",
          valor: "Cancelado",
          buttons: [],
        };
      case "OK":
        return {
          color: "success",
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
    navigate(-1);
  };

  const handleGetScheduling = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await apiService.query(
        "GET",
        `/scheduling/user/${usuario.id}?status=${modal.filter.valor}`
      );
      if (agendamentoId) navigate(-1);
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
        open={modal.confirmOpen}
        onClose={() => {
          setModal((prev) => ({
            ...prev,
            confirmOpen: false,
          }));
          setMotivoCancelamento("");
        }}
        title="Cancelar agendamento"
        onConfirm={handleCancel}
        message={modal.confirmMessage}
      >
        <CustomInput
          sx={{ mt: 2 }}
          fullWidth
          placeholder="Informe o motivo do cancelamento"
          label="Motivo"
          multiline
          minRows={4}
          value={motivoCancelamento}
          onChange={(e) => setMotivoCancelamento(e.target.value)}
        />
      </Confirm>

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
          mt: 2,
        }}
      >
        Meus agendamentos
        <Filter
          title="Filtrar por"
          options={filterOptions}
          filter={modal.filter}
          setFilter={(filter) => setModal((prev) => ({ ...prev, filter }))}
        />
      </Typography>

      {modal.loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
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
                      <Chip
                        label={agendamentoStatus.valor}
                        color={agendamentoStatus.color}
                        size="small"
                      />
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
            <Icon>🎯</Icon>{" "}
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
            Funcionário: {modal.agendamento.atendente?.nome ?? "Não informado"}
            <br />
            Situação:{" "}
            <Chip
              label={getStatus(modal.agendamento.status).valor}
              color={getStatus(modal.agendamento.status).color}
              size="small"
            />
          </Typography>
        </Modal>
      )}
    </>
  );
};

export default ListaAgendamentos;
