import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Modal,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

const NotificationModal = ({ open, onClose, notification }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
      }}
    >
      {notification?.image && (
        <CardMedia
          component="img"
          height="160"
          image={notification.image}
          alt={notification.title}
          sx={{ borderRadius: 1, mb: 2 }}
        />
      )}
      <Typography variant="h6" gutterBottom>
        {notification?.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {notification?.message}
      </Typography>
      {notification?.link && (
        <Typography variant="body2" color="primary">
          <a href={notification.link} target="_blank" rel="noopener noreferrer">
            Acessar link
          </a>
        </Typography>
      )}
    </Box>
  </Modal>
);

export default function Notifications({ type = "view", notifications = [] }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClick = (notif) => {
    if (type === "view") {
      setSelected(notif);
      setModalOpen(true);
    } else {
      navigate("/notifications");
    }
    setAnchorEl(null);
  };

  if (type === "list") {
    return (
      <>
        <IconButton onClick={handleIconClick}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <List sx={{ width: 300 }}>
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                button
                onClick={() => handleItemClick(notif)}
              >
                <ListItemAvatar>
                  <Avatar src={notif.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={notif.title}
                  secondary={notif.date || ""}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      </>
    );
  }

  // Default: view mode
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Notificações
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
      >
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            sx={{ display: "flex", cursor: "pointer" }}
            onClick={() => handleItemClick(notif)}
          >
            {notif.image && (
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={notif.image}
                alt={notif.title}
              />
            )}
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CardContent>
                <Typography component="div" variant="h6">
                  {notif.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notif.message.slice(0, 100)}...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.date}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>

      <NotificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notification={selected}
      />
    </Box>
  );
}
