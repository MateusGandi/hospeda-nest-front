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
  Badge,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import Modal from "../Modal";
import { Rows } from "../Lista/Rows";
import { getLocalItem, isMobile } from "../Funcoes";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";

import LogoImage from "../../Assets/logo_aut.png";
import FAC from "../Termos";
import apiService from "../Api/axios";
const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [hasScheduling, setHasScheduling] = useState(false);
  const [actions, setActions] = useState([]);
  const accessType = getLocalItem("accessType");

  const handleGetScheduling = async () => {
    try {
      if (!getLocalItem("userId")) return;
      const data = await apiService.query(
        "GET",
        `/scheduling/user/${getLocalItem("userId")}?status=PENDING`
      );

      data.length ? setHasScheduling(true) : setHasScheduling(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocalItem("accessType") == "client" && handleGetScheduling();
  }, [location]);

  const actionsMap = {
    null: [
      {
        titulo: "Para empresas",
        action: () => navigate("/plans"),
        route: "/plans",
        type: "text",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Início",
        action: () => navigate("/home"),
        route: "/home",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Entrar",
        action: () => navigate("/login"),
        route: "/login",
        type: "text",

        icon: <LoginIcon />,
      },
      {
        titulo: "Criar minha conta",
        icon: <PersonAddRoundedIcon />,
        action: () => navigate("/create"),
        type: "button",
        route: "/create",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
    employee: [
      {
        titulo: "Sair",
        action: () => {
          localStorage.clear();
          navigate("/login");
        },
        route: "/logout",
        type: "text",

        icon: <LogoutIcon />,
      },
      {
        titulo: "Início",
        action: () => navigate("/home"),
        route: "/home",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Atendimento",
        action: () => navigate("/dashboard"),
        type: "button",
        route: "/dashboard",
        icon: <BusinessCenterIcon />,
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
        action: () => navigate("/home"),
        route: "/home",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Meus agendamentos",
        icon: (
          <Avatar
            sx={{ bgcolor: "#0195F7", color: "#fff", width: 40, height: 40 }}
          >
            {(getLocalItem("nome") ?? "T")[0]}
          </Avatar>
        ),
        notification: hasScheduling ? 1 : null,
        type: "button",
        action: () => navigate("/me"),
        route: "/me",
      },
      {
        titulo: "Sair",
        action: () => {
          Cookies.remove("getPermission");
          localStorage.clear();
          navigate("/login");
        },
        route: "/logout",
        type: "text",

        icon: <LogoutIcon />,
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
        action: () => navigate("/home"),
        route: "/home",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Sair",
        action: () => {
          Cookies.remove("getPermission");
          localStorage.clear();
          navigate("/login");
        },
        route: "/logout",
        type: "text",

        icon: <LogoutIcon />,
      },
      {
        titulo: "Para empresas",
        action: () => navigate("/plans"),
        route: "/plans",
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
        titulo: "Sair",
        action: () => {
          localStorage.clear();
          navigate("/login");
        },
        route: "/logout",
        type: "text",

        icon: <LogoutIcon />,
      },
      {
        titulo: "Início",
        action: () => navigate("/home"),
        route: "/home",
        type: "text",
        icon: <HomeRoundedIcon />,
      },
      {
        titulo: "Minha Barbearia",
        action: () => navigate("/dashboard"),
        type: "button",
        route: "/dashboard",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
    ],
  };

  useEffect(() => {
    setActions(actionsMap[accessType]);
  }, [hasScheduling, location]);

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
                onClick={() => navigate("/home")}
              >
                <b>
                  <img src={LogoImage} style={{ height: "32px" }} />
                </b>
              </Typography>
            </Grid>
            {actions.length > 0 && (
              <Grid item>
                {isMobile ? (
                  <>
                    <IconButton onClick={() => setMenuOpen((prev) => !prev)}>
                      <MenuRoundedIcon size="large" />
                    </IconButton>
                    <Modal
                      open={menuOpen}
                      onClose={() => setMenuOpen(false)}
                      fullWidth
                      maxWidth="md"
                      fullScreen="mobile"
                      titulo={
                        <b>
                          <img src={LogoImage} style={{ height: "32px" }} />
                        </b>
                      }
                    >
                      <Rows
                        items={actions
                          .filter((item) => location.pathname !== item.route)
                          .map((item) => ({
                            ...item,
                            action: () => {
                              item.action();
                              item.titulo != "Pesquisar" &&
                                setMenuOpen((prev) => !prev);
                            },
                          }))}
                        oneTapMode={true}
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
                            href={item.route}
                            onClick={item.action}
                            sx={{
                              m: "5px 10px",
                              color: "#fff",
                              cursor: "pointer",
                              textDecoration: "none",
                              ":hover": {
                                textDecoration: "underline !important",
                              },
                            }}
                          >
                            {item.titulo}
                          </Typography>
                        ) : (
                          <Badge
                            badgeContent={item.notification ?? null}
                            color="warning"
                            showZero={false}
                          >
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
                          </Badge>
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
        titulo={"Como posso ajudar?"}
        onClose={() => setModal(false)}
        fullScreen="all"
        component="view"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Começe a digitar..."
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
        <FAC filtro={searchValue} />
      </Modal>
    </>
  );
};

export default NavigationBar;
