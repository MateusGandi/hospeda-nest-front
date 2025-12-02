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

import Alerta from "./Components/Alert/Temp";
import NavigationBar from "./Components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteElement, Redirect } from "./Components/Router/Path";

const theme = createTheme({
  palette: {
    mode: "dark",
    force: {
      main: "#012FE5",
    },
    primary: {
      main: "#0195F7",
    },
    success: {
      main: "#23C45D",
    },
    secondary: {
      main: "#fff",
    },
    warning: {
      main: "#E57F01",
    },
    quaternary: {
      main: "#A755F7",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  const [page, setPage] = useState(null);
  const [paths] = useState(["/", "/create", "/login", "/dashboard/:path?"]);

  const [alert, setAlert] = useState({
    message: "",
    open: false,
  });

  const [timeoutId, setTimeoutId] = useState(null);

  const alertCustom = (message) => {
    if (typeof message !== "string") return;
    setAlert({ message: message, open: true });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeoutId(
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 5000)
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Alerta alert={alert} setAlert={setAlert} />
      <NavigationBar />
      <CssBaseline />
      <BrowserRouter>
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
