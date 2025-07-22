import { useEffect, useState, useRef } from "react";
import {
  Drawer,
  CssBaseline,
  Box,
  Container,
  IconButton,
  Toolbar,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { isMobile } from "../../../Componentes/Funcoes";

const drawerWidth = 280;

export default function LeftNavigationBar({
  pages,
  footer,
  onChangePage = (item) => {},
  renderPage = true,
  fixed = true,
}) {
  const [paginaAtual, setPaginaAtual] = useState(pages[0]);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    onChangePage(paginaAtual);
  }, [paginaAtual]);

  // Fecha o Drawer ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Box sx={{ display: "flex", maxHeight: "88vh", overflow: "hidden" }}>
      <CssBaseline />

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          zIndex: 1,
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          position: "absolute",
          transition: "width 0.3s ease-in-out",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 0,
            p: 0,
          },
        }}
        ref={drawerRef}
      >
        <Box>
          <Toolbar />
          <List disablePadding>
            {pages.map((item) => (
              <ListItemButton
                key={item.id}
                selected={paginaAtual.id === item.id}
                onClick={() => setPaginaAtual(item)}
                sx={{ m: 1, borderRadius: "10px" }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.titulo} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box>
          <Divider />
          <List>
            {footer.map((item) => (
              <ListItemButton
                key={item.id}
                selected={paginaAtual.id === item.id}
                onClick={() => setPaginaAtual(item)}
                sx={{ m: 1, borderRadius: "10px" }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.titulo} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Tooltip title="Mais opções">
        <Paper
          elevation={0}
          sx={{
            ...(fixed
              ? {
                  position: "fixed",
                  left: open ? drawerWidth : 5,
                  bottom: 10,
                }
              : {}),
            zIndex: 2,
            borderRadius: "50px",
            transition: "left 0.2s ease-in-out",
          }}
          ref={toggleButtonRef}
        >
          <IconButton onClick={() => setOpen(!open)} sx={{ p: 2 }}>
            {open ? <CloseRoundedIcon /> : <WidgetsRoundedIcon />}
          </IconButton>
        </Paper>
      </Tooltip>
      {renderPage && (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: open ? `${drawerWidth}px` : "0px",
            transition: "margin 0.3s ease-in-out",
            padding: 2,
            width: "100%",
          }}
        >
          {paginaAtual?.page}
        </Box>
      )}
    </Box>
  );
}
