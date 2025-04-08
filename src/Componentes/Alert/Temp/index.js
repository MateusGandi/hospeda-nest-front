import { Snackbar } from "@mui/material";

const Alerta = ({ alert, setAlert }) => {
  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={alert.open}
      message={alert.message}
      onClose={handleClose}
      autoHideDuration={5000}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "#353535",
          color: "#fff",
          borderRadius: "10px",
        },
      }}
    />
  );
};

export default Alerta;
