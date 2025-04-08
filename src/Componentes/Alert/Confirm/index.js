import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "../../Modal"; // Importando o Modal já existente
import Icon from "../../../Assets/Emojis";

const Confirm = ({
  open,
  onClose,
  onConfirm,
  title = "Tem certeza que deseja continuar?",
  message,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      titulo={
        <>
          <Icon>⚠️</Icon> {title}
        </>
      }
      maxWidth="xs"
      buttons={[
        { titulo: "Cancelar", action: onClose, color: "error" },
        { titulo: "Confirmar", action: onConfirm, color: "primary" },
      ]}
    >
      <Typography typography="body1" sx={{ m: 2 }}>
        {message}
      </Typography>
    </Modal>
  );
};

export default Confirm;
