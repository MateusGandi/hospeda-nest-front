import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Drawer,
  CssBaseline,
  Box,
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

const drawerWidth = 250;

export function SubRoutesSimplified({
  logo,
  routes = [],
  base = "/dashboard",
  children,
}) {
  const { path } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const drawerRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const handleNavigate = (route) => {
    navigate(route.to ? `${base}/${route.to}` : base);
  };

  const selected = routes.find((r) => r.to === path);
  const topRoutes = routes.filter((r) => r.position !== "bottom");
  const bottomRoutes = routes.filter((r) => r.position === "bottom");

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          position: "absolute",
          zIndex: 999,
          transition: "width 0.3s ease-in-out",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 0,
            p: 0,
          },
        }}
        ref={drawerRef}
      >
        <Box>
          <Toolbar>
            <a href="/home">
              <img
                src={logo}
                style={{ height: 32, marginLeft: 8, marginTop: 6 }}
              />
            </a>
          </Toolbar>

          <List disablePadding>
            {topRoutes.map((route) => (
              <ListItemButton
                key={route.id}
                selected={selected?.id === route.id}
                onClick={() => handleNavigate(route)}
                sx={{ m: 1, borderRadius: "10px" }}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.titulo} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {bottomRoutes.length > 0 && (
          <Box sx={{ pb: { xs: 8, md: 0 } }}>
            <Divider />
            <List>
              {bottomRoutes.map((route) => (
                <ListItemButton
                  key={route.id}
                  selected={selected?.id === route.id}
                  onClick={() => handleNavigate(route)}
                  sx={{ m: 1, borderRadius: "10px" }}
                >
                  <ListItemIcon>{route.icon}</ListItemIcon>
                  <ListItemText primary={route.titulo} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Drawer>

      <Tooltip
        title={open ? "Fechar" : "Mais opções"}
        sx={{ zIndex: 9999, display: { xs: "none", md: "block" } }}
      >
        <Paper
          elevation={2}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "fixed",
            left: open ? drawerWidth + 5 : 5,
            bottom: 10,
            borderRadius: 50,
            transition: "left 0.2s ease-in-out",
          }}
          ref={toggleButtonRef}
        >
          <IconButton onClick={() => setOpen(!open)} sx={{ p: 2 }}>
            {open ? <CloseRoundedIcon /> : <WidgetsRoundedIcon />}
          </IconButton>
        </Paper>
      </Tooltip>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: open ? `${drawerWidth}px` : 0 },
          transition: "margin 0.3s ease-in-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
