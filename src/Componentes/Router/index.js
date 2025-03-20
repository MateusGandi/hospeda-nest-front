import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import bgiteract from "../../Assets/vt.png";

import Login from "../../Login";
import Empresa from "../../Empresas/Home/";
import Estabelecimentos from "../../Empresas/Home/Estabelecimentos";
import DashBoard from "../../Empresas/Dashboard";
import PublicPage from "../../Home";
import Manager from "../../Manager";
import UserData from "../../User";
import Plans from "../../Empresas/Plans";
import Checkout from "../Checkout";

import Api from "../Api/axios";

export function RouteElement({ path, alertCustom }) {
  const [pathsAllowed, setPathsAllowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoutesAllowed = async () => {
      try {
        const paths = await Api.getAccess();
        setPathsAllowed(paths || []);
      } catch (error) {
        console.error("Erro ao buscar rotas permitidas:", error);
        setPathsAllowed([
          "/login",
          "/create",
          "/change",
          "/recover",
          "/onboard",
          "/estabelecimentos",
          "/barbearia",
          "/dashboard",
          "/manager",
          "/me",
          "/plans",
          "/checkout",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutesAllowed();
  }, [path]);

  const handleModalClose = () => {
    navigate(-1);
  };

  const paths = {
    "/login": <Login page="login" alertCustom={alertCustom} />,
    "/create": <Login page="create" alertCustom={alertCustom} />,
    "/recover": <Login page="recover" alertCustom={alertCustom} />,
    "/change": <Login page="change" alertCustom={alertCustom} />,
    "/onboard": <PublicPage />,
    "/estabelecimentos": <Estabelecimentos alertCustom={alertCustom} />,
    "/barbearia": <Empresa alertCustom={alertCustom} />,
    "/dashboard": <DashBoard alertCustom={alertCustom} />,
    "/manager": <Manager alertCustom={alertCustom} />,
    "/me": <UserData alertCustom={alertCustom} />,
    "/plans": <Plans alertCustom={alertCustom} onClose={handleModalClose} />,
    "/checkout": <Checkout alertCustom={alertCustom} />,
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const lastPath = window.location.pathname;
  const pathF = pathsAllowed.find((rota) => `/${path}`.includes(rota));
  if (!pathF) {
    localStorage.setItem("lastRoute", "/login");
    //return <Navigate to="/login" />;
  } else {
    localStorage.setItem("lastRoute", lastPath);
    return paths[pathF];
  }
}

export function Redirect() {
  return <Navigate to="/login" />;
}
