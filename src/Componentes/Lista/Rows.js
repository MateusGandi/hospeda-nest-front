import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Card, CardActionArea, Typography } from "@mui/material";

export const Rows = ({
  items = [],
  onSelect,
  selectedItems = [],
  multipleSelect = false,
  onDelete,
  oneTapMode, //não persiste e seleção, apenas clique
  sx,
  unSelectMode = false,
  actions,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(selectedItems);

  const handleSelect = (item) => {
    let updatedSelection;

    if (multipleSelect) {
      // Remove o item se já estiver selecionado, ou adiciona se não estiver
      updatedSelection = selected.some((op) => op.id === item.id)
        ? selected.filter((op) => op.id !== item.id)
        : [...selected, item];
    } else {
      // Alterna entre seleção única ou nenhuma
      updatedSelection =
        unSelectMode && selected?.some((op) => op.id === item.id) ? [] : [item];
    }
    if (!oneTapMode) setSelected(updatedSelection);

    // Callback com array para múltiplos ou objeto único para simples
    if (onSelect) onSelect(multipleSelect ? updatedSelection : item);
  };

  return (
    <List sx={{ m: 0, p: 0 }}>
      {items.map((item, index) => (
        <>
          {" "}
          <CardActionArea
            disabled={disabled}
            sx={{ borderRadius: "10px !important", margin: "10px 0" }}
          >
            <Card
              onClick={() => (item.action ? item.action() : handleSelect(item))}
              elevation={0}
              sx={{
                ...(selected.some((opcao) => opcao.id === item.id)
                  ? {
                      border: "1px solid rgb(134, 134, 134)",
                      background: "rgba(256,256,256,0.05)",
                    }
                  : { border: "1px solid transparent" }),
              }}
            >
              <ListItem
                key={item.id}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  ...sx,
                }}
              >
                {(item.icon || item.imagem) && (
                  <ListItemAvatar>
                    {" "}
                    <Avatar
                      src={item.imagem}
                      sx={{
                        bgcolor: "transparent",
                        color: "#fff",
                        width: 50,
                        height: 50,
                      }}
                    >
                      {item.icon}
                    </Avatar>{" "}
                  </ListItemAvatar>
                )}

                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "18px" }}>
                      {item.titulo}
                    </Typography>
                  }
                  secondary={item.subtitulo}
                />
                {actions &&
                  actions.map((item) =>
                    !item.icon ? (
                      <Button
                        color={item.color || "primary"}
                        disableElevation
                        onClick={(e) => {
                          e.stopPropagation();
                          item.action(item.id);
                        }}
                        variant="outlined"
                        sx={{
                          m: "0 5px",
                          border: "1px solid #484848",
                        }}
                      >
                        {item.titulo}
                      </Button>
                    ) : (
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.action(item.id);
                        }}
                        sx={{
                          m: "0 5px",
                        }}
                      >
                        {item.icon}
                      </IconButton>
                    )
                  )}

                {onDelete && !item.noDelete && (
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation(); // Impede a seleção ao clicar no botão
                      onDelete(item.id);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </ListItem>
            </Card>
          </CardActionArea>
        </>
      ))}
    </List>
  );
};
