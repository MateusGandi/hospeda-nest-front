import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  CircularProgress,
  Container,
  Grid2 as Grid,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { isMobile } from "../Funcoes";

const full = {
  [undefined]: false,
  all: true,
  mobile: isMobile,
  desktop: !isMobile,
};

const Modal = ({
  open,
  onClose,
  onAction,
  actionText = "Confirmar",
  onSubmit,
  submitText,
  children,
  maxWidth = "md",
  titulo,
  color = "primary",
  backAction,
  component = "modal", //modal, view, form
  fullScreen,
  loading = false,
  buttons, //{titulo, action, color}
  buttonStyle,
  modalStyle,
  image,
  loadingButton = false,
  sx,
  disablePadding,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={full[fullScreen]}
      PaperProps={{
        sx: {
          ...sx,
          borderRadius:
            ["form", "view"].includes(component) || full[fullScreen]
              ? 0
              : "10px",
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
        {backAction ? (
          <Button
            disableElevation
            variant="contained"
            onClick={backAction.action}
            size="large"
            sx={{
              background: "transparent",
              color: "#fff",
              marginLeft: "-20px",
            }}
            startIcon={<ArrowBackIcon />}
          >
            {backAction.titulo}
          </Button>
        ) : (
          titulo && <Typography variant="h6">{titulo}</Typography>
        )}

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
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
        <>
          <DialogContent sx={{ p: disablePadding ? 0 : "10px" }}>
            <Container
              maxWidth={maxWidth}
              sx={{
                height: "100%",
                p: "0 !important",
                borderRadius: isMobile ? "0" : "18px",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                onAction();
              }}
              component="form"
            >
              {" "}
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {image && (
                  <Grid size={{ xs: 0, md: 7 }}>
                    {" "}
                    <img
                      src={image.src}
                      style={{
                        ...image.styles,
                        display: !isMobile ? "block" : "none",
                      }}
                    />
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: component != "form" ? 12 : 5 }}>
                  {" "}
                  <Paper
                    variant={
                      isMobile || component != "form" ? "contained" : "outlined"
                    }
                    sx={{
                      ...modalStyle,
                      height: component != "form" ? "100%" : "530px",
                      m: 0,
                      p: ["modal"].includes(component)
                        ? "10px 0"
                        : isMobile
                        ? "0"
                        : "0px 24px",
                      background: "transparent",
                    }}
                    elevation={
                      isMobile || ["view", "modal"].includes(component) ? 0 : 1
                    }
                  >
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        ...(component == "form"
                          ? {
                              p: "20px 0",
                              height: component != "form" ? "100%" : "530px",
                              display: "flex",
                              justifyContent: "space-between",
                              flexDirection: "column",
                            }
                          : {}),
                      }}
                    >
                      {["form", "view"].includes(component) && backAction ? (
                        <Grid
                          size={{ xs: 12, xs: 12 }}
                          sx={{ textAlign: "center" }}
                        >
                          <Typography variant="h5">{titulo}</Typography>
                        </Grid>
                      ) : null}
                      <Grid size={{ xs: 12, xs: 12 }}>{children}</Grid>
                      {component == "form" && (
                        <>
                          <Grid size={{ xs: 12, xs: 12 }}>
                            <Button
                              fullWidth
                              size="large"
                              disableElevation
                              onClick={() => onAction()}
                              variant="contained"
                              color={color}
                              disabled={loadingButton}
                              type="submit"
                              sx={{ marginTop: "50px", ...buttonStyle }}
                            >
                              {loadingButton ? "Carregando..." : actionText}
                            </Button>
                          </Grid>{" "}
                          {submitText && (
                            <Grid size={{ xs: 12, xs: 12 }}>
                              <Button
                                fullWidth
                                size="large"
                                disableElevation
                                onClick={async () => {
                                  await onSubmit();
                                }}
                                sx={{
                                  border: "1px solid #484848",
                                  color: "#fff",
                                }}
                                variant="outlined"
                              >
                                {submitText}
                              </Button>
                            </Grid>
                          )}
                        </>
                      )}{" "}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </DialogContent>
          {component != "form" && (
            <DialogActions>
              {" "}
              {buttons &&
                // buttons.length &&
                buttons.map((button) => (
                  <Button
                    color={button.color || "primary"}
                    disableElevation
                    onClick={button.action}
                    variant={button.variant ? button.variant : "outlined"}
                    fullWidth={isMobile}
                    sx={{
                      ...buttonStyle,
                      border: "1px solid #484848",
                    }}
                  >
                    {button.titulo}
                  </Button>
                ))}
              {submitText && (
                <Button
                  disableElevation
                  fullWidth={isMobile}
                  onClick={onSubmit}
                  variant="outlined"
                  sx={{
                    border: "1px solid #484848",
                    color: "#fff",
                  }}
                >
                  {submitText}
                </Button>
              )}
              {onAction && (
                <Button
                  fullWidth={isMobile}
                  disableElevation
                  onClick={() => onAction()}
                  variant="contained"
                  color={color}
                >
                  {actionText}
                </Button>
              )}
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Modal;
