import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function FreeSoloCreateOption({
  options,
  setValue,
  value,
  label,
  variant = "outlined",
  placeholder,
  disabled = false,
}) {
  return (
    <Autocomplete
      sx={{ width: "100%" }}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
            created: true, // Adiciona a propriedade created com o valor true
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Adicionar "${inputValue}"`,
            created: true, // Adiciona a propriedade created com o valor true
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option, index) => (
        <li key={index} {...props}>
          {option.title}
        </li>
      )}
      freeSolo
      renderInput={(params) => (
        <TextField
          disabled={disabled}
          variant={variant}
          {...params}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
