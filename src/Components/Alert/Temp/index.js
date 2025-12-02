import { Snackbar, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const Alerta = ({ alert, setAlert }) => {
  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const isError =
    alert.message?.toLowerCase().includes("erro") ||
    alert.message?.toLowerCase().includes("não");

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={alert.open}
      onClose={handleClose}
      autoHideDuration={5000}
      message={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isError && (
            <WarningAmberRoundedIcon
              color="warning"
              sx={{ fontSize: "25px" }}
            />
          )}
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
            {alert.message}
          </Typography>
        </Box>
      }
      action={
        <IconButton
          size="small"
          aria-label="fechar"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      sx={{
        "& .MuiSnackbarContent-root": {
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "500",
          boxShadow: "0px 4px 12px rgba(256,256,256,0.01)",
        },
      }}
    />
  );
};

export default Alerta;
