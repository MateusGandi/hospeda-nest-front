import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  Divider,
  Paper,
  Typography,
  Avatar,
  ListItemAvatar,
} from "@mui/material";

export const PaperList = ({
  children,
  items = [],
  variant = "outlined",
  sx = {},
}) => {
  return (
    <Paper
      variant={variant}
      sx={{ background: "transparent", overflow: "hidden", ...sx }}
    >
      {children}
      <Divider />
      <List sx={{ m: 0, p: 0, borderRadius: "10px" }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              {/* Avatar condicional */}
              {(item.image || item.icon) && (
                <ListItemAvatar>
                  <Avatar
                    src={item.image}
                    sx={{
                      width: item.size || 60,
                      height: item.size || 60,
                      bgcolor: !item.image ? "primary.main" : "transparent",
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>
              )}

              <ListItemText
                sx={{ pl: 2 }}
                primary={
                  <Typography sx={{ fontSize: "18px" }}>
                    {item.titulo}
                  </Typography>
                }
                secondary={item.subtitulo}
              />
            </ListItem>
            {items.length - 1 > index && variant === "outlined" && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};
