import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid2 as Grid,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import Modal from "../Modal";
import { Rows } from "../Lista/Rows";
import { isMobile } from "../Funcoes";
import { deepPurple } from "@mui/material/colors";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const NavigationBar = ({ logo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const accessType = localStorage.getItem("accessType");

  const actionsMap = {
    null: [
      {
        titulo: "Início",
        action: () => navigate("/onboard"),
        route: "/onboard",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Criar minha conta",
        icon: <PersonAddRoundedIcon />,
        action: () => navigate("/signup"),
        type: "button",
        route: "/signup",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
    client: [
      {
        titulo: "Para empresas",
        action: () => navigate("/plans"),
        route: "/plans",
        type: "text",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Início",
        action: () => navigate("/onboard"),
        route: "/onboard",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Meus agendamentos",
        icon: (
          <Avatar sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }}>
            N
          </Avatar>
        ),
        type: "button",
        action: () => navigate("/me"),
        route: "/me",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
    manager: [
      {
        titulo: "Início",
        action: () => navigate("/onboard"),
        route: "/onboard",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Para empresas",
        action: () => navigate("/enterprise"),
        route: "/enterprise",
        type: "text",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Gerenciar",
        action: () => navigate("/manager"),
        route: "/manager",
        type: "button",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
    adm: [
      {
        titulo: "Início",
        action: () => navigate("/onboard"),
        route: "/onboard",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Minha Barbearia",
        action: () => navigate("/dashboard"),
        type: "button",
        route: "/dashboard",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
  };

  const actions = actionsMap[accessType] || [];

  return (
    <>
      <AppBar
        elevation={0}
        position="static"
        sx={{ background: "#000", mb: -1 }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              p: "16px 8px",
            }}
          >
            <Grid item>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => navigate("/onboard")}
              >
                {logo}
              </Typography>
            </Grid>
            {actions.length > 0 && (
              <Grid item>
                {isMobile ? (
                  <>
                    <IconButton onClick={() => setMenuOpen((prev) => !prev)}>
                      <MenuRoundedIcon />
                    </IconButton>
                    <Modal
                      open={menuOpen}
                      onClose={() => setMenuOpen(false)}
                      fullWidth
                      maxWidth="md"
                      fullScreen="mobile"
                      titulo={<b>Tonsus App</b>}
                    >
                      <Rows
                        items={actions.filter(
                          (item) => location.pathname !== item.route
                        )}
                        oneTapMode={true}
                        onSelect={(item) => item.action()}
                      />
                    </Modal>
                  </>
                ) : (
                  <Grid
                    container
                    spacing={1}
                    sx={{ alignItems: "center", mr: -1 }}
                  >
                    {actions
                      .filter((item) => location.pathname !== item.route)
                      .map((item, index) =>
                        item.type === "icon" ? (
                          <IconButton
                            key={index}
                            onClick={item.action}
                            color="#fff"
                          >
                            {item.icon}
                          </IconButton>
                        ) : item.type === "text" ? (
                          <Typography
                            component="a"
                            href="/plans"
                            sx={{
                              m: "5px 10px",
                              color: "#fff",
                              textDecoration: "none",
                              ":hover": {
                                textDecoration: "underline !important",
                              },
                            }}
                          >
                            {item.titulo}
                          </Typography>
                        ) : (
                          <Button
                            key={index}
                            variant="outlined"
                            sx={{
                              borderColor: "#303030",
                              color: "#FFFFFF",
                              fontWeight: "bold",
                            }}
                            onClick={item.action}
                          >
                            {item.titulo}
                          </Button>
                        )
                      )}
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Modal
        backAction={{ action: () => setModal(false), titulo: "Voltar" }}
        open={modal}
        titulo={"Como posso ajudar..."}
        onClose={() => setModal(false)}
        fullScreen="all"
        component="view"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            endAdornment:
              searchValue.length > 0 ? (
                <IconButton onClick={() => setSearchValue("")}>
                  {" "}
                  <CloseIcon sx={{ color: "#626262" }} />{" "}
                </IconButton>
              ) : (
                <SearchIcon fontSize="large" sx={{ color: "#626262" }} />
              ),
            sx: {
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              p: "5px 10px",
              background: "#363636",
              borderRadius: "100px",
            },
          }}
        />
      </Modal>
    </>
  );
};

export default NavigationBar;
