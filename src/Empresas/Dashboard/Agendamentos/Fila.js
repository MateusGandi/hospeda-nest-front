import { Chip, Grid2 as Grid, Typography, Link } from "@mui/material";
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
  setLocalItem,
  toUTC,
} from "../../../Componentes/Funcoes";
import { Rows } from "../../../Componentes/Lista/Rows";
import { PaperList } from "../../../Componentes/Lista/Paper";
import Confirm from "../../../Componentes/Alert/Confirm";
import Icon from "../../../Assets/Emojis";
import { CustomSelect } from "../../../Componentes/Custom";
const DESCRIPTION = {
  confirm: "confirmar atendimento",
  remove: "remover da fila",
};

export const GerenciarFila = ({ alertCustom, data, setData }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/dashboard");

  const [content, setContent] = useState({
    open: true,
    back: { action: handleBack, titulo: "Voltar" },
    items: [],
    currentClient: null,
    loading: true,
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
      const barberId = data.funcionarioId;
      const { fila } = await apiService.query(
        "GET",
        `/scheduling/queue/barber/${barberId}`
      );

      const items_formatted = fila.map((item, index) => {
        const status = getStatus(item.status);
        return {
          ...item,
          servico: item.servico.map((service) => ({
            ...service,
            titulo: `${service.nome} | R$ ${service.preco}`,
            subtitulo: service.tempoGasto,
          })),
          icon: <span>{item.posicaoFila}</span>,
          avatarProps: { background: index > 0 ? "#0195F7" : "transparent" },
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
                {toUTC({ data: item.data, onlyHours: true })}{" "}
                {primeiraMaiuscula(
                  item.usuario?.nome || item.nomeCliente || "Cliente sem nome"
                )}
              </span>
              {status.manual && <Chip size="small" label="Manual" />}
            </Typography>
          ),
          subtitulo: (
            <Typography variant="body1">Clique para ver detalhes</Typography>
          ),
        };
      });

      if (JSON.stringify(content.items) === JSON.stringify(items_formatted))
        return;

      _setContent({ items: items_formatted });
      return items_formatted;
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
      handleGetQueue().then(async () => handleGetOne());
    }
  };

  const openConfirm = (id, type) => {
    setConfirmDialog({
      open: true,
      id,
      action: type,
      method: type === "remove" ? "DELETE" : "PATCH",
      title: type === "remove" ? "Remover da fila" : "Confirmar atendimento",
      message:
        type === "remove"
          ? "Tem certeza que deseja remover este cliente da fila?"
          : "Tem certeza que deseja confirmar o atendimento deste cliente e chamar o próximo?",
    });
  };

  const handleGetOne = async (items) => {
    try {
      const { cliente } = await apiService.query(
        "GET",
        `/scheduling/queue/next/${data.funcionarioId}`
      );
      if (cliente) {
        const currentClient = items.find((i) => i.id === cliente.id);
        _setContent({
          currentClient: { ...currentClient, ...cliente },
        });
      } else {
        _setContent({ currentClient: null });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetQueue().then((items) => handleGetOne(items));
    const interval = setInterval(() => {
      handleGetQueue(false).then((items) => handleGetOne(items));
    }, 10000);
    return () => clearInterval(interval);
  }, [data.funcionarioId]);

  return (
    <Modal
      open={content.open}
      backAction={content.back}
      onClose={handleClose}
      fullScreen="all"
      loading={content.loading}
      component="view"
      maxWidth="md"
      disableSubmittion={true}
      disabledAction={content.items.length === 0}
      actionText={
        content.items.length > 1 ? "Chamar próximo" : "Concluir atendimento"
      }
      onAction={() => openConfirm(content.currentClient?.id, "confirm")}
      buttons={[
        {
          titulo: "Remover atual da fila",
          variant: "outlined",
          color: "terciary",
          disabled: content.items.length === 0,
          sx: { px: 2 },
          action: () => openConfirm(content.currentClient?.id, "remove"),
        },
        {
          titulo: "Adicionar cliente",
          variant: "outlined",
          color: "terciary",
          sx: { px: 2, color: "#fff" },
          action: () => {
            navigate("/dashboard/agendamento/cliente", { replace: true });
          },
        },
      ]}
    >
      <Grid container spacing={2}>
        {content.items.length ? (
          <Grid item size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 1 }}>
            <>
              <Typography
                sx={{
                  width: { xs: "100%", md: "200px" },
                  mb: 2,
                  display: { xs: "none", md: "block" },
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
                    width: { xs: "100%", md: "300px" },
                    mt: { xs: 2, md: 0 },
                  }}
                />
              </Typography>
              <Rows
                disableRipple
                sx={{ background: "transparent" }}
                oneTapMode
                items={content.items}
                onDelete={(id) => openConfirm(id, "remove")}
                onSelect={(item) => {
                  _setContent({ currentClient: item });
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
            Gerencie a fila de atendimento aqui. Quando um cliente entrar na
            fila ou for adicionado por você, ele aparecerá nesta lista.
            <Typography sx={{ mt: 4, display: "flex", justifyContent: "end" }}>
              <CustomSelect
                value={data.funcionarioId}
                onChange={({ target: { value } }) => {
                  setData({ funcionarioId: value });
                }}
                options={data.options}
                label="Funcionário"
                placeholder="Selecione o funcionário"
                sx={{ width: { xs: "100%", md: "300px" } }}
              />
            </Typography>
          </Typography>
        )}

        {content.currentClient && (
          <>
            <Grid item size={12}>
              <Typography
                sx={{
                  width: { xs: "100%", md: "200px" },
                  mb: 2,
                  display: { xs: "block", md: "none" },
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
                    width: { xs: "100%", md: "300px" },
                    mt: { xs: 2, md: 0 },
                  }}
                />
              </Typography>{" "}
            </Grid>
            <Grid item size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 2 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography variant="h4" className="show-box">
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mt: -1 }}
                    >
                      Cliente atual
                    </Typography>
                    {primeiraMaiuscula(
                      content.currentClient.nome ||
                        content.currentClient.nomeCliente ||
                        "Cliente sem nome"
                    )}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <PaperList
                    sx={{ width: "100%" }}
                    items={[
                      {
                        titulo: "Telefone",
                        subtitulo: content.currentClient?.usuario?.telefone ? (
                          <Link
                            href={`https://wa.me/${content.currentClient.usuario.telefone.replace(
                              /\D/g,
                              ""
                            )}?text=É%20a%20sua%20vez...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            color="primary"
                          >
                            {formatPhone(
                              content.currentClient.usuario.telefone
                            )}
                          </Link>
                        ) : (
                          "Não informado"
                        ),
                      },
                      {
                        titulo: "Serviços",
                        subtitulo:
                          content.currentClient?.servico?.length > 0
                            ? content.currentClient.servico
                                .map((s) => `${s.nome} | R$ ${s.preco}`)
                                .join("\n")
                            : "Nenhum serviço",
                      },
                      ...(content.currentClient.tempoEstimado
                        ? [
                            {
                              titulo: "Duração estimada",
                              subtitulo: `${formatarHorario(
                                content.currentClient.tempoEstimado
                              )}`,
                            },
                          ]
                        : []),
                    ]}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        p: "12px 16px",
                        background: "#333",
                      }}
                    >
                      Detalhes do atendimento
                    </Typography>
                  </PaperList>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>

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
