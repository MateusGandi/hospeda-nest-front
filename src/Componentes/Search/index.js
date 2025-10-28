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
  Grid2,
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
  variant = "contained",
  size = "large",
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [uniqueFilterValues, setUniqueFilterValues] = useState({});
  const textFieldRef = useRef(null);

  useEffect(() => {
    // Extrai os valores únicos para cada propriedade de filtro
    const filterValues = {};
    propFilters.forEach(({ key: prop }) => {
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
        propFilters.some(({ key: prop }) => element[prop] === filter)
      );

      return matchesSearch && matchesFilters;
    });

    setElements(filteredElements);
  }, [searchValue, selectedFilters, initial]);

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
  const styles = (prop) => {
    return {
      contained: {
        background: "#333",
      },
      outlined: {
        border: "1.7px solid #484848",
      },
    }[prop];
  };

  return (
    <Box sx={{ width: "100%" }} onBlur={handleBlur} tabIndex={-1}>
      <Grid2 container spacing={2}>
        {children}
        <Grid2 size={fullWidth ? 12 : { xs: 10, md: 10.8 }}>
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
                  <SearchIcon fontSize="medium" sx={{ color: "#fff", mr: 1 }} />
                </>
              ),
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                ...styles(variant),
                ...(size === "large" ? { p: "5px 10px" } : { px: "10px" }),
                borderRadius: "100px",
              },
            }}
          />
        </Grid2>
      </Grid2>
      <Collapse
        in={filtersVisible && !!uniqueFilterValues[propFilters[0]?.key]?.length}
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
            {propFilters.map(({ key: prop, label, value }) => (
              <Chip
                key={`${prop}-${label}`}
                label={label}
                onClick={() => toggleFilterSelection(value)}
                color={selectedFilters.includes(value) ? "primary" : "default"}
                sx={{ marginRight: 1, marginBottom: 1 }}
                clickable
              />
            ))}
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
