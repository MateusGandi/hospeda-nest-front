import { Snackbar } from "@mui/material";

const Alerta = ({ alert, setAlert }) => {
  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={alert.open}
      message={alert.message}
      onClose={handleClose}
      autoHideDuration={5000}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "#353535",
          color: "#fff",
          borderRadius: "10px",
          position: { xs: "fixed", sm: "relative" },
          top: { xs: "70px" },
          left: { xs: "10px" },
          right: { xs: "10px" },
        },
      }}
    />
  );
};

export default Alerta;
