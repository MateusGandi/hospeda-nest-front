import React, { Children } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "../../Modal"; // Importando o Modal já existente
import Icon from "../../../Assets/Emojis";
import { Box } from "@mui/material";

const Confirm = ({
  open,
  onClose,
  onConfirm,
  title = "Tem certeza que deseja continuar?",
  message,
  children,
  icon,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      titulo={
        <>
          <Icon>{icon ? icon : "⚠️"}</Icon> {title}
        </>
      }
      maxWidth="xs"
      buttons={[
        { titulo: "Cancelar", action: onClose, color: "terciary" },
        { titulo: "Confirmar", action: onConfirm, color: "terciary" },
      ]}
    >
      <Typography typography="body1" sx={{ m: "0 20px" }}>
        {message}
      </Typography>
      <Box sx={{ m: 2 }}>{children}</Box>
    </Modal>
  );
};

export default Confirm;
