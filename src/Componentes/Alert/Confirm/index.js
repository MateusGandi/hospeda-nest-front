import React, { Children } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "../../Modal/Simple"; // Importando o Modal já existente
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
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm && onConfirm();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onConfirm && onConfirm();
        }
      }}
    >
      <Modal
        open={open}
        onClose={!loading && onClose}
        titulo={
          <>
            {icon && <Icon>{icon}</Icon>} {title}
          </>
        }
        loadingButton={loading}
        type="alert"
        maxWidth="xs"
        buttonStyle={{ width: "46%", margin: "0 1%" }}
        buttons={[
          {
            titulo: cancelText,
            action: onClose,
            color: "secondary",
            disabled: loading,
            variant: "text",
          },
          {
            titulo: confirmText,
            action: onConfirm,
            color: "primary",
            disabled: loading,
            variant: "contained",
            submit: true,
          },
        ]}
      >
        <Typography typography="body1" sx={{ m: "0 1" }}>
          {message}
        </Typography>
        <Box>{children}</Box>
      </Modal>
    </form>
  );
};

export default Confirm;
