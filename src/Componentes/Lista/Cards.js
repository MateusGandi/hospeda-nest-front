import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const Cards = ({
  items,
  onSelect,
  selectedItems = [],
  multipleSelect = false,
}) => {
  const [selected, setSelected] = useState(selectedItems);

  const handleSelect = (id) => {
    let updatedSelection;
    if (multipleSelect) {
      updatedSelection = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id];
    } else {
      updatedSelection = selected.includes(id) ? [] : [id];
    }

    setSelected(updatedSelection);
    if (onSelect) onSelect(updatedSelection);
  };

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card
            variant="outlined"
            onClick={() => handleSelect(item.id)}
            sx={{
              display: "flex",
              alignItems: "start",
              cursor: "pointer",
              borderRadius: "10px",
              color: "#000",
              ...(selected.includes(item.id)
                ? { border: "2px solid blue" }
                : {}),
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 100 }}
              image={item.imagem}
              alt={item.titulo}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{item.titulo}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitulo}
              </Typography>
            </CardContent>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                item.onDelete(item.id);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
