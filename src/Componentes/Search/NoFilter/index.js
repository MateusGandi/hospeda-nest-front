import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Chip,
  IconButton,
  Box,
  Collapse,
  Paper,
  Typography,
  Grid2,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { Close } from "@mui/icons-material";

const SearchBarWithFilters = ({
  label,
  propFilters = [],
  fullWidth = true,
  aditionalFilters = null,
  aditionalFiltersFocus = false,
  children,
  variant = "contained",
  size = "large",
  onChange,
}) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ⭐ Agora filtros são sempre objetos
  const [selectedFilters, setSelectedFilters] = useState([]);

  const textFieldRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onChange?.("search", value);
  };

  const handleFocus = () => setFiltersVisible(true);

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

  // 🔥 Função correta para trabalhar array de OBJETOS
  const toggleFilterSelection = (filterObj) => {
    const exists = selectedFilters.some(
      (f) => f.key === filterObj.key && f.value === filterObj.value
    );

    let updated;

    if (exists) {
      updated = selectedFilters.filter(
        (f) => !(f.key === filterObj.key && f.value === filterObj.value)
      );
    } else {
      updated = [...selectedFilters, filterObj];
    }

    setSelectedFilters(updated);
    onChange?.("filter", updated);
  };

  const handleCloseFilters = () => setFiltersVisible(false);

  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedFilters([]);
    onChange?.("search", "");
    onChange?.("filter", []);
  };

  const styles = (prop) => {
    return {
      contained: { background: "#333" },
      outlined: { border: "1.7px solid #484848" },
    }[prop];
  };

  const isFilterActive = (filterObj) =>
    selectedFilters.some(
      (f) => f.key === filterObj.key && f.value === filterObj.value
    );

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

      <Collapse in={filtersVisible && propFilters.length > 0}>
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

            {propFilters.map((filter) => (
              <Chip
                key={`${filter.key}-${filter.value}`}
                label={filter.label}
                onClick={() => toggleFilterSelection(filter)}
                color={isFilterActive(filter) ? "primary" : "default"}
                sx={{ marginRight: 1, marginBottom: 1 }}
                clickable
              />
            ))}

            {aditionalFilters}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "nowrap",
            }}
          >
            {!!selectedFilters.length && (
              <IconButton
                onClick={() => {
                  setSelectedFilters([]);
                  onChange?.("filter", []);
                  setFiltersVisible(false);
                }}
              >
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
