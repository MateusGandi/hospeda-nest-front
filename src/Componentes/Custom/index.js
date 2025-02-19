import { TextField, MenuItem, InputAdornment } from "@mui/material";
import { styled } from "@mui/system";

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
    "&::placeholder": {
      opacity: 1, // Mantém o placeholder visível
      color: "rgba(255,255,255,0.7)",
    },
  },
});

export function CustomInput({
  placeholder,
  startIcon,
  endIcon,
  label,
  ...props
}) {
  return (
    <CustomTextField
      {...props}
      variant="outlined"
      label={label}
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
}

export function CustomSelect({
  options,
  placeholder,
  startIcon,
  endIcon,
  children,
  ...props
}) {
  return (
    <CustomTextField
      {...props}
      select
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
    >
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}
      {options &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      {children}
    </CustomTextField>
  );
}
