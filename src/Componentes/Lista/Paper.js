import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider, Paper, Typography } from "@mui/material";

export const PaperList = ({ children, items = [] }) => {
  return (
    <Paper
      variant="outlined"
      sx={{ background: "transparent", overflow: "hidden" }}
    >
      {children}
      <Divider />
      <List sx={{ m: 0, p: 0, borderRadius: "10px" }}>
        {items.map((item, index) => (
          <>
            <ListItem key={index} sx={{}}>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "18px" }}>
                    {item.titulo}
                  </Typography>
                }
                secondary={item.subtitulo}
              />
            </ListItem>
            {items.length - 1 > index && <Divider />}
          </>
        ))}
      </List>
    </Paper>
  );
};
