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
    funcionarioId: getLocalItem("userId"),
    funcionarioOrigemId: getLocalItem("userId"),
    startHour: 9,
    endHour: 18,
    funcionarios: [],
    options: [],
  });
  const _setData = (v) => setData((prev) => ({ ...prev, ...v }));

  const getEstablishment = async () => {
    try {
      if (!data.funcionarioId) return;
      setData((prev) => ({ ...prev, loading: true }));
      const { horarioAbertura, horarioFechamento, funcionarios } =
        await apiService.query(
          "GET",
          `/establishment?establishmentId=${localStorage.getItem(
            "establishmentId"
          )}`
        );

      _setData({
        filaDinamicaClientes:
          funcionarios.find(({ id }) => id === data.funcionarioId)
            ?.filaDinamicaClientes || false,
        loading: false,
        startHour: normalizeHour(horarioAbertura, "down"),
        endHour: normalizeHour(horarioFechamento, "up"),
        funcionarios: funcionarios || [],
        funcionarioOrigemId: getLocalItem("userId"),
      });
    } catch (error) {
      alertCustom("Erro ao carregar dados da barbearia");
    }
  };

  useEffect(() => {
    getEstablishment();
  }, [data.funcionarioId]);

  useEffect(() => {
    const temp = data.funcionarios.map((f) => ({
      value: f.id,
      label: `${primeiraMaiuscula(f.nome)} - ${f.telefone}`,
    }));
    const atual = temp.find(({ value }) => value === getLocalItem("userId"));

    _setData({ options: temp, funcionarioId: atual?.value });
  }, [data.funcionarios]);

  useEffect(() => {
    console.log("funcionarioId", data.funcionarioId);
  }, [data.funcionarioId]);

  const handleScheduleToOtherBarber = () => {
    const direction =
      data.funcionarioId !== data.funcionarioOrigemId ? "add" : "remove";

    if (direction === "add" && data.funcionarioId) {
      setLocalItem("add_client_to_employee", data.funcionarioId);
      setLocalItem(
        "add_client_to_employee_name",
        data.funcionarios.find((f) => f.id === data.funcionarioId)?.nome
      );
    }

    if (direction === "remove" || !data.funcionarioId) {
      localStorage.removeItem("add_client_to_employee");
      localStorage.removeItem("add_client_to_employee_name");
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
