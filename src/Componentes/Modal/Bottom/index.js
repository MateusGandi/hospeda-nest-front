import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PartialDrawer = ({ open, onClose, title, children }) => {
  return (
    <Drawer
      onClose={onClose}
      anchor="bottom"
      variant="persistent"
      open={true}
      PaperProps={{
        sx: {
          height: open ? "50vh" : "60px",
          transition: "height 0.3s ease",
          overflow: "hidden",
          borderRadius: 0,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          px: 2,
          zIndex: 1400,
        },
      }}
    >
      {/* Barra título sempre visível */}
      <Box
        sx={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
          cursor: "default",
        }}
        onClick={onClose}
      >
        <Typography variant="h6" fontWeight="bold" noWrap>
          {title}
        </Typography>
        {open && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Conteúdo só aparece aberto */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: 2,
          display: open ? "block" : "none",
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default PartialDrawer;
