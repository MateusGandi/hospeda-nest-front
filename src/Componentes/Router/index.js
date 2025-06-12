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
import CreateEstablishment from "../../Empresas/Plans/Onboard";

import Api from "../Api/axios";
import { setLocalItem } from "../Funcoes";
import Reviews from "../../Empresas/Home/Avaliacao";
import FAC from "../Termos";

export function RouteElement({ path, alertCustom }) {
  const [pathsAllowed, setPathsAllowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsLoading(true);
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    const fetchRoutesAllowed = async () => {
      try {
        const paths = await Api.getAccess();
        setPathsAllowed(paths);
      } catch (error) {
        setPathsAllowed([
          "/login",
          "/create",
          "/change",
          "/recover",
          "/home",
          "/fac",
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
    "/home": <PublicPage />,
    "/estabelecimentos": <Estabelecimentos alertCustom={alertCustom} />,
    "/barbearia": <Empresa alertCustom={alertCustom} />,
    "/dashboard": <DashBoard alertCustom={alertCustom} />,
    "/manager": <Manager alertCustom={alertCustom} />,
    "/me": <UserData alertCustom={alertCustom} />,
    "/plans": <Plans alertCustom={alertCustom} onClose={handleModalClose} />,
    "/checkout": <Checkout alertCustom={alertCustom} />,
    "/onboard": <CreateEstablishment alertCustom={alertCustom} />,
    "/review": <Reviews alertCustom={alertCustom} />,
    "/fac": <FAC />,
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ paddingTop: "50px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const lastPath = window.location.pathname;
  const pathF = pathsAllowed.find((rota) => `/${path}`.includes(rota));
  if (!pathF) {
    return <Navigate to="/login" />;
  } else {
    !"login create recover change".includes(lastPath.split("/")[0]) &&
      setLocalItem("lastRoute", lastPath);
    return (
      <Box
        sx={{
          height: "100vh",
        }}
      >
        {paths[pathF]}
      </Box>
    );
  }
}

export function Redirect() {
  return <Navigate to="/login" />;
}
