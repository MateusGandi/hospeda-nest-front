import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import LoadingImagePulse from "../../Effects/loading";
import LogoIcon from "../../../Assets/Login/tonsus_logo_white.png";
import { isMobile } from "../../Funcoes";
import { GoogleLoginButton } from "../../Custom";

const full = {
  [undefined]: { xs: false, md: false, sec: false },
  all: { xs: true, md: true, sec: true },
  mobile: { xs: true, md: false, sec: isMobile },
  desktop: { xs: false, md: true, sec: !isMobile },
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
  buttons = [], //{titulo, action, color}
  dialogAction,
  buttonStyle,
  modalStyle,
  images,
  loadingButton = false,
  sx,
  componentName = "",
  alignItems = "start",
  disabledAction = false,
}) => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Fecha a modal se o usuário navegar para outra página manualmente
  useEffect(() => {
    if (open && prevPath !== location.pathname) {
      onClose();
    }
  }, [prevPath]);

  // Garante que onClose também navega de volta quando necessário
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={full[fullScreen].sec}
      PaperProps={{
        sx: {
          ...sx,
          borderRadius: full[fullScreen].sec ? 0 : "10px",
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
              borderRadius: "4px !important",
              background: "transparent",
              color: "#fff",
              marginLeft: "-10px",
            }}
            startIcon={<ArrowBackIcon />}
          >
            {backAction.titulo}
          </Button>
        ) : (
          titulo && <Typography variant="h6">{titulo}</Typography>
        )}

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
          {component == "view" ? (
            <LoadingImagePulse src={LogoIcon} />
          ) : (
            <CircularProgress />
          )}
        </Container>
      ) : (
        <>
          <DialogContent sx={{ p: 0 }}>
            <Container
              maxWidth={maxWidth}
              sx={{
                height: "100%",
                py: 2,
                borderRadius: { xs: 0, md: "0" },
              }}
              onSubmit={(e) => {
                e.preventDefault();
                onAction && onAction();
              }}
              component="form"
            >
              <Grid
                container
                spacing={5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: alignItems,
                  py: { xs: 0, md: 2 },
                  // height: "100%",
                }}
              >
                {images && (
                  <Grid
                    size={{ xs: 0, md: 8 }}
                    sx={{
                      display: { md: "flex", xs: "none" },
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {images.map((image) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={image.src}
                          style={{
                            ...image.styles,
                          }}
                        />
                        {image.text && (
                          <Typography variant={image.text.variant}>
                            {image.text.content}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: component != "form" ? 12 : 4 }}>
                  <Paper
                    variant="contained"
                    sx={{
                      ...modalStyle,
                      height:
                        component != "form"
                          ? "100%"
                          : {
                              xs: "calc(100vh - 170px)",
                              md: componentName == "create" ? "550px" : "500px",
                            },
                      m: 0,
                      p: ["modal"].includes(component)
                        ? "10px"
                        : { xs: "0 16px", md: "0px 24px" },
                      background: "transparent",
                    }}
                    elevation={["view", "modal"].includes(component) ? 0 : 1}
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
                              flexWrap: "nowrap",
                              justifyContent: "space-between",
                              flexDirection: "column",
                            }
                          : {}),
                      }}
                    >
                      {["form", "view"].includes(component) && backAction ? (
                        <Grid size={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h5">{titulo}</Typography>
                        </Grid>
                      ) : null}
                      <Grid size={12}>{children}</Grid>{" "}
                      {component == "form" && (
                        <>
                          <Grid size={12}>
                            <Grid container>
                              <Grid size={12}>
                                <Button
                                  fullWidth
                                  size="large"
                                  disableElevation
                                  onClick={() => onAction && onAction()}
                                  variant="contained"
                                  color={color}
                                  disabled={disabledAction || loadingButton}
                                  type="submit"
                                  sx={{
                                    height: 45,
                                    background:
                                      "linear-gradient(to right, #2C69D1, #0ABCF9)",
                                    ...buttonStyle,
                                  }}
                                >
                                  {loadingButton ? "Carregando..." : actionText}
                                </Button>
                              </Grid>{" "}
                              {buttons[0]?.type == "google" && (
                                <>
                                  {" "}
                                  <Grid size={12}>
                                    {" "}
                                    <Divider
                                      textAlign="center"
                                      sx={{ m: "5px 0" }}
                                    >
                                      ou
                                    </Divider>
                                  </Grid>
                                  <Grid size={12}>
                                    <GoogleLoginButton
                                      text={buttons[0]?.text || "signin_with"}
                                      onError={(e) => buttons[0]?.action(e)}
                                      onSuccess={(e) => buttons[0]?.action(e)}
                                    />
                                    {/* <GoogleLogin
                                      width="100%"
                                      disable
                                      size="large"
                                      type="dark"
                                      shape="pill"
                                      text={buttons[0]?.text || "signin_with"}
                                      onSuccess={(e) => buttons[0]?.action(e)}
                                      onError={(e) => buttons[0]?.action(e)}
                                      buttonText="Login"
                                    /> */}
                                  </Grid>
                                </>
                              )}
                            </Grid>
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
                                variant="outlined"
                              >
                                {submitText}
                              </Button>
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </DialogContent>{" "}
          {component != "form" && (buttons.length || onAction || onSubmit) ? (
            <DialogActions
              disableSpacing={{
                xs: ["form", "view"].includes(component) || fullScreen,
                md: false,
              }}
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "end",
                flexWrap: { xs: "wrap", md: "nowrap" },
                gap: 1,
                m: 1,
              }}
            >
              {submitText && (
                <Button
                  disableElevation
                  sx={{
                    width: { xs: "100%", md: "auto" },
                  }}
                  onClick={onSubmit}
                  variant="outlined"
                  size="large"
                >
                  {submitText}
                </Button>
              )}
              {onAction && (
                <Button
                  size="large"
                  sx={{
                    width: { xs: "100%", md: "auto" },
                    order: { md: 999, xs: 0 },
                  }}
                  disableElevation
                  onClick={() => onAction()}
                  variant="contained"
                  color={color}
                  disabled={disabledAction || loadingButton}
                >
                  {loadingButton ? "Enviando..." : actionText}
                </Button>
              )}
              {buttons &&
                buttons.map((button, index) => (
                  <Button
                    size="large"
                    color={button.color || "primary"}
                    disableElevation
                    disabled={button.disabled}
                    onClick={button.action}
                    icon={button.icon}
                    variant={button.variant ? button.variant : "outlined"}
                    sx={{
                      ...(button.sx || {}),
                      ...buttonStyle,
                      ...((["form", "view"].includes(component) ||
                        fullScreen) &&
                      isMobile
                        ? { width: "100%" }
                        : {}),
                      order: { md: index, xs: index + 1 },
                    }}
                  >
                    {button.titulo}
                  </Button>
                ))}
              {submitText && (
                <Button
                  disableElevation
                  onClick={onSubmit}
                  variant="outlined"
                  sx={{
                    display: { xs: "none" },
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  {submitText}
                </Button>
              )}

              {onAction && (
                <Button
                  disableElevation
                  sx={{
                    display: { xs: "none" },
                    width: { xs: "100%", md: "auto" },
                  }}
                  onClick={() => onAction()}
                  variant="contained"
                  color={color}
                  disabled={disabledAction || loadingButton}
                >
                  {actionText}
                </Button>
              )}
            </DialogActions>
          ) : (
            <DialogActions>{dialogAction}</DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Modal;
