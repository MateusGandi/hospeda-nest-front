import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import apiService from "../Api/axios";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  styled,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { formatPhone } from "../Funcoes";

export default function FreeSolo({
  url,
  fields,
  placeholder,
  searchField,
  setItemSelecionado,
  itemSelecionado,
}) {
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.query(
        "GET",
        searchField
          ? `${url}?${searchField}=${inputValue}`
          : `${url}/${inputValue}`
      );
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
    fetchData();
  }, [inputValue]);

  return (
    <Autocomplete
      id="free-solo-demo"
      freeSolo
      value={itemSelecionado?.title}
      options={options.map((option) => option.title)}
      onChange={(event, newValue) => {
        const item = options.find((option) => option.title == newValue);
        setItemSelecionado(item);
      }}
      fullWidth
      loading={loading}
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
            onInput={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-input": {
                padding: "5px 10px !important", // Garantir que o padding seja aplicado
              },
              "& .MuiAutocomplete-endAdornment": {
                paddingRight: "5px !important",
              },
            }}
          />
          {!inputValue.length && (
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
