import { Box, useMediaQuery, useTheme } from "@mui/material";
import Agendamentos from "./Rows";
import AgendamentosByCalendario from "./Columns";
import apiService from "../../../Componentes/Api/axios";
import { useEffect, useState } from "react";
import { getLocalItem, normalizeHour } from "../../../Componentes/Funcoes";
import { LoadingBox } from "../../../Componentes/Custom";
import { GerenciarFila } from "./Fila";

export default function AgendamentosView({ alertCustom }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [data, setData] = useState({
    loading: true,
    filaDinamicaClientes: false,
    startHour: 9,
    endHour: 18,
  });

  const getEstablishment = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));
      const { horarioAbertura, horarioFechamento, funcionarios } =
        await apiService.query(
          "GET",
          `/establishment?establishmentId=${localStorage.getItem(
            "establishmentId"
          )}`
        );

      setData({
        filaDinamicaClientes:
          funcionarios.find(({ id }) => id == getLocalItem("userId"))
            ?.filaDinamicaClientes || false,
        loading: false,
        startHour: normalizeHour(horarioAbertura, "down"),
        endHour: normalizeHour(horarioFechamento, "up"),
      });
    } catch (error) {
      alertCustom("Erro ao carregar dados da barbearia");
    }
  };

  useEffect(() => {
    getEstablishment();
  }, []);

  if (data.loading)
    return (
      <Box sx={{ height: "100%", width: "100%" }} className="justify-center">
        <LoadingBox message="Carregando informações..." />
      </Box>
    );

  if (!data)
    return (
      <Box className="justify-center">
        <LoadingBox message="Carregando..." />
      </Box>
    );
  return data.filaDinamicaClientes ? (
    <GerenciarFila alertCustom={alertCustom} />
  ) : isDesktop ? (
    <AgendamentosByCalendario alertCustom={alertCustom} data={data} />
  ) : (
    <Agendamentos alertCustom={alertCustom} data={data} />
  );
}
