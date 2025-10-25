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
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import Modal from "../Modal/Simple";
import { Rows } from "../Lista/Rows";
import { getLocalItem, isMobile } from "../Funcoes";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import LogoImage from "../../Assets/logo_aut.png";
import apiService from "../Api/axios";
import FAQ from "../../Empresas/Termos";

import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import {
  Store,
  Settings,
  People,
  Build,
  CalendarMonth,
  Home,
  Person,
} from "@mui/icons-material";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import { Notification } from "../Alert/Notification";

const NavigationBar = ({ alertCustom }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hasScheduling, setHasScheduling] = useState(false);
  const [actions, setActions] = useState([]);
  const [scrolled, setScrolled] = useState(false);
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
    getLocalItem("accessType") === "client" &&
      location.pathname.includes("/home") &&
      handleGetScheduling();
  }, [location]);

  const handleLogout = () => {
    Cookies.remove("getPermission");
    googleLogout();

    localStorage.clear();
    navigate("/login");
  };

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
        action: handleLogout,
        route: "/logout",
        type: "text",
        icon: <LogoutIcon />,
      },

      {
        titulo: "Menu principal",
        action: () => navigate("/dashboard"),
        route: "/dashboard",
        type: "link",
        icon: <WidgetsRoundedIcon />,
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
      {
        titulo: "Financeiro",
        action: () => navigate("/dashboard/financeiro"),
        type: "link",
        route: "/dashboard/financeiro",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Suporte",
        action: () => navigate("/dashboard/support"),
        type: "link",
        route: "/dashboard/support",
        icon: <QuestionAnswerRoundedIcon />,
      },
      {
        titulo: "Meu perfil",
        action: () => navigate("/me"),
        type: "link",
        route: "/me",
        icon: (
          <Avatar
            sx={{ bgcolor: "#0195F7", color: "#fff", width: 40, height: 40 }}
          >
            {(getLocalItem("nome") ?? "T")[0]}
          </Avatar>
        ),
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
        action: handleLogout,
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
        action: handleLogout,
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
        action: handleLogout,
        route: "/logout",
        type: "text",
        icon: <LogoutIcon />,
      },
      {
        titulo: "Menu principal",
        action: () => navigate("/dashboard"),
        route: "/dashboard",
        type: "link",
        icon: <WidgetsRoundedIcon />,
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
        component: <Notification />,
        type: "component",
      },
      {
        titulo: "Pesquisar",
        type: "icon",
        icon: <SearchIcon />,
        action: () => setModal(true),
      },
      {
        titulo: "Financeiro",
        action: () => navigate("/dashboard/financeiro"),
        type: "link",
        route: "/dashboard/financeiro",
        icon: <BusinessCenterIcon />,
      },
      {
        titulo: "Produtos",
        action: () => navigate("/dashboard/produtos"),
        type: "link",
        route: "/dashboard/produtos",
        icon: <LocalMallRoundedIcon />,
      },
      {
        titulo: "Editar barbearia",
        action: () => navigate("/dashboard/editar"),
        type: "link",
        route: "/dashboard/editar",
        icon: <BusinessCenterRoundedIcon />,
      },
      {
        titulo: "Suporte",
        action: () => navigate("/dashboard/support"),
        type: "link",
        route: "/dashboard/support",
        icon: <QuestionAnswerRoundedIcon />,
      },
      {
        titulo: "Meu perfil",
        action: () => navigate("/me"),
        type: "link",
        route: "/me",
        icon: (
          <Avatar
            sx={{ bgcolor: "#0195F7", color: "#fff", width: 40, height: 40 }}
          >
            {(getLocalItem("nome") ?? "T")[0]}
          </Avatar>
        ),
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setActions(actionsMap[accessType]);
  }, [hasScheduling, location]);

  const verifyAndRedirect = (dadosReceived, message) => {
    if (dadosReceived && dadosReceived.pendencia) {
      alertCustom(dadosReceived.motivo);
      navigate("/complete");
    } else {
      alertCustom(message || "Acesso concedido!");
    }
  };
  const handleLogin = async (token) => {
    try {
      const data = await apiService.query("POST", "/user/login", { token });
      apiService.setKey(data);
      verifyAndRedirect(data, "Login realizado com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom(error?.response?.data?.message ?? "Erro ao realizar login!");
    }
  };

  return (
    <>
      <Box sx={{ display: "none" }}>
        <GoogleLogin
          useOneTap={!getLocalItem("accessType")}
          onSuccess={({ credential }) => handleLogin(credential)}
          onError={() => alertCustom("Erro ao realizar login com Google!")}
          buttonText="Login"
        />
      </Box>
      <AppBar
        elevation={0}
        sx={{
          position: "absolute",
          left: 0,
          zIndex: 998,
          background: "none",
        }}
      >
        <Toolbar
          style={{
            justifyContent: "space-between",
          }}
        >
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
                <a href="/home">
                  <img src={LogoImage} style={{ height: "32px" }} />
                </a>
              </Typography>
            </Grid>
            {actions.length > 0 && (
              <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isMobile && <Notification />}
                <IconButton
                  onClick={() => setMenuOpen((prev) => !prev)}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  <MenuRoundedIcon size="large" />
                </IconButton>
                <Modal
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  fullWidth
                  maxWidth="md"
                  fullScreen="mobile"
                  sx={{
                    background:
                      "linear-gradient(0deg,rgba(33, 33, 33, 0) 0%, rgba(33, 33, 33, 1) 28%, rgba(33, 33, 33, 1) 100%)",
                  }}
                  titulo={
                    <a href="/home">
                      <img src={LogoImage} style={{ height: "32px" }} />
                    </a>
                  }
                >
                  <Rows
                    items={actions
                      .filter(
                        (item) =>
                          location.pathname !== item.route &&
                          item.type != "component"
                      )
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

                <Grid
                  container
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    mr: -1,
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  {actions
                    .filter(
                      (item) =>
                        location.pathname !== item.route && item.type != "link"
                    )
                    .map((item, index) =>
                      item.type === "component" ? (
                        <Box key={index} sx={{ mx: 0.5 }}>
                          {item.component}
                        </Box>
                      ) : item.type === "icon" ? (
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
        <FAQ filtro={searchValue} back={true} />
      </Modal>
    </>
  );
};

export default NavigationBar;
