import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import Login from "../../../Login";
import Empresa from "../../../Empresas/Home";
import Estabelecimentos from "../../../Empresas/Home/Estabelecimentos";
import PublicPage from "../../../Home";
import Manager from "../../../Manager";
import UserData from "../../../User";
import Plans from "../../../Empresas/Plans";
import Checkout from "../../../Empresas/Checkout";
import CreateEstablishment from "../../../Empresas/Plans/Onboard";
import FAQ from "../../../Empresas/Termos";
import Envite from "../../../User/Envite";
import Reviews from "../../../Empresas/Home/Avaliacao";

import Api from "../../Api/axios";
import { getLocalItem, setLocalItem } from "../../Funcoes";
import { SubRoutes } from "../Subpath";

import Agendamentos from "../../../Empresas/Dashboard/Agendamentos";
import GerenciarFuncionarios from "../../../Empresas/Dashboard/Funcionarios";
import GerenciarServicos from "../../../Empresas/Dashboard/Servicos";
import WorkSchedule from "../../../Empresas/Dashboard/Escala";
import GestaoFinancas from "../../../Empresas/Dashboard/Financeiro";
import WhatsApp from "../../../Empresas/Dashboard/WhatsApp";
import AgendamentoManual from "../../../Empresas/Dashboard/Agendamento";
import EditData from "../../../Empresas/Dashboard/Edit";
import BarberShopMenu from "../../../Empresas/Dashboard";

import LogoIcon from "../../../Assets/Login/tonsus_logo_white.png";
import LoadingImagePulse from "../../Effects/loading";

export function RouteElement({ path: pathSelecionado, alertCustom }) {
  const [pathsAllowed, setPathsAllowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutesAllowed = async () => {
      try {
        const paths = await Api.getAccess();
        setPathsAllowed([...paths, "/envite", "/manager"]);
      } catch (error) {
        setPathsAllowed([
          "/login",
          "/create",
          "/change",
          "/complete",
          "/recover",
          "/home",
          "/faq",
          "/envite",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutesAllowed();
  }, [pathSelecionado]);

  const fetch = async () => {
    try {
      const data = await Api.query(
        "GET",
        `/establishment?establishmentId=${getLocalItem("establishmentId")}`
      );

      const [latitude, longitude] = data.longitudeAndLatitude || [];
      const { horarioFechamento, horarioAbertura } = data;

      setDados({
        ...data,
        horarioFechamento: horarioFechamento.slice(0, 5),
        horarioAbertura: horarioAbertura.slice(0, 5),
        location: { latitude, longitude },
      });
    } catch (error) {
      alertCustom("Erro ao buscar informações do estabelecimento!");
    }
  };
  const handleSave = async (info, message = true) => {
    if (!dados) return;
    try {
      await Api.query("PATCH", `/establishment/${dados.id}`, info);

      await fetch();
      message &&
        alertCustom("Dados do estabelecimento atualizados com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom("Erro ao atualizar dados do estabelecimento");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  const paths = {
    "/login": <Login page="login" alertCustom={alertCustom} />,
    "/create": <Login page="create" alertCustom={alertCustom} />,
    "/recover": <Login page="recover" alertCustom={alertCustom} />,
    "/change": <Login page="change" alertCustom={alertCustom} />,
    "/complete": <Login page="complete" alertCustom={alertCustom} />,
    "/home": <PublicPage />,
    "/estabelecimentos": <Estabelecimentos alertCustom={alertCustom} />,
    "/barbearia": <Empresa alertCustom={alertCustom} />,
    "/dashboard": (
      <SubRoutes
        dados={dados}
        views={{
          "/agendamentos": (
            <Agendamentos alertCustom={alertCustom} onClose={handleClose} />
          ),
          "/funcionarios": (
            <GerenciarFuncionarios
              alertCustom={alertCustom}
              onClose={handleClose}
            />
          ),
          "/servicos": (
            <GerenciarServicos
              alertCustom={alertCustom}
              onClose={handleClose}
            />
          ),
          "/financeiro": (
            <GestaoFinancas
              alertCustom={alertCustom}
              onClose={handleClose}
              barbearia={dados}
            />
          ),
          "/escala": (
            <WorkSchedule
              alertCustom={alertCustom}
              openModal={true}
              type="other"
              onClose={handleClose}
            />
          ),
          "/whatsapp": <WhatsApp barbearia={dados} alertCustom={alertCustom} />,
          "/agendamento": (
            <AgendamentoManual
              barbearia={dados}
              alertCustom={alertCustom}
              onClose={handleClose}
            />
          ),
          "/editar": (
            <EditData
              onClose={handleClose}
              barbearia={dados}
              alertCustom={alertCustom}
              onSave={handleSave}
            />
          ),
        }}
      >
        <BarberShopMenu
          alertCustom={alertCustom}
          barbearia={dados}
          reload={fetch}
          onSave={handleSave}
        />
      </SubRoutes>
    ),
    "/manager": <Manager alertCustom={alertCustom} />,
    "/me": <UserData alertCustom={alertCustom} />,
    "/plans": <Plans alertCustom={alertCustom} onClose={handleClose} />,
    "/checkout": <Checkout alertCustom={alertCustom} />,
    "/onboard": <CreateEstablishment alertCustom={alertCustom} />,
    "/review": <Reviews alertCustom={alertCustom} />,
    "/faq": <FAQ />,
    "/envite": <Envite alertCustom={alertCustom} />,
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
        <LoadingImagePulse src={LogoIcon} />
      </Box>
    );
  }

  const lastPath = window.location.pathname;
  const pathAtual = pathsAllowed.find((rota) =>
    `/${pathSelecionado}`.includes(rota)
  );
  if (!pathAtual) {
    return <Navigate to="/login" />;
  } else {
    if (
      !["/login", "/create", "/recover", "/change", "/complete"].some(
        (rot) => rot == lastPath
      )
    ) {
      setLocalItem("lastRoute", lastPath);
    }
    return (
      <Box
        sx={{
          marginTop: pathAtual != "/home" ? "60px" : "0px",
          height: pathAtual != "/home" ? "calc(100vh - 60px)" : "100vh",
        }}
      >
        {paths[pathAtual]}
      </Box>
    );
  }
}

export function Redirect() {
  return <Navigate to="/login" />;
}
