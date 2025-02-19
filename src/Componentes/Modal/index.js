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
}) => {
  const [loadingButton, setLoadingButton] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={full[fullScreen]}
      PaperProps={{
        sx: {
          borderRadius:
            ["form", "view"].includes(component) || full[fullScreen]
              ? 0
              : "10px",
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
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
        <>
          <DialogContent sx={{ p: "10px" }}>
            <Container
              maxWidth={maxWidth}
              fullWidth
              sx={{
                height: "100%",
                p: "0 !important",
                borderRadius: isMobile ? "0" : "18px",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                setLoadingButton(true);
                onAction()?.then(() => setLoadingButton(false));
              }}
              component="form"
            >
              <Paper
                sx={{
                  width: "100%",
                  height: "100%",
                  m: 0,
                  p: ["modal"].includes(component)
                    ? "10px 0"
                    : isMobile
                    ? "0"
                    : "0px 24px",
                  ...(isMobile || ["view", "modal"].includes(component)
                    ? { background: "transparent" }
                    : {}),
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
                          height: "100%",
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
                      <Typography variant="h6">{titulo}</Typography>
                    </Grid>
                  ) : null}
                  <Grid size={{ xs: 12, xs: 12 }}>{children}</Grid>
                  <Grid size={{ xs: 12, xs: 12 }}>
                    {component == "form" && (
                      <Button
                        fullWidth
                        size="large"
                        disableElevation
                        onClick={() => {
                          setLoadingButton(true);
                          onAction()?.then(() => setLoadingButton(false));
                        }}
                        color={color}
                        disabled={loadingButton}
                        type="submit"
                        sx={{ marginTop: "50px", ...buttonStyle }}
                      >
                        {loadingButton ? "Carregando..." : actionText}
                      </Button>
                    )}{" "}
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          </DialogContent>
          {component != "form" && onAction && (
            <DialogActions>
              {" "}
              {buttons &&
                buttons.map((button) => (
                  <Button
                    color={button.color || "primary"}
                    disableElevation
                    onClick={button.action}
                    variant="outlined"
                    fullWidth={isMobile}
                    sx={{
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
              <Button
                fullWidth={isMobile}
                disableElevation
                onClick={() => {
                  setLoadingButton(true);
                  onAction()?.then(() => setLoadingButton(false));
                }}
                variant="contained"
                color={color}
              >
                {actionText}
              </Button>
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Modal;
