import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleLoginButton } from "../../Custom";
import IconButton from "@mui/material/IconButton";
import { LoadingBox } from "../Custom";
import LoadingImagePulse from "../../Effects/loading";
import LogoIcon from "../../../Assets/Login/tonsus_logo_white.png";
import { isMobile } from "../Functions";

const full = {
  [undefined]: { xs: false, md: false, radius: "10px" },
  all: { xs: true, md: true, radius: 0 },
  xs: { xs: true, md: false, radius: isMobile ? 0 : "10px" },
  md: { xs: false, md: true, radius: !isMobile ? 0 : "10px" },
};

const Modal = ({
  open,
  onClose,
  children,
  maxWidth = "md",
  titulo,
  fullScreen,
  loading = false,
  buttons = [], // {titulo, action, color}
  sx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={full[fullScreen].sec}
      PaperProps={{
        sx: {
          ...sx,
          borderRadius: full[fullScreen].radius,
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

        <IconButton aria-label="close" onClick={onClose} color="GrayText">
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
            <Container maxWidth={maxWidth}>{children}</Container>
          </DialogContent>
          {buttons.length && (
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
              {buttons &&
                buttons.map((button) => (
                  <Button
                    size="large"
                    color={button.color || "primary"}
                    disableElevation
                    disabled={button.disabled}
                    onClick={button.action}
                    icon={button.icon}
                    variant={button.variant || "outlined"}
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
