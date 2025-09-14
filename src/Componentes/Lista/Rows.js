import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import notFounImage from "../../Assets/vt.png";

export const Rows = ({
  items = [],
  onSelect,
  selectedItems = [],
  multipleSelect = false,
  onDelete,
  oneTapMode, // não persiste a seleção, apenas clique
  sx,
  unSelectMode = false,
  styleSelect,
  actions,
  disabled = false,
  disableGap = false,
  collapse = false,
  distribution = items.length ?? 1,
  focusInItem = true,
  checkmode = true,
  spacing = 1,
  disableRipple = false,
}) => {
  const [selected, setSelected] = useState(selectedItems ?? []);

  const handleSelect = (item) => {
    let updatedSelection;

    if (multipleSelect) {
      updatedSelection = selected.some((op) => op.id === item.id)
        ? selected.filter((op) => op.id !== item.id)
        : [...selected, item];
    } else {
      updatedSelection =
        unSelectMode &&
        Array.isArray(selected) &&
        selected?.some((op) => op.id === item.id)
          ? []
          : [item];
    }

    if (!oneTapMode) setSelected(updatedSelection);

    if (onSelect) onSelect(multipleSelect ? updatedSelection : item);
  };

  return (
    <List
      sx={{
        m: 0,
        p: 0,
      }}
    >
      <Grid
        container
        spacing={disableGap ? 0 : spacing}
        sx={{ display: "flex", flexWrap: "wrap" }}
      >
        {items.map((item) => (
          <Grid
            size={collapse ? { xs: 12, md: 12 / distribution } : 12}
            key={item.id}
          >
            <Badge
              badgeContent={item.notification ?? null}
              sx={{ width: "100%" }}
            >
              <CardActionArea
                key={item.id}
                disabled={disabled || item.disabled}
                sx={{ borderRadius: "10px !important" }}
                disableRipple={disableRipple}
                disableTouchRipple={disableRipple}
              >
                <Card
                  onClick={() =>
                    item.action ? item.action() : handleSelect(item)
                  }
                  elevation={0}
                  sx={{
                    ...sx,
                    ...(Array.isArray(selected) &&
                    selected?.some((opcao) => opcao.id === item.id)
                      ? {
                          ...(styleSelect
                            ? {
                                ...styleSelect,
                                border: "1px solid transparent",
                              }
                            : {
                                border: "1px solid rgb(134, 134, 134)",
                                background: "rgba(256,256,256,0.05)",
                              }),
                        }
                      : { border: "1px solid transparent" }),
                    position: "relative",
                  }}
                >
                  {Array.isArray(selected) &&
                    checkmode &&
                    focusInItem &&
                    selected?.some((opcao) => opcao.id === item.id) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 15,
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  <ListItem
                    sx={{
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {(item.icon || item.imagem) && (
                      <ListItemAvatar>
                        <Avatar
                          src={
                            item?.imagem?.includes("undefined")
                              ? notFounImage
                              : item.imagem
                          }
                          sx={{
                            bgcolor: "transparent",
                            color: "#fff",
                            width: 50,
                            height: 50,
                            mr: 2,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                      </ListItemAvatar>
                    )}

                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: "18px", mr: 1 }}>
                          {item.titulo}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ fontSize: "16px", mr: 1 }}>
                          {item.subtitulo}
                        </Typography>
                      }
                    />

                    {!checkmode &&
                      actions &&
                      actions.map((actionItem, index) =>
                        !actionItem.icon ? (
                          <Button
                            key={index}
                            color={actionItem.color || "primary"}
                            disableElevation
                            onClick={(e) => {
                              e.stopPropagation();
                              actionItem.action(item.id);
                            }}
                            variant="outlined"
                            sx={{
                              m: "0 5px",
                              border: "1px solid #484848",
                            }}
                          >
                            {actionItem.titulo}
                          </Button>
                        ) : (
                          <IconButton
                            key={index}
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              actionItem.action(item.id);
                            }}
                            sx={{
                              m: "0 5px",
                            }}
                          >
                            {actionItem.icon}
                          </IconButton>
                        )
                      )}

                    {onDelete && !item.noDelete && (
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </ListItem>
                </Card>
              </CardActionArea>
            </Badge>
            {item.renderDetails && (
              <Box
                sx={{
                  mt: 1.8,
                  height:
                    Array.isArray(selected) &&
                    selected.some((op) => op.id === item.id)
                      ? 240
                      : 0, // Ajuste o valor conforme necessário
                  overflow: "hidden",
                  width: "100%",
                  transition: "height 0.3s ease-in-out",
                }}
              >
                {item.renderDetails}
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </List>
  );
};
