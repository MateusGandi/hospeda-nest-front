import React, { use, useEffect, useState } from "react";
import {
  Button,
  Switch,
  Typography,
  Grid2 as Grid,
  Box,
  Tabs,
  Tab,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import {
  formatTime,
  getLocalItem,
  isMobile,
  toUTC,
} from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";
import EditableTable from "../../../Componentes/Table";
import { Close } from "@mui/icons-material";
import MenuSuspenso from "../../../Componentes/Popover/Suspenso";

import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WorkIcon from "@mui/icons-material/Work";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import SwipeIndicator from "../../../Componentes/Motion/Helpers/swipeIndicator";
import { useNavigate } from "react-router-dom";
import CustomTabs from "../../../Componentes/Tabs";
import View from "../../../Componentes/View";
import Preferencies from "./Preferencies";

const WorkSchedule = ({
  type = "button",
  openModal = false,
  dados,
  alertCustom,
  disabled,
  handleCloseModal,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [opened, setOpened] = useState(false);
  const tabs = [
    { icon: <WorkIcon />, label: "Escala Semanal" },
    { icon: <ManageAccountsRoundedIcon />, label: "Preferências" },
    { icon: <LunchDiningIcon />, label: "Horário de Almoço" },
    { icon: <LocalCafeIcon />, label: "Ausências" },
  ];
  const [workDays, setWorkDays] = useState(
    [...Array(7)].map((_, i) => ({
      diaSemana: i % 7,
      day: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ][i % 7],
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    }))
  );

  const [lunchRows, setLunchRows] = useState([{ inicio: "", fim: "" }]);
  const [absences, setAbsences] = useState([]);
  const [form, setForm] = useState({
    filaDinamicaClientes: false,
    clientesPodemEntrarNaFila: false,
  });

  const handleAddAbsence = () => {
    setAbsences([
      ...absences,
      { motivo: "", horarioInicio: "", horarioFim: "" },
    ]);
  };

  const handleRemoveAbsence = async (id, indexToRemove) => {
    setAbsences((prev) => prev.filter((_, i) => i !== indexToRemove));
    if (id) {
      await apiService.query("DELETE", `/user/fault/${id}`).catch((error) => {
        console.error("Erro ao remover ausência:", error);
        alertCustom("Erro ao remover ausência.");
      });
    }
  };

  const handleGetHelp = () => {
    setOpened(true);
  };

  const handleClearAll = () => {
    setWorkDays(
      [...Array(7)].map((_, i) => ({
        diaSemana: i % 7,
        day: [
          "Domingo",
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
        ][i % 7],
        horarioForaInicial: "",
        horarioForaFinal: "",
        ativo: false,
      }))
    );
    setLunchRows([{ inicio: "", fim: "" }]);
    setAbsences([]);
  };

  const setDefaultSchedule = () => {
    const updated = workDays.map((day, index) => ({
      ...day,
      horarioForaInicial: index < 6 ? "08:00" : "00:00",
      horarioForaFinal: index < 6 ? "18:00" : "00:00",
      ativo: index < 6,
    }));
    setWorkDays(updated);
    setLunchRows([{ inicio: "12:00", fim: "13:00" }]);
    setOpened(false);
  };

  const fetch = async () => {
    try {
      const { filaDinamicaClientes, clientesPodemEntrarNaFila } =
        await apiService.query(
          "GET",
          `/user/profile/${getLocalItem("userId")}`
        );
      setForm((prev) => ({
        ...prev,
        clientesPodemEntrarNaFila: clientesPodemEntrarNaFila,
        filaDinamicaClientes: filaDinamicaClientes,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados da conta:", error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const id = dados?.id || getLocalItem("userId");
      await apiService.query("PATCH", `/user/${id}`, {
        filaDinamicaClientes: form.filaDinamicaClientes,
        clientesPodemEntrarNaFila: form.clientesPodemEntrarNaFila,
      });
      await apiService.query(
        "PUT",
        `/user/work-schedule/${id}`,
        workDays.map(({ day, ...rest }) => rest)
      );
      if (lunchRows[0].fim.length == 5 && lunchRows[0].fim.length == 5)
        await apiService.query("PUT", `/user/off-hour/${id}`, {
          horarioForaFinal: lunchRows[0].fim + ":00" || "00:00:00",
          horarioForaInicial: lunchRows[0].fim + ":00" || "00:00:00",
        });
      await apiService.query(
        "POST",
        `/user/fault/${id}`,
        absences.map((a) => ({
          ...a,
          dia: a.dia.split("T")[0],
          horarioInicio: a.horarioInicio,
          horarioFim: a.horarioFim,
          funcionarioId: id,
        }))
      );

      alertCustom("Escala de trabalho e preferências salvas com sucesso!");
      setOpen(false);
    } catch (e) {
      console.log(e);
      alertCustom("Erro ao salvar a escala.");
    } finally {
      setLoading(false);
    }
  };

  const scheduleColumns = [
    {
      field: "ativo",
      headerName: "Ativo",
      type: "",
      editable: true,
      width: 80,
      renderCell: (row, rowIndex) => (
        <Switch
          checked={row.ativo}
          onChange={() => {
            const updated = [...workDays];
            updated[rowIndex].ativo = !updated[rowIndex].ativo;
            setWorkDays(updated);
          }}
        />
      ),
    },
    {
      field: "day",
      headerName: "Dia da Semana",
      editable: false,
      type: "",
      width: 160,
    },
    {
      field: "horarioForaInicial",
      headerName: "Início",
      editable: true,
      type: "text",
      placeholder: "HH:MM",
      width: 100,
      format: (i, f, v, va) => formatTime(v, va),
    },
    {
      field: "horarioForaFinal",
      headerName: "Fim",
      editable: true,
      type: "text",
      placeholder: "HH:MM",
      width: 100,
      format: (i, f, v, va) => formatTime(v ?? va, va),
    },
  ];

  const lunchColumns = [
    {
      field: "inicio",
      headerName: "Início",
      editable: true,
      type: "text",
      placeholder: "HH:MM",
      width: 120,
      format: (i, f, v, va) => formatTime(v, va),
    },
    {
      field: "fim",
      headerName: "Fim",
      editable: true,
      type: "text",
      placeholder: "HH:MM",
      width: 120,
      format: (i, f, v, va) => formatTime(v, va),
    },
  ];

  const absencesColumns = [
    {
      field: "motivo",
      headerName: "Motivo",
      editable: true,
      type: "text",
      placeholder: "Digite o motivo da ausência...",
      width: 200,
    },
    {
      field: "dia",
      headerName: "Dia",
      editable: true,
      type: "date",
      width: 140,
      placeholder: "DD/MM/YYYY",
    },
    {
      field: "horarioInicio",
      headerName: "Horário Inicial",
      editable: true,
      type: "text",
      width: 100,
      format: (i, f, v, va) => formatTime(v, va),
      placeholder: "HH:MM",
    },
    {
      field: "horarioFim",
      headerName: "Horário Fim",
      editable: true,
      type: "text",
      width: 100,
      format: (i, f, v, va) => formatTime(v, va),
      placeholder: "HH:MM",
    },
    {
      headerName: "Remover",
      headerName: "",
      width: 50,
      renderCell: (value, index) => (
        <Tooltip title="Excluir">
          <IconButton onClick={() => handleRemoveAbsence(value.id, index)}>
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const buscarEscala = async () => {
      await apiService
        .query(
          "GET",
          `/user/setted-times/${dados?.id || getLocalItem("userId")}`
        )
        .then((d) => {
          const escala = [...Array(7)].map((_, i) => {
            const dia = d.escala?.find((item) => item.diaSemana === i);
            return {
              diaSemana: i,
              day: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado",
              ][i],
              horarioForaInicial: dia?.horarioInicio?.slice(0, 5) || "",
              horarioForaFinal: dia?.horarioFim?.slice(0, 5) || "",
              ativo: !!dia,
            };
          });
          setWorkDays(escala);

          if (d.almoco?.horaInicio && d.almoco?.horaFim) {
            setLunchRows([
              {
                inicio: d.almoco.horaInicio.slice(0, 5),
                fim: d.almoco.horaFim.slice(0, 5),
              },
            ]);
          }

          if (Array.isArray(d.ausencia)) {
            const updated = d.ausencia.map((a) => {
              const dia = new Date(a.dia);
              dia.setHours(dia.getHours() + 6);

              return {
                ...a,
                dia: dia.toISOString(),
                motivo: a.motivo || "",
                horarioInicio: a.horarioInicio,
                horarioFim: a.horarioFim,
              };
            });
            setAbsences(updated);
          }
        })

        .catch((error) => {
          console.log(error);
          alertCustom("Erro ao buscar escala");
        });
    };
    fetch();
    buscarEscala();
    setOpen(openModal);
    setForm((prev) => ({ ...prev, ...dados }));
  }, [openModal]);

  const handleChangePreferences = async (props) => {
    const { id, clientesPodemEntrarNaFila } = props;
    if ("id" in props)
      setForm((prev) => ({
        ...prev,
        filaDinamicaClientes: id,
      }));

    if ("clientesPodemEntrarNaFila" in props)
      setForm((prev) => ({
        ...prev,
        clientesPodemEntrarNaFila,
      }));
  };

  return (
    <>
      {type === "button" && (
        <Button
          sx={{ minWidth: "200px" }}
          disableElevation
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          Configurar
        </Button>
      )}

      {isMobile || type === "button" ? (
        <Modal
          open={open}
          onClose={
            handleCloseModal ? () => handleCloseModal : () => navigate(-1)
          }
          onAction={handleSave}
          loadingButton={loading}
          actionText="Salvar"
          titulo="Configurar Escala de Trabalho"
          fullScreen="all"
          maxWidth="md"
          component="view"
          buttons={[
            ...(tab == 3
              ? [
                  {
                    titulo: "Adicionar Ausência",
                    color: "terciary",
                    action: handleAddAbsence,
                    disabled: loading,
                  },
                ]
              : []),
            ...(tab == 0 && !opened
              ? [
                  {
                    titulo: "Quero Ajuda",
                    color: "terciary",
                    action: handleGetHelp,
                    disabled: loading,
                  },
                ]
              : []),
            {
              titulo: "Limpar tudo",
              color: "terciary",
              disabled: loading,
              action: handleClearAll,
            },
          ]}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <CustomTabs
                tabs={tabs}
                onChange={(e) => setTab(e)}
                selected={tab}
                views={[
                  <>
                    <MenuSuspenso
                      open={opened}
                      fixedButton={false}
                      setOpen={setOpened}
                      icon={<LightbulbIcon />}
                      title="Personalizar escala"
                    >
                      <Typography variant="body1">
                        Use escalas predefinidas para facilitar a configuração.
                      </Typography>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1}
                        sx={{ mt: 4, justifyContent: "center" }}
                      >
                        <Button
                          variant="text"
                          fullWidth
                          disableElevation
                          color="terciary"
                          onClick={() => setOpened(false)}
                        >
                          Continuar
                        </Button>
                        <Button
                          disableElevation
                          variant="contained"
                          fullWidth
                          onClick={setDefaultSchedule}
                        >
                          Aplicar escala 6x1
                        </Button>
                      </Stack>
                    </MenuSuspenso>
                    <SwipeIndicator>
                      <EditableTable
                        columns={scheduleColumns}
                        rows={workDays}
                        onChange={setWorkDays}
                      />
                    </SwipeIndicator>
                  </>,
                  <Preferencies
                    onChange={handleChangePreferences}
                    form={form}
                  />,
                  <SwipeIndicator>
                    <EditableTable
                      columns={lunchColumns}
                      rows={lunchRows}
                      onChange={setLunchRows}
                    />
                  </SwipeIndicator>,
                  <SwipeIndicator>
                    <EditableTable
                      columns={absencesColumns}
                      rows={absences}
                      onChange={setAbsences}
                    />
                  </SwipeIndicator>,
                ]}
              />
            </Grid>
          </Grid>
        </Modal>
      ) : (
        <View
          open={open}
          onClose={
            handleCloseModal ? () => handleCloseModal : () => navigate(-1)
          }
          loadingButton={loading}
          onAction={handleSave}
          actionText="Salvar"
          titulo="Configurar Escala de Trabalho"
          fullScreen="all"
          maxWidth="md"
          component="view"
          buttons={[
            ...(tab == 3
              ? [
                  {
                    titulo: "Adicionar Ausência",
                    color: "terciary",
                    action: handleAddAbsence,
                    disabled: loading,
                  },
                ]
              : []),
            ...(tab == 0 && !opened
              ? [
                  {
                    titulo: "Quero Ajuda",
                    color: "terciary",
                    action: handleGetHelp,
                    disabled: loading,
                  },
                ]
              : []),
            {
              titulo: "Limpar tudo",
              color: "terciary",
              action: handleClearAll,
              disabled: loading,
            },
          ]}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <CustomTabs
                tabs={tabs}
                onChange={(e) => setTab(e)}
                selected={tab}
                views={[
                  <>
                    <MenuSuspenso
                      open={opened}
                      fixedButton={false}
                      setOpen={setOpened}
                      icon={<LightbulbIcon />}
                      title="Personalizar escala"
                    >
                      <Typography variant="body1">
                        Use escalas predefinidas para facilitar a configuração.
                      </Typography>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1}
                        sx={{ mt: 4, justifyContent: "center" }}
                      >
                        <Button
                          variant="text"
                          fullWidth
                          disableElevation
                          color="terciary"
                          onClick={() => setOpened(false)}
                        >
                          Continuar
                        </Button>
                        <Button
                          disableElevation
                          variant="contained"
                          fullWidth
                          onClick={setDefaultSchedule}
                        >
                          Aplicar escala 6x1
                        </Button>
                      </Stack>
                    </MenuSuspenso>
                    <SwipeIndicator>
                      <EditableTable
                        columns={scheduleColumns}
                        rows={workDays}
                        onChange={setWorkDays}
                      />
                    </SwipeIndicator>
                  </>,
                  <Preferencies
                    onChange={handleChangePreferences}
                    form={form}
                  />,
                  <SwipeIndicator>
                    <EditableTable
                      columns={lunchColumns}
                      rows={lunchRows}
                      onChange={setLunchRows}
                    />
                  </SwipeIndicator>,
                  <SwipeIndicator>
                    <EditableTable
                      columns={absencesColumns}
                      rows={absences}
                      onChange={setAbsences}
                    />
                  </SwipeIndicator>,
                ]}
              />
            </Grid>
          </Grid>
        </View>
      )}
    </>
  );
};

export default WorkSchedule;
