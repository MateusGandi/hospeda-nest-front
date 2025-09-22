import {
  Chip,
  Grid2 as Grid,
  Typography,
  Button,
  Stack,
  Link,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import apiService from "../../../Componentes/Api/axios";
import {
  formatarHorario,
  formatPhone,
  getLocalItem,
  getStatus,
  primeiraMaiuscula,
} from "../../../Componentes/Funcoes";
import { format } from "date-fns";
import { Rows } from "../../../Componentes/Lista/Rows";
import { PaperList } from "../../../Componentes/Lista/Paper";
import Confirm from "../../../Componentes/Alert/Confirm";
import Icon from "../../../Assets/Emojis";

const DESCRIPTION = {
  confirm: "confirmar atendimento",
  remove: "remover da fila",
};

export const GerenciarFila = ({ alertCustom }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/dashboard");

  const [content, setContent] = useState({
    open: true,
    back: { action: handleBack, titulo: "Voltar" },
    items: [],
    currentClient: null,
    loading: false,
    disabled: false,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null,
    action: null,
    method: null,
    title: "",
    message: "",
  });

  const _setContent = (valor) => setContent((prev) => ({ ...prev, ...valor }));
  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleGetQueue = async (load = true) => {
    try {
      _setContent({ loading: load });
      const barberId = getLocalItem("userId");
      const { fila } = await apiService.query(
        "GET",
        `/scheduling/queue/barber/${barberId}`
      );

      const items_formatted = fila.map((item) => {
        const status = getStatus(item.status);
        return {
          ...item,
          servico: item.servico.map((service) => ({
            ...service,
            titulo: `${service.nome} | R$ ${service.preco}`,
            subtitulo: service.tempoGasto,
          })),
          icon: <span>{item.posicaoFila}</span>,
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
                {format(new Date(item.data), "HH:mm")}{" "}
                {item.usuario?.nome || "Cliente sem nome"}
              </span>
              {status.manual && <Chip size="small" label="Manual" />}
            </Typography>
          ),
          subtitulo: (
            <Typography variant="body2">
              Clique para enviar mensagem via WhatsApp{" "}
              <Typography variant="body2">
                {formatPhone(item.usuario?.telefone) || "Não informado"}
              </Typography>
            </Typography>
          ),
        };
      });
      if (JSON.stringify(content.items) == JSON.stringify(items_formatted))
        return;

      _setContent({ items: items_formatted });
    } catch (error) {
      console.error(error);
      alertCustom("Erro ao carregar a fila de espera");
    } finally {
      _setContent({ loading: false });
    }
  };

  const handleAction = async (id, action, method) => {
    try {
      if (!["confirm", "remove"].includes(action))
        throw new Error("Ação não implementada");

      _setContent({ loading: true });
      await apiService.query(method, `/scheduling/queue/${action}/${id}`);
    } catch (error) {
      alertCustom(
        `Erro ao ${
          DESCRIPTION[action] || "realizar ação"
        }, tente novamente mais tarde!`
      );
    } finally {
      await handleGetOne();
      handleGetQueue();
    }
  };

  const openConfirm = (id, type) => {
    setConfirmDialog({
      open: true,
      id,
      action: type,
      method: type == "remove" ? "DELETE" : "PATCH",
      title: type == "remove" ? "Remover da fila" : "Confirmar atendimento",
      message:
        type == "remove"
          ? "Tem certeza que deseja remover este cliente da fila?"
          : "Tem certeza que deseja confirmar o atendimento deste cliente e chamar o próximo?",
    });
  };

  const handleGetOne = async () => {
    try {
      const barberId = getLocalItem("userId");
      const { cliente } = await apiService.query(
        "GET",
        `/scheduling/queue/next/${barberId}`
      );
      if (cliente) {
        _setContent({ currentClient: cliente });
      } else {
        _setContent({ currentClient: null });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetOne();
    handleGetQueue();

    const interval = setInterval(() => {
      handleGetQueue(false);
      handleGetOne();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      open={content.open}
      backAction={content.back}
      onClose={handleClose}
      fullScreen="all"
      loading={content.loading}
      component="view"
      maxWidth="md"
      disabledAction={content.items.length == 0}
      actionText={
        content.items.length > 1 ? "Chamar próximo" : "Concluir atendimento"
      }
      onAction={() => openConfirm(content.currentClient.id, "confirm")}
      buttons={[
        {
          titulo: "Remover atual da fila",
          variant: "text",
          color: "secondary",
          disabled: content.items.length == 0,
          sx: { px: 2 },
          action: () => openConfirm(content.currentClient.id, "remove"),
        },
      ]}
    >
      <Grid container spacing={2}>
        {/* Lista da fila */}
        {content.items.length ? (
          <Grid item size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 1 }}>
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Fila de espera
              </Typography>
              <Rows
                disableRipple
                sx={{ background: "transparent" }}
                oneTapMode
                items={content.items}
                onDelete={(id) => openConfirm(id, "remove")}
                onSelect={(item) => {
                  _setContent({ currentClient: item });
                  if (item.usuario?.telefone) {
                    const telefone = item.usuario.telefone.replace(/\D/g, "");
                    const mensagem = encodeURIComponent(
                      "É a sua vez, pode vir!"
                    );
                    window.open(
                      `https://wa.me/${telefone}?text=${mensagem}`,
                      "_blank"
                    );
                  }
                }}
                disabled={content.disabled}
                styleSelect={{ background: "#0195F7" }}
                selectedItems={
                  content.currentClient ? [content.currentClient] : []
                }
                checkmode={false}
              />
            </>
          </Grid>
        ) : (
          <Typography
            className="show-box"
            typography="body1"
            sx={{ m: "10px 0" }}
          >
            <Typography variant="h6">
              <Icon>🔥</Icon> Nenhum cliente em espera!
            </Typography>
            Gerencie sua fila de atendimento aqui. Quando um cliente entrar na
            fila ou for adicionado por você, ele aparecerá nesta lista.
            <Box className="justify-end-wrap">
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate("/dashboard/agendamento/cliente", { replace: true })
                }
                disableElevation
                sx={{ px: 2 }}
              >
                Adicionar cliente
              </Button>
            </Box>
          </Typography>
        )}
        {/* Detalhes do cliente selecionado */}
        {content.currentClient && (
          <Grid item size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 2 }}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <PaperList
                  items={[
                    {
                      titulo: "Telefone",
                      subtitulo:
                        content.items[0] &&
                        content.items[0].usuario?.telefone ? (
                          <Link
                            href={`https://wa.me/${content.items[0].usuario?.telefone?.replace(
                              /\D/g,
                              ""
                            )}?text=É%20a%20sua%20vez...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            color="textSecondary"
                          >
                            {formatPhone(content.items[0]?.usuario?.telefone)}
                          </Link>
                        ) : (
                          "Não informado"
                        ),
                    },
                    {
                      titulo: "Serviços",
                      subtitulo: content.currentClient.servicos?.join(", "),
                    },
                    {
                      titulo: "Tempo estimado de duração",
                      subtitulo: content.currentClient.tempoEstimado
                        ? formatarHorario(content.currentClient.tempoEstimado)
                        : "Não informado",
                    },
                    {
                      titulo: "Horário previsto de início",
                      subtitulo:
                        content.currentClient.horarioPrevisto &&
                        format(
                          new Date(content.currentClient.horarioPrevisto),
                          "HH:mm"
                        ),
                    },
                  ]}
                >
                  <Typography
                    variant="h6"
                    sx={{ p: "5px 15px", background: "#363636" }}
                  >
                    {primeiraMaiuscula(
                      content.currentClient.nome ||
                        content.currentClient.nomeCliente ||
                        "Cliente sem nome"
                    )}{" "}
                    <Typography variant="body2" color="textSecondary">
                      Cliente atual
                    </Typography>
                  </Typography>
                </PaperList>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Modal de confirmação */}
      <Confirm
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          handleAction(
            confirmDialog.id,
            confirmDialog.action,
            confirmDialog.method
          );
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={
          confirmDialog.action === "remove" ? "Remover" : "Confirmar"
        }
        cancelText="Cancelar"
      />
    </Modal>
  );
};
