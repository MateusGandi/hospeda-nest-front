import { Box, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";
import Agendamentos from "./Rows";
import AgendamentosByCalendario from "./Columns";
import apiService from "../../../Componentes/Api/axios";
import { useEffect, useState } from "react";
import {
  getLocalItem,
  normalizeHour,
  primeiraMaiuscula,
  setLocalItem,
} from "../../../Componentes/Funcoes";
import { CustomSelect, LoadingBox } from "../../../Componentes/Custom";
import { GerenciarFila } from "./Fila";

export default function AgendamentosView({ alertCustom }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [data, setData] = useState({
    loading: true,
    filaDinamicaClientes: false,
    funcionarioId: null,
    funcionarioAtual: null,
    startHour: 9,
    endHour: 18,
    funcionarios: [],
    options: [],
  });
  const _setData = (v) => setData((prev) => ({ ...prev, ...v }));

  useEffect(() => {
    _setData({
      funcionarioId: getLocalItem("userId"),
      funcionarioAtual: getLocalItem("userId"),
    });
  }, []);

  const getEstablishment = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));
      const id = getLocalItem("establishmentId");

      const { horarioAbertura, horarioFechamento, funcionarios } =
        await apiService.query("GET", `/establishment?establishmentId=${id}`);

      const { filaDinamicaClientes } =
        funcionarios.find(({ id }) => id === data.funcionarioId) || {};

      _setData({
        filaDinamicaClientes: !!filaDinamicaClientes,
        loading: false,
        startHour: normalizeHour(horarioAbertura, "down"),
        endHour: normalizeHour(horarioFechamento, "up"),
        funcionarios: funcionarios || [],
      });
    } catch (error) {
      alertCustom("Erro ao carregar dados da barbearia");
    }
  };

  useEffect(() => {
    data.funcionarioId && getEstablishment();
  }, [data.funcionarioId]);

  useEffect(() => {
    const temp = data.funcionarios.map((f) => ({
      value: f.id,
      label: `${primeiraMaiuscula(f.nome)} - ${f.telefone}`,
    }));

    _setData({ options: temp });
  }, [data.funcionarios]);

  const handleScheduleToOtherBarber = () => {
    const direction =
      data.funcionarioId !== data.funcionarioAtual && data.funcionarioId
        ? "add"
        : "remove";

    const barber = data.funcionarios.find((f) => f.id === data.funcionarioId);
    if (direction === "add" && barber) {
      setLocalItem("barberId", data.funcionarioId);
      setLocalItem("barberName", barber.nome);
    } else if (direction === "remove") {
      localStorage.removeItem("barberId");
      localStorage.removeItem("barberName");
    }
  };

  useEffect(() => {
    handleScheduleToOtherBarber();
  }, [data.funcionarioId]);

  if (data.loading || !data.funcionarioId)
    return (
      <Box sx={{ height: "100%", width: "100%" }} className="justify-center">
        <LoadingBox message="Carregando informações..." />
      </Box>
    );

  return data.filaDinamicaClientes ? (
    <GerenciarFila alertCustom={alertCustom} data={data} setData={_setData} />
  ) : isDesktop ? (
    <AgendamentosByCalendario
      alertCustom={alertCustom}
      data={data}
      setData={_setData}
    />
  ) : (
    <Agendamentos alertCustom={alertCustom} data={data} setData={_setData} />
  );
}
