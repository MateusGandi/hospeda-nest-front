import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import apiService from "../Api/axios";
import SearchIcon from "@mui/icons-material/Search";

// Estilizando o TextField
const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 50,
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
    marginLeft: "10px",
    "&::placeholder": {
      opacity: 1, // Mantém o placeholder visível
      color: "rgba(255,255,255,0.7)",
    },
  },
});

export default function FreeSolo({
  url,
  searchField,
  placeholder,
  label,
  setItemSelecionado,
  itemSelecionado,
  variant = "outlined",
  startIcon,
  endIcon,
}) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Efeito para carregar o valor inicial se um item estiver selecionado
  useEffect(() => {
    if (!itemSelecionado) {
      setInputValue("");
    }
    if (itemSelecionado) {
      setInputValue(itemSelecionado.email);
    }
  }, [itemSelecionado]);

  // Função para buscar dados da API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.query(
        "GET",
        `${url}?${searchField}=${inputValue}`
      );
      const data = await response;
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para melhorar a performance da busca
  useEffect(() => {
    if (inputValue.length < 1) {
      setOptions([]);
      return;
    }

    const debounceTimeout = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimeout);
  }, [inputValue, url, searchField]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.email} // Exibe o email nas opções
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue); // Atualiza o valor de input
        }}
        onChange={(event, newValue) => {
          setItemSelecionado(newValue); // Seleciona o item
        }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            variant="outlined"
            label={label}
            placeholder={placeholder}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: startIcon ? (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              ) : null,
              endAdornment: endIcon ? (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              ) : (
                <InputAdornment position="start">
                  {" "}
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}
