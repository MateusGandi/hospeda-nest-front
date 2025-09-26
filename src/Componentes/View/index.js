import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import LoadingImagePulse from "../Effects/loading";
import LogoIcon from "../../Assets/Login/tonsus_logo_white.png";
import { isMobile } from "../Funcoes";

const View = ({
  open,
  onClose,

  onAction,
  actionText = "Confirmar",

  onSubmit,
  submitText,

  children,
  titulo,

  maxWidth,
  color = "primary",
  backAction,
  loading = false,
  buttons = [], //{titulo, action, color}
  buttonStyle,
  modalStyle,
  loadingButton = false,
  sx,
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
    <Grid
      container
      sx={{
        minHeight: "calc(100vh - 60px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* <Grid size={12} sx={{ p: 2 }}>
        <Container maxWidth={maxWidth}>
          {titulo && (
            <Box className="justify-between">
              {backAction ? (
                <Button
                  disableElevation
                  variant="contained"
                  onClick={backAction.action}
                  size="large"
                  sx={{
                    background: "transparent",
                    color: "#fff",
                  }}
                  startIcon={<ArrowBackIcon />}
                >
                  {backAction.titulo}
                </Button>
              ) : (
                <div></div>
              )}
              {titulo && <Typography variant="h6">{titulo}</Typography>}
              <p></p>
            </Box>
          )}
        </Container>
      </Grid> */}
      <Grid
        size={12}
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: 1,
        }}
      >
        <Container
          maxWidth={maxWidth}
          PaperProps={{
            sx: {
              ...sx,
              borderRadius: 0,
              position: "relative",
              overflowY: "scroll",
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (onSubmit) onSubmit();
              else if (onAction) onAction();
            }
          }}
          component="form"
        >
          <Grid container>
            {loading ? (
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "75vh",
                  zIndex: 1,
                }}
              >
                <LoadingImagePulse src={LogoIcon} />
              </Grid>
            ) : (
              <>
                <Grid size={12}>
                  <Paper
                    variant="contained"
                    sx={{
                      ...modalStyle,
                      height: "100%",
                      m: 0,
                      p: { xs: "0 16px", md: "0px 24px" },
                      background: "transparent",
                    }}
                    elevation={0}
                  >
                    <Grid container spacing={2}>
                      {backAction ? (
                        <Grid size={12} sx={{ textAlign: "center" }}>
                          <Typography variant="h5">{titulo}</Typography>
                        </Grid>
                      ) : null}
                      <Grid size={12}>{children}</Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Grid>
      <Grid size={12}>
        <Grid container>
          {buttons.length || onAction || onSubmit ? (
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "end",
                m: 1,
                p: 1,
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
                  disabled={loadingButton}
                  disableElevation
                  onClick={() => onAction()}
                  variant="contained"
                  color={color}
                >
                  {loadingButton ? "Carregando..." : actionText}
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
                      ...buttonStyle,
                      ...(isMobile ? { width: "100%" } : {}),
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
                >
                  {actionText}
                </Button>
              )}
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default View;
