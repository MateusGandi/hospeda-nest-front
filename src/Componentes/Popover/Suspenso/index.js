import { useEffect, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BoxEscalaSugestao = ({ children, icon, title, open, setOpen }) => {
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: { xs: 0, md: "12px" },
          left: { xs: 0, md: "12px" },
          borderRadius: { md: 2, xs: 0 },
          width: { xs: "100%", md: "400px" },
          padding: 2,
          zIndex: 9999,

          // Animação
          transition: "all 1s ease",
          transform: open ? "translateY(0)" : "translateY(35vh)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            mt: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {children}
      </Paper>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 9998,
        }}
      >
        {icon}
      </IconButton>
    </>
  );
};

export default BoxEscalaSugestao;
