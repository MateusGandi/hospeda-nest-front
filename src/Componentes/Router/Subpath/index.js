import { useEffect, useState, useRef, useMemo } from "react";
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
import LogoImage from "../../../Assets/logo_aut.png";
import { LoadingBox } from "../../Custom";
import { isMobile } from "../../Funcoes";

const drawerWidth = 250;

export function SubRoutes({ fetch, views = {}, dados, base = "/dashboard" }) {
  const { path } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(!isMobile);
  const [selected, setSelected] = useState(null);
  const drawerRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const pages = useMemo(
    () =>
      Object.entries(views)
        .filter(([key, value]) => !value.acessoRapido || value.footer)
        .map(([key, value], index) => ({
          path: key,
          id: index,
          icon: value.icon,
          titulo: value.titulo,
          componente: value.componente,
          footer: value.footer,
        })),
    [views]
  );

  const handleChange = (item) => {
    navigate(item.path ? `${base}/${item.path}` : "/dashboard");
  };

  useEffect(() => {
    const key = path || "";
    setSelected(pages.find((item) => item.path === key));
  }, [path]);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (isMobile) {
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
    }
  }, [open]);

  if (!selected) return views[path]?.componente;

  return (
    <>
      {!dados ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoadingBox message="Carregando informações..." />
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
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
              zIndex: 999,
              transition: "width 0.3s ease-in-out",
              "& .MuiDrawer-paper": {
                background: "#212121",
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
                {" "}
                <a href="/home">
                  <img
                    src={LogoImage}
                    style={{
                      height: "32px",
                      marginLeft: "8px",
                      marginTop: "6px",
                    }}
                  />{" "}
                </a>
              </Toolbar>

              <List disablePadding>
                {pages
                  .filter((item) => !item.footer)
                  .map((item) => (
                    <ListItemButton
                      key={item.id}
                      selected={selected?.id === item.id}
                      onClick={() => handleChange(item)}
                      sx={{ m: 1, borderRadius: "10px" }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.titulo} />
                    </ListItemButton>
                  ))}
              </List>
            </Box>

            <Box sx={{ pb: { xs: 8, md: 0 } }}>
              <Divider />
              <List>
                {pages
                  .filter((item) => !!item.footer)
                  .map((item) => (
                    <ListItemButton
                      key={item.id}
                      selected={selected?.id === item.id}
                      onClick={() => handleChange(item)}
                      sx={{ m: 1, borderRadius: "10px" }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.titulo} />
                    </ListItemButton>
                  ))}
              </List>
            </Box>
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
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              ml: { xs: "0px", md: open ? `${drawerWidth}px` : "0px" },
              transition: "margin 0.3s ease-in-out",
            }}
          >
            {views[path]?.componente || views[""].componente || (
              <div>Página não encontrada</div>
            )}
          </Box>
        </Box>
      )}{" "}
    </>
  );
}
