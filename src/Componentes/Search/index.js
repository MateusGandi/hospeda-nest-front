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
import { Close } from "@mui/icons-material";

const SearchBarWithFilters = ({
  initial,
  elements,
  setElements,
  label,
  propFilters = [],
  searchValue,
  setSearchValue,
  fullWidth = true,
  aditionalFilters = null,
  aditionalFiltersFocus = false,
  children,
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
  }, [elements]);

  useEffect(() => {
    const filteredElements = initial.filter((element) => {
      const matchesSearch = !searchValue
        ? true
        : Object.values(element).some((value) =>
            String(value).toLowerCase().includes(searchValue.toLowerCase())
          );

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

  useEffect(() => {
    if (aditionalFiltersFocus) {
      setFiltersVisible(true);
    }
  }, [aditionalFiltersFocus]);

  const handleBlur = (event) => {
    if (
      !event.currentTarget.contains(event.relatedTarget) &&
      selectedFilters.length === 0 &&
      !aditionalFiltersFocus
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
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "start",
          justifyContent: "end",
          flexWrap: "wrap",
        }}
      >
        {children}

        <TextField
          variant="outlined"
          placeholder={label}
          size="small"
          value={searchValue}
          onFocus={handleFocus}
          onChange={handleInputChange}
          inputRef={textFieldRef}
          fullWidth
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
      </Box>
      <Collapse
        in={filtersVisible && !!uniqueFilterValues[propFilters[0]]?.length}
      >
        <Paper
          elevation={0}
          sx={{
            mt: 1,
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
            {aditionalFilters ? aditionalFilters : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "nowrap",
            }}
          >
            {" "}
            {!!selectedFilters.length && (
              <IconButton onClick={() => setSelectedFilters([])}>
                <Close sx={{ color: "#fff" }} />
              </IconButton>
            )}
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
