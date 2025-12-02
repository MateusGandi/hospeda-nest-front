import { Box } from "@mui/material";
import Login from "../../../Pages/Login";
import Manager from "../../../Pages/Manager";
import PublicPage from "../../../Pages/Home";
import { useState } from "react";

export function RouteElement({ path: pathSelected, alertCustom }) {
  const [pathsAllowed, setPathsAllowed] = useState([
    "/login",
    "/",
    "/dashboard",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const paths = {
    "/login": <Login page="login" alertCustom={alertCustom} />,
    "/": <PublicPage />,
    "/dashboard": <Manager alertCustom={alertCustom} />,
  };

  if (isLoading) {
    return <Box> Carregando...</Box>;
  }

  // if (!pathAtual) return <Navigate to="/login" />;

  return paths[pathSelected];
}
