import { useState } from "react";
import {
  Drawer,
  CssBaseline,
  Box,
  Container,
  IconButton,
  Toolbar,
  Paper,
  Typography,
} from "@mui/material";
import { Rows } from "../Componentes/Lista/Rows";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sales from "./Pages/Sales";
import { isMobile } from "../Componentes/Funcoes";

const drawerWidth = 280;

export default function Layout() {
  const paginas = [
    {
      id: 1,
      titulo: "Vendas",
      icon: <LocalMallIcon />,
      page: <Sales />,
    },
    { id: 2, titulo: "Social", icon: <PublicIcon /> },
    { id: 3, titulo: "Configurações", icon: <SettingsIcon /> },
  ];
  const [paginaAtual, setPaginaAtual] = useState(paginas[0]);
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", maxHeight: "88vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar Flutuante */}
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
            borderRadius: 0,
            p: 1,
          },
        }}
      >
        <Toolbar></Toolbar>
        <Rows
          focusInItem={false}
          selectedItems={[paginaAtual]}
          unSelectMode={false}
          items={paginas}
          sx={{ p: 0 }}
          onSelect={(item) => setPaginaAtual(item)}
        />
      </Drawer>

      {/* Botão de abrir/fechar flutuante */}
      <Paper
        elevation={0}
        sx={{
          position: "fixed",
          bottom: 10,
          left: 10, // Ajusta conforme o Drawer
          zIndex: 2,

          borderRadius: "50%",
          transition: "left 0.2s ease-in-out",
        }}
      >
        <IconButton onClick={() => setOpen(!open)} sx={{ p: 2 }}>
          {open ? <CloseRoundedIcon /> : <WidgetsRoundedIcon />}
        </IconButton>
      </Paper>

      {/* Conteúdo Principal */}
      <Box
        onClick={() => isMobile && setOpen(false)}
        component="main"
        sx={{
          flexGrow: 1,
          ml: open ? `${drawerWidth}px` : "0px", // Ajusta a margem conforme o estado do Drawer
          transition: "margin 0.3s ease-in-out",
          padding: 2,
          overflow: "auto", // Permite o scroll dentro da Box
          height: "100vh", // Faz com que o conteúdo da Box ocupe toda a altura da tela
        }}
      >
        <Container maxWidth="lg">{paginaAtual && paginaAtual.page}</Container>
      </Box>
    </Box>
  );
}
