import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Modal from "../Modal/Simple";
import { Rows } from "../Lista/Rows";
import { Tooltip } from "@mui/material";

const Filter = ({
  options = {}, //array de objetos: key/value
  filter,
  setFilter,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (value) => {
    setFilter(value);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Filtrar">
        <IconButton onClick={() => setOpen(true)} color="terciary">
          <FilterAltIcon />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        titulo={title || "Selecione um filtro"}
        maxWidth="xs"
      >
        <Rows
          items={Object.keys(options).map((key, index) => ({
            titulo: options[key],
            valor: key,
            id: index,
          }))}
          onSelect={handleSelect}
          selectedItems={[...(Array.isArray(filter) ? filter : [filter])]}
        />
      </Modal>
    </>
  );
};

export default Filter;
