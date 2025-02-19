import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";

import Login from "../../Login";
import Empresa from "../../Empresas/Home/";
import Estabelecimentos from "../../Empresas/Home/Estabelecimentos";
import DashBoard from "../../Empresas/Dashboard";
import PublicPage from "../../Home";
import Manager from "../../Manager";
import UserData from "../../User";

import Api from "../Api/axios";

export function RouteElement({ path, alertCustom }) {
  const [pathsAllowed, setPathsAllowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento

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
          "/onboard",
          "/estabelecimentos",
          "/barbearia",
          "/dashboard",
          "/manager",
          "/me",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutesAllowed();
  }, [path]);

  const paths = {
    "/login": <Login page="login" alertCustom={alertCustom} />,
    "/create": <Login page="create" alertCustom={alertCustom} />,
    "/onboard": <PublicPage />,
    "/estabelecimentos": <Estabelecimentos alertCustom={alertCustom} />,
    "/barbearia": <Empresa alertCustom={alertCustom} />,
    "/dashboard": <DashBoard alertCustom={alertCustom} />,
    "/manager": <Manager alertCustom={alertCustom} />,
    "/me": <UserData alertCustom={alertCustom} />,
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
