import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Modal from "../Modal/Simple";
import { Rows } from "../Lista/Rows";
import { Badge, Button, Tooltip } from "@mui/material";

const Filter = ({
  options = {}, //array de objetos: key/value
  filter,
  setFilter,
  title,
  modalTitle,
  toltipText,
  icon,
  variant = "icon", // icon ou button
}) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (value) => {
    setFilter(value);
    setOpen(false);
  };

  return (
    <>
      {variant == "icon" ? (
        <Badge
          color="warning"
          badgeContent="1"
          invisible={
            !filter ||
            (Array.isArray(filter)
              ? filter.length === 0 || filter.some((i) => !i)
              : !filter.valor)
          }
        >
          <Tooltip title={toltipText || "Filtrar"}>
            <IconButton onClick={() => setOpen(true)} color="terciary">
              {icon ? icon : <FilterAltIcon />}
            </IconButton>
          </Tooltip>
        </Badge>
      ) : (
        <Button
          variant="outlined"
          disableElevation
          size="large"
          sx={{ px: 2, minWidth: 15 * title?.length }}
          onClick={() => setOpen(true)}
        >
          {title}
        </Button>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        titulo={modalTitle || title || "Selecione um filtro"}
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
