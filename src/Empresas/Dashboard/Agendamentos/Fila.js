import {
  Chip,
  Grid2 as Grid,
  Typography,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import apiService from "../../../Componentes/Api/axios";
import {
  formatarHorario,
  getLocalItem,
  getStatus,
} from "../../../Componentes/Funcoes";
import { format } from "date-fns";
import { Rows } from "../../../Componentes/Lista/Rows";
import { PaperList } from "../../../Componentes/Lista/Paper";

const DESCRIPTION = {
  confirm: "confirmar atendimento",
  remove: "remover da fila",
};

export const GerenciarFila = ({ alertCustom }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const [content, setContent] = useState({
    open: true,
    back: {
      action: handleBack,
      titulo: "Voltar",
    },
    items: [],
    currentClient: null,
    loading: false,
    disabled: false,
    buttons: [],
  });

  const _setContent = (valor) => setContent((prev) => ({ ...prev, ...valor }));

  const handleClose = () => _setContent({ open: false });

  const handleGetQueue = async () => {
    try {
      _setContent({ loading: true });
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
            titulo: `${item.posicaoFila} - ${service.nome} | R$ ${service.preco}`,
            subtitulo: formatarHorario(service.tempoGasto),
          })),
          imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.usuario.id}/${item.usuario.foto}`,
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
                <span className="show-art">{format(item.data, "HH:mm")}</span>{" "}
                {item.nomeCliente || "Desconhecido"}
              </span>
              <span>
                {status.manual && <Chip size="small" label={"Manual"} />}
                <Chip size="small" label={status.valor} color={status.color} />
              </span>
            </Typography>
          ),
          subtitulo: (
            <Typography variant="body2">
              {format(
                new Date(item.dataFinalizacao),
                "'Previsão de finalização até ' HH:mm ' horas'"
              )}
            </Typography>
          ),
        };
      });

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
      const { message } = await apiService.query(
        method,
        `/scheduling/queue/${action}/${id}`
      );
      alertCustom(message || `Ação realizada com sucesso!`);
    } catch (error) {
      alertCustom(
        `Erro ao ${
          DESCRIPTION[action] || "realizar ação"
        }, tente novamente mais tarde!`
      );
    } finally {
      handleGetQueue();
      handleGetOne();
    }
  };

  const handleGetOne = async () => {
    try {
      const barberId = getLocalItem("userId");
      const { cliente } = await apiService.query(
        "GET",
        `/scheduling/queue/next/${barberId}`
      );
      if (cliente) {
        _setContent({
          currentClient: cliente,
          buttons: [
            {
              titulo: "Remover da fila",
              variant: "contained",
              color: "error",
              action: () => handleAction(cliente.id, "remove", "DELETE"),
            },
            {
              titulo: "Marcar como concluído",
              variant: "contained",
              color: "primary",
              action: () => handleAction(cliente.id, "confirm", "PATCH"),
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetQueue();
    handleGetOne();
  }, []);

  return (
    <Modal
      open={content.open}
      backAction={content.back}
      onClose={handleClose}
      titulo="Gerenciar fila de espera"
      fullScreen="all"
      loading={content.loading}
      component="view"
      buttons={content.buttons}
    >
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 1 }}>
          <Rows
            oneTapMode
            items={content.items}
            onDelete={(item) => handleAction(item.id, "remove", "DELETE")}
            disabled={content.disabled}
          />
        </Grid>

        {/* Cliente atual */}
        <Grid item size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 2 }}>
          {content.currentClient && (
            <Grid container spacing={2}>
              {/* Foto */}
              <Grid item size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                <Avatar
                  src={`${process.env.REACT_APP_BACK_TONSUS}/images/user/${content.currentClient.id}/${content.currentClient.foto}`}
                  sx={{ width: 200, height: 200, margin: "0 auto" }}
                />
              </Grid>

              {/* Lista de detalhes */}
              <Grid item size={{ xs: 12 }}>
                <PaperList
                  items={[
                    {
                      titulo: "Nome",
                      subtitulo: content.currentClient.nome,
                    },
                    {
                      titulo: "Serviços",
                      subtitulo: content.currentClient.servicos?.join(", "),
                    },
                    {
                      titulo: "Tempo estimado",
                      subtitulo: formatarHorario(
                        content.currentClient.tempoEstimado
                      ),
                    },
                    {
                      titulo: "Horário previsto",
                      subtitulo: format(
                        new Date(content.currentClient.horarioPrevisto),
                        "HH:mm"
                      ),
                    },
                  ]}
                >
                  {" "}
                  <Typography variant="h6" sx={{ p: "5px 15px" }}>
                    Detalhes do Cliente
                  </Typography>
                </PaperList>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};
