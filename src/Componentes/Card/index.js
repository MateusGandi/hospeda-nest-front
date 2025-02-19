import { CardActionArea, Paper } from "@mui/material";
import React from "react";

const CustomCard = ({ children, onClick, sx }) => {
  return onClick ? (
    <CardActionArea
      onClick={onClick}
      sx={{ borderRadius: "10px !important", height: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          background: "#363636",
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: "10px",
          height: "100%",
          ...sx,
        }}
      >
        {children}
      </Paper>
    </CardActionArea>
  ) : (
    <Paper
      sx={{
        background: "#363636",
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: "10px",
        height: "100%",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default CustomCard;
