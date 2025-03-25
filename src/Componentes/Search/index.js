import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Chip,
  IconButton,
  Box,
  Collapse,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

const SearchBarWithFilters = ({
  initial,
  elements,
  setElements,
  label,
  propFilters = [],
  searchValue,
  setSearchValue,
  fullWidth = true,
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [uniqueFilterValues, setUniqueFilterValues] = useState({});
  const textFieldRef = useRef(null);

  useEffect(() => {
    // Extrai os valores únicos para cada propriedade de filtro
    const filterValues = {};
    propFilters.forEach((prop) => {
      const uniqueValues = Array.from(
        new Set(elements.map((element) => element[prop]))
      ).filter((value) => value != null); // Filtra valores nulos ou indefinidos
      filterValues[prop] = uniqueValues;
    });
    setUniqueFilterValues(filterValues);
  }, [elements, propFilters]);

  useEffect(() => {
    // Aplica os filtros e a busca
    const filteredElements = initial.filter((element) => {
      // Verifica se o elemento corresponde ao valor de busca
      const matchesSearch = searchValue
        ? Object.values(element).some((value) =>
            String(value).toLowerCase().includes(searchValue.toLowerCase())
          )
        : true;

      // Verifica se o elemento corresponde aos filtros selecionados
      const matchesFilters = selectedFilters.every((filter) =>
        propFilters.some((prop) => element[prop] === filter)
      );

      return matchesSearch && matchesFilters;
    });
    setElements(filteredElements);
  }, [searchValue, selectedFilters]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFocus = () => {
    setFiltersVisible(true);
  };

  const handleBlur = (event) => {
    if (
      !event.currentTarget.contains(event.relatedTarget) &&
      selectedFilters.length === 0
    ) {
      setFiltersVisible(false);
    }
  };

  const toggleFilterSelection = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleCloseFilters = () => {
    setFiltersVisible(false);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedFilters([]);
  };

  return (
    <Box
      sx={{ width: "100%", ...(fullWidth ? {} : { maxWidth: "500px" }) }}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={label}
        size="small"
        value={searchValue}
        onFocus={handleFocus}
        onChange={handleInputChange}
        inputRef={textFieldRef}
        InputProps={{
          endAdornment: (
            <>
              {" "}
              {searchValue.length > 0 && (
                <IconButton onClick={handleClearFilters}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
              <SearchIcon fontSize="large" sx={{ color: "#626262" }} />
            </>
          ),
          sx: {
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            p: "5px 10px",
            background: "#363636",
            borderRadius: "100px",
          },
        }}
      />

      <Collapse
        in={filtersVisible && !!uniqueFilterValues[propFilters[0]]?.length}
      >
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            background: "#363636",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Mais filtros
            </Typography>
            {propFilters.map((prop) =>
              uniqueFilterValues[prop]?.map((value) => (
                <Chip
                  key={`${prop}-${value}`}
                  label={value}
                  onClick={() => toggleFilterSelection(value)}
                  color={
                    selectedFilters.includes(value) ? "warning" : "default"
                  }
                  sx={{ marginRight: 1, marginBottom: 1 }}
                  clickable
                />
              ))
            )}
          </Box>

          <Box>
            <IconButton onClick={handleCloseFilters}>
              <ExpandLessRoundedIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default SearchBarWithFilters;
