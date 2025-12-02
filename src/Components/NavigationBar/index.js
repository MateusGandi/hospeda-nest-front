import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const SimpleAppBar = ({ titulo, rightContent }) => {
  return (
    <AppBar position="static" elevation={1} sx={{ height: "60px" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          {titulo}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {rightContent}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleAppBar;
