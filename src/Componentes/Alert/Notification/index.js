import { IconButton, Badge, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Modal from "../../Modal/Simple";
import { useEffect, useState } from "react";
import { Rows } from "../../Lista/Rows";
import apiService from "../../Api/axios";
import { formatMoney, getLocalItem, toUTC } from "../../Funcoes";
import { useNavigate } from "react-router-dom";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { LoadingBox } from "../../Custom";
import Icon from "../../../Assets/Emojis";

export const Notification = ({ sx = {} }) => {
  const navigate = useNavigate();
  const [content, _setContent] = useState({
    open: false,
    title: "Notificações",
    loading: false,
    notifications: [],
    badge: 0,
  });

  const setContent = (value) => _setContent((prev) => ({ ...prev, ...value }));
  const handleClose = () => setContent({ open: false });
  const handleOpen = () => setContent({ open: true });

  const handleGetNotifications = async () => {
    try {
      if (!getLocalItem("establishmentId")) return;
      setContent({ loading: true });
      const data = await apiService.query(
        "GET",
        `/payment/pending-payment/${getLocalItem("establishmentId")}`
      );

      const transacoes_pendentes = data
        .filter(({ status }) => status === "PENDING")
        .map((item) => ({
          ...item,
          titulo: `${formatMoney(item.precoComTaxa, "a")} ${
            item.description || "Não informado"
          }`,
          icon: <LaunchRoundedIcon />,
          subtitulo: `Vencimento: ${toUTC({
            data: item.dataVencimento,
            onlyDate: true,
          })}`,
        }));

      setContent({
        notifications: transacoes_pendentes,
        badge: transacoes_pendentes.length,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setContent({ loading: false });
    }
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen} sx={{ sx }}>
        <Badge badgeContent={content.badge} color="warning">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Modal
        titulo="Notificações"
        open={content.open}
        onClose={handleClose}
        maxWidth="xs"
        fullScreen="mobile"
        sx={{ p: 0 }}
        actionText="Fechar"
        onAction={handleClose}
      >
        {content.notifications.length ? (
          <Rows
            sx={{ background: "none" }}
            items={content.notifications}
            oneTapMode
            onSelect={(e) => navigate(`/checkout/${e.checkoutId}`)}
          />
        ) : content.loading ? (
          <LoadingBox message="Carregando..." />
        ) : (
          <Typography variant="h6" className="show-box">
            <Icon>🔔</Icon> Opps!!{" "}
            <Typography variant="body1">Nenhuma notificação...</Typography>
          </Typography>
        )}
      </Modal>
    </>
  );
};
