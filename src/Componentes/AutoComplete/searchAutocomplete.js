import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import apiService from "../Api/axios";
import { Box, TextField, styled, Popper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const CustomPopper = styled(Popper)({
  "& .MuiPaper-root": {
    marginTop: 10,
    backgroundColor: "#303030",
  },
});

export default function FreeSolo({
  url,
  fields,
  label,
  placeholder,
  searchField,
  setItemSelecionado,
  itemSelecionado,
  minDigitsForSearch = 1, // Valor padrão: 6 dígitos
  disabled = false,
}) {
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Função para contar dígitos numéricos na string
  const countDigits = (str) => {
    return str.match(/\d/g)?.length || 0;
  };

  // Função para verificar se deve fazer a busca
  const shouldSearch = (value) => {
    if (!value.trim()) return false;

    const digitCount = countDigits(value);
    const hasOnlyNumbers = /^\d+$/.test(value);

    // Se for apenas números, verifica se tem dígitos suficientes
    if (hasOnlyNumbers) {
      return digitCount >= minDigitsForSearch;
    }

    // Se contém letras, permite a busca independente dos números
    return true;
  };

  const fetchData = async () => {
    if (!shouldSearch(inputValue)) {
      setOptions([]);

      return;
    }

    setLoading(true);
    let finalUrl = "";
    if (searchField) {
      finalUrl = `${url}?${searchField}=${inputValue}`;
    } else if (url.includes("XXXX")) {
      finalUrl = url.replaceAll("XXXX", inputValue);
    } else {
      finalUrl = `${url}/${inputValue}`;
    }

    try {
      const response = await apiService.query("GET", finalUrl);
      const data = response.map((item) => ({
        ...item,
        title: fields.map((key) => item[key]).join(" - "),
      }));
      setOptions(data);
    } catch (error) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (inputValue.trim() !== "") {
      const timer = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id="free-solo-demo"
      freeSolo
      value={itemSelecionado?.title || ""}
      options={
        options.length ? options : [{ title: "Nenhum resultado encontrado" }]
      }
      getOptionDisabled={(option) =>
        option.title.includes("Nenhum resultado encontrado")
      }
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.title
      }
      isOptionEqualToValue={(option, value) => option.title === value?.title}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setItemSelecionado({ title: newValue });
        } else if (newValue && newValue.title) {
          setItemSelecionado(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      filterOptions={(options, state) => options}
      fullWidth
      loading={loading}
      PopperComponent={CustomPopper}
      renderOption={(props, option) => (
        <li {...props} key={option.id || option.title}>
          {option.title}
        </li>
      )}
      disabled={disabled}
      renderInput={(params) => (
        <Box
          sx={{
            position: "relative",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50px",
          }}
        >
          <TextField
            {...params}
            variant="outlined"
            placeholder={placeholder}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-input": {
                padding: "5px 10px !important",
              },
              "& .MuiAutocomplete-endAdornment": {
                paddingRight: "5px !important",
              },
            }}
          />
          {!inputValue.length && !itemSelecionado && (
            <SearchIcon
              fontSize="medium"
              sx={{ position: "absolute", right: "13px", top: "13px" }}
            />
          )}
        </Box>
      )}
    />
  );
}
