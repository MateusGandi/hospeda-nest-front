import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { height, styled } from "@mui/system";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format, isValid, parse, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import Calendario from "../Calendar/Simple";
import { formatDate } from "../Funcoes";
import Modal from "../Modal";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "../../Assets/Login/google-icon.svg";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 8,
    border: "none",
    color: "#fff !important",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    left: "-10px",
    transform: "translate(14px, -23px) scale(1)", // Mantém o label sempre acima
  },
  "& .MuiInputLabel-shrink": {
    color: "#fff",
    transform: "translate(14px, -23px) scale(1)", // Evita movimentação do label
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    height: "15px",
    "&::placeholder": {
      opacity: 1, // Mantém o placeholder visível
      color: "rgba(255,255,255,0.7)",
    },
  },
});

export const CustomInput = ({
  placeholder,
  startIcon,
  endIcon,
  label,
  multiline,
  minRows,
  ...props
}) => {
  return (
    <CustomTextField
      {...props}
      variant="outlined"
      label={label}
      minRows={minRows}
      multiline={multiline}
      placeholder={placeholder || label}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
    />
  );
};

export const CustomSelect = ({
  options,
  startIcon,
  endIcon,
  children,
  label,
  placeholder,
  ...props
}) => {
  return (
    <CustomTextField
      {...props}
      select
      variant="outlined"
      label={label} // Mantendo o label vindo da props
      InputLabelProps={{ shrink: true }}
      displayEmpty
      SelectProps={{
        displayEmpty: true, // Permite exibir o placeholder
        renderValue: (selected) =>
          selected
            ? options.find((opt) => opt.value === selected)?.label
            : placeholder, // Mostra o placeholder se nada estiver selecionado
        sx: {
          height: "47px", // Ajusta a altura do Select (área onde o valor selecionado é exibido)
        },
      }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
    >
      {options &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}

      {children}
    </CustomTextField>
  );
};

export default function CustomDateInput({ value, onChange, label, ...props }) {
  const [dados, _setDados] = useState({
    open: false,
    dataSelecionada: null,
    dataFormatada: "",
    dataEscrita: "",
  });
  const setDados = (prop, value) =>
    _setDados((prev) => ({ ...prev, [prop]: value }));

  useEffect(() => {
    setDados("dataSelecionada", value);
  }, [value]);

  const handleTextChange = (e) => {
    try {
      if (e.target.value.length > 10) return;

      const parsed = parse(e.target.value, "dd/MM/yyyy", new Date(), {
        locale: ptBR,
      });

      if (isValid(parsed) && e.target.value.toString().length == 10) {
        _setDados((prev) => ({
          ...prev,
          dataSelecionada: parsed,
          dataFormatada: format(parsed, "dd/MM/yyyy"),
        }));

        return onChange(parsed, true);
      } else {
        setDados("dataFormatada", formatDate(e.target.value));
        onChange(formatDate(e.target.value), false);
      }
    } catch (error) {
      alert("Erro ao formatar a data: " + error.message);
    }
  };

  // Ao selecionar no calendário
  const handleDateSelect = (data) => {
    _setDados((prev) => ({
      ...prev,
      open: false,
      dataSelecionada: data,
      dataFormatada: format(data, "dd/MM/yyyy"),
    }));
    onChange(data, true);
  };

  return (
    <>
      <CustomInput
        fullWidth
        placeholder={"dd/mm/aaaa"}
        label={label}
        value={dados.dataFormatada || format(value, "dd/MM/yyyy")}
        onChange={handleTextChange}
        startIcon={
          <IconButton onClick={() => setDados("open", true)}>
            <CalendarTodayIcon />
          </IconButton>
        }
        {...props}
      />

      <Modal
        open={dados.open}
        onClose={() => setDados("open", false)}
        maxWidth="xs"
        titulo="Selecione uma data"
      >
        <Calendario
          onSelect={handleDateSelect}
          data={dados.dataSelecionada}
          all={true}
        />
      </Modal>
    </>
  );
}

export const LoadingBox = ({ message, variant = "body1" }) => {
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {" "}
      <CircularProgress size={25} />
      <Typography variant={variant}>{message}</Typography>
    </Box>
  );
};

export const GoogleLoginButton = ({ onError, onSuccess, text }) => {
  const login = useGoogleLogin({
    onSuccess: onError,
    onError: onSuccess,
  });

  return (
    <Button
      onClick={login}
      fullWidth
      color="terciary"
      variant="outlined"
      size="large"
      sx={{
        borderRadius: "50px",
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        height: 45,
        fontWeight: 500,
      }}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        style={{ width: 20, height: 20 }}
      />
      Fazer login com Google
    </Button>
  );
};
