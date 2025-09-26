import React, { useEffect, useState, useRef } from "react";
import { Chip, Typography, Box, Grid2 as Grid } from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import { Rows } from "../../../Componentes/Lista/Rows";
import apiService from "../../../Componentes/Api/axios";
import { format } from "date-fns";
import { PaperList } from "../../../Componentes/Lista/Paper";
import { formatarHorario, isMobile } from "../../../Componentes/Funcoes";
import Filter from "../../../Componentes/Filter";
import Confirm from "../../../Componentes/Alert/Confirm";
import { useNavigate, useParams } from "react-router-dom";
import { CustomInput, LoadingBox } from "../../../Componentes/Custom";
import Icon from "../../../Assets/Emojis";
import Fila from "./Fila";

const ListaAgendamentos = ({ alertCustom, usuario }) => {
  const navigate = useNavigate();
  const { agendamentoId } = useParams();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filterOptions] = useState({
    PENDING: "Pendentes",
    NOT_ATTEND: "Não Compareci",
    CANCELLED: "Cancelados",
    OK: "Concluídos",
  });
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

  // Estado separado para o motivo
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  // Ref para guardar o ID do agendamento a ser cancelado
  const agendamentoParaCancelar = useRef(null);

  const [modal, setModal] = useState({
    open: false,
    agendamento: null,
    ratingModal: false,
    filter: { id: 0, valor: "PENDING", titulo: "Pendentes" },
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
          valor: "Pendente",
          buttons: [
            {
              titulo: "Cancelar agendamento",
              color: "error",
              variant: "contained",
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

  const handleGetSchedulings = async () => {
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
      handleGetSchedulings();
      setModal((prev) => ({ ...prev, update: false }));
    }
  }, [modal.update]);

  useEffect(() => {
    handleGetSchedulings();
  }, [modal.filter]);

  const formatTitle = (data) =>
    `${format(
      new Date(data).setHours(new Date(data).getHours() + 3),
      "dd/MM/yyyy HH:mm"
    )}`;

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
          multiline
          minRows={4}
          value={motivoCancelamento}
          onChange={(e) => setMotivoCancelamento(e.target.value)}
        />
      </Confirm>

      {/* {modal.agendamento && (
        <ReviewBarbershopModal
          barbearia={modal.agendamento.barbearia}
          open={modal.ratingModal}
          onClose={handleRatingModal}
          alertCustom={alertCustom}
        />
      )} */}

      {modal.filter && (
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
          <span>Meus agendamentos</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography
              variant="body1"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {modal.filter.titulo}
            </Typography>
            <Filter
              title="Filtrar por"
              options={filterOptions}
              filter={modal.filter}
              setFilter={(filter) => setModal((prev) => ({ ...prev, filter }))}
            />{" "}
          </span>
        </Typography>
      )}

      {modal.loading ? (
        <LoadingBox message={"Carregando agendamentos..."} />
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
            <Icon>🎯</Icon> Nenhum registro encontrado!
          </Typography>
          Encontre a barbearia mais próxima de você e aproveite a facilidade de
          agendar de forma prática, direta e com inúmeros benefícios!
        </Typography>
      )}

      {modal.agendamento && modal.agendamento.posicaoFila ? (
        <Fila
          alertCustom={alertCustom}
          reload={handleGetSchedulings}
          dados={modal.agendamento}
        />
      ) : (
        modal.agendamento && (
          <Modal
            component="view"
            open={modal.open}
            onClose={handleClose}
            titulo={
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Chip
                  sx={{
                    bgcolor: colorsByStatus[modal.agendamento.status],
                    my: 1,
                  }}
                  label={statusNames[modal.agendamento.status]}
                />
                {formatTitle(modal.agendamento.data)}
              </Typography>
            }
            buttons={modal.agendamento.modalActions}
            fullScreen="mobile"
            maxWidth="sm"
          >
            <Grid container sx={{}} spacing={2}>
              <Grid size={12}>
                <Rows
                  disabled={true}
                  items={[
                    {
                      titulo: modal.agendamento.atendente.nome,
                      subtitulo: "Atendente responsável",
                      size: 50,
                      imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${modal.agendamento.atendente.id}/${modal.agendamento.atendente.foto}`,
                    },
                  ]}
                />
              </Grid>
              <Grid size={12}>
                <PaperList
                  items={[
                    ...modal.agendamento.servico.map((item) => ({
                      titulo: item.nome,
                      subtitulo: formatarHorario(item.tempoGasto),
                    })),
                    ...(modal.agendamento.motivoCancelamento
                      ? [
                          {
                            titulo: "Motivo do cancelamento",
                            subtitulo: modal.agendamento.motivoCancelamento,
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
          </Modal>
        )
      )}
    </>
  );
};

export default ListaAgendamentos;
