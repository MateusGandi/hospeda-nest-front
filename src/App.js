import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  Button,
  Grid2 as Grid,
  Container,
} from "@mui/material";

import Alerta from "./Componentes/Alert/Temp";
import NavigationBar from "./Componentes/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteElement, Redirect } from "./Componentes/Router";
import Permissions from "./Componentes/Permissions";

const theme = createTheme({
  palette: {
    mode: "dark",
    force: {
      main: "#012FE5",
    },
    primary: {
      main: "#0195F7",
    },
    secondary: {
      main: "#fff",
    },
    warning: {
      main: "#ffb200",
    },
    background: {
      default: "#000",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#363636",
          color: "#fff",
          borderRadius: "10px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "10px",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  const [page, setPage] = useState(null);
  const [paths] = useState([
    "/home",
    "/create",
    "/onboard/:planId?",
    "/login",
    "/change/:hash?",
    "/recover",
    "/estabelecimentos",
    "/barbearia/:barbeariaName/:subPath?",
    "/agendamento/:barbeariaName/:subPath?",
    "/barbearia",
    "/dashboard/:path?/:subPath?",
    "/manager/:page?",
    "/me/:agendamentoId?",
    "/plans/:videoPath?",
    "/checkout/:key?",
    "/review/:barbeariaId",
    "/fac/:title?",
  ]);
  const [alert, setAlert] = useState({
    message: "",
    open: false,
  });

  const alertCustom = (message) => {
    setAlert({ message: message, open: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Alerta alert={alert} setAlert={setAlert} />
      <CssBaseline />
      <BrowserRouter>
        <NavigationBar logo="Tonsus App" />
        <Permissions alertCustom={alertCustom} />
        <Routes>
          {paths.map((path, index) => (
            <Route
              key={index}
              path={path}
              element={
                <RouteElement
                  path={path}
                  alertCustom={alertCustom}
                  page={page}
                  setPage={setPage}
                />
              }
            />
          ))}
          <Route path="*" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
