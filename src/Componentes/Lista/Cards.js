import React, { useState } from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import notFounImage from "../../Assets/vt.png";

export const Cards = ({
  items,
  onSelect,
  onEdit,
  onDelete,
  label,
  onUpload,
  selectionMode = "onEdit", // "onTap" ou "onEdit"
  keys,
}) => {
  const [previews, setPreviews] = useState({}); // Estado para armazenar imagens carregadas

  const handleSelect = (id) => {
    if (selectionMode === "onTap" && onSelect) {
      onSelect(id);
    }
  };

  const handleUpload = (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((prev) => ({ ...prev, [id]: reader.result })); // Atualiza a pré-visualização da imagem
      if (onUpload) onUpload(event, id);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: { xs: "center", md: "start" }, flexWrap: "wrap" }}
    >
      {items.map((item) => (
        <Grid size={{ xs: 11, sm: 6, md: 4 }} key={item.id}>
          <Card
            variant="outlined"
            onClick={() => handleSelect(item.id)}
            sx={{
              position: "relative",
              borderRadius: "10px",
              overflow: "hidden",
              width: "100%",
              aspectRatio: "1 / 1", // Mantém o card sempre quadrado
            }}
          >
            {/* Upload ao clicar na imagem */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id={`upload-${item.id}`}
              onChange={(e) => handleUpload(e, item.id)}
              disabled={selectionMode === "onTap"}
            />
            <label
              htmlFor={!item.disabled ? `upload-${item.id}` : ""}
              style={{ position: "relative" }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "60%",
                  objectFit: "cover",
                  cursor: selectionMode === "onTap" ? "default" : "pointer",
                }}
                image={
                  previews[item.id]
                    ? previews[item.id]
                    : item?.imagem?.includes("undefined") ||
                      item?.imagem?.includes("null")
                    ? notFounImage
                    : item.imagem
                } // Mostra a imagem carregada ou a original
                alt={item.titulo}
              />
              <Typography
                sx={{
                  position: "absolute",
                  top: "80%",
                  width: "100%",
                  textAlign: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                variant="body1"
              >
                <span
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "2px 8px",
                    borderRadius: "5px",
                  }}
                >
                  {!item.disabled
                    ? "Clique para mudar a imagem"
                    : "Salve antes de adicionar imagem"}
                </span>
              </Typography>
            </label>

            <CardContent sx={{ p: 1 }}>
              {keys ? (
                keys.map((key) => (
                  <Typography variant="body1" sx={{ width: "100%", m: 0 }}>
                    {`${key.label ? `${key.label} ` : ""}${
                      key.format ? key.format(item[key.value]) : item[key.value]
                    }`}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1">{item.titulo}</Typography>
              )}
            </CardContent>

            {/* Botões no canto superior direito */}
            {onDelete && (
              <Tooltip title="Excluir">
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
            {selectionMode === "onEdit" && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  borderRadius: "10px !important",
                  p: "5px 10px",
                  background: "rgba(0,0,0,0.3)",
                  ":hover": {
                    background: "rgba(0,0,0,0.5)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Typography variant="body2">Editar {label}</Typography>
              </IconButton>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
