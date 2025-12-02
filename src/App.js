import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import Alerta from "./Components/Alert/Temp";
import NavigationBar from "./Components/NavigationBar";
import { RouteElement } from "./Components/Router/Path";
import Theme from "./Theme";
import { useState } from "react";

const theme = createTheme(Theme);

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
              element={<RouteElement path={path} alertCustom={alertCustom} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
