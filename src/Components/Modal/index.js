import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import { isMobile } from "../Functions";
import { LoadingBox } from "../Custom";

const full = {
  [undefined]: { xs: false, md: false, radius: "10px" },
  all: { xs: true, md: true, radius: 0 },
  xs: { xs: true, md: false, radius: isMobile ? 0 : "10px" },
  md: { xs: false, md: true, radius: !isMobile ? 0 : "10px" },
};

const Modal = ({
  open,
  handleClose,
  children,
  maxWidth = "md",
  titulo,
  fullScreen,
  loading = false,
  buttons = [], // {titulo, action, color}
  buttonStyle,
  sx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={full[fullScreen]?.xs && full[fullScreen]?.md}
      PaperProps={{
        sx: {
          ...sx,
          borderRadius: full[fullScreen]?.radius,
          position: "relative",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{titulo}</Typography>
        <IconButton aria-label="close" onClick={handleClose} color="GrayText">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {loading ? (
        <Container
          maxWidth={maxWidth}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "200px",
            zIndex: 1,
          }}
        >
          <LoadingBox />
        </Container>
      ) : (
        <>
          <DialogContent sx={{ p: 0 }}>
            <Container
              maxWidth={maxWidth}
              sx={{
                height: "100%",
                py: 2,
                px: 0,
              }}
            >
              {children}
            </Container>
          </DialogContent>
          {buttons.length > 0 && (
            <DialogActions
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "end",
                flexWrap: { xs: "wrap", md: "nowrap" },
                gap: 1,
                m: 1,
              }}
            >
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  size="large"
                  color={button.color || "primary"}
                  disableElevation
                  disabled={button.disabled}
                  onClick={button.action}
                  startIcon={button.icon}
                  variant={button.variant ? button.variant : "outlined"}
                  sx={button.sx}
                >
                  {button.titulo}
                </Button>
              ))}
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Modal;
