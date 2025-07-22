import React, { useEffect, useState } from "react";
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
import Modal from "../../../Componentes/Modal";
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
import SwipeIndicator from "../../../Componentes/Motion/Helpers/swipeIndicator";
import { useNavigate } from "react-router-dom";
import CustomTabs from "../../../Componentes/Tabs";

const WorkSchedule = ({
  type = "button",
  openModal = false,
  dados,
  alertCustom,
  handleCloseModal,
  disabled,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [opened, setOpened] = useState(false);
  const tabs = [
    { icon: <WorkIcon />, label: "Escala Semanal" },
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
  const [absences, setAbsences] = useState([
    { motivo: "", inicio: "", fim: "" },
  ]);

  const handleAddAbsence = () => {
    setAbsences([...absences, { motivo: "", inicio: "", fim: "" }]);
  };
  const handleRemoveAbsence = (indexToRemove) => {
    setAbsences((prev) => prev.filter((_, i) => i !== indexToRemove));
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
    setAbsences([{ motivo: "", inicio: "", fim: "" }]);
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

  const handleSave = async () => {
    try {
      await apiService.query(
        "PUT",
        `/user/${dados?.id || getLocalItem("userId")}`,
        workDays.map(({ day, ...rest }) => rest)
      );
      await apiService.query(
        "PATCH",
        `/user/${dados?.id || getLocalItem("userId")}`,
        { lunch: lunchRows, absences }
      );
      alertCustom("Escala de trabalho salva com sucesso!");
      setOpen(false);
    } catch (e) {
      alertCustom("Erro ao salvar a escala.");
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
      field: "inicio",
      headerName: "Início",
      editable: true,
      type: "text",
      placeholder: "DD/MM/YYYY HH:MM",
      width: 120,
      format: (i, f, v, va) => toUTC(v),
    },
    {
      field: "fim",
      headerName: "Fim",
      editable: true,
      type: "text",
      placeholder: "DD/MM/YYYY",
      width: 120,
      format: (i, f, v, va) => toUTC(v),
    },
    {
      headerName: "Remover",
      headerName: "",
      width: 80,
      renderCell: (_, index) => (
        <Tooltip title="Excluir">
          <IconButton onClick={() => handleRemoveAbsence(index)}>
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
            setAbsences(
              d.ausencia.map((a) => ({
                motivo: a.motivo || "",
                inicio: `${a.dia}T${a.horarioInicio}`,
                fim: `${a.dia}T${a.horarioFim}`,
              }))
            );
          }
        })

        .catch((error) => {
          console.log(error);
          alertCustom("Erro ao buscar escala");
        });
    };
    buscarEscala();
    setOpen(openModal);
  }, [openModal]);

  return (
    <>
      {type === "button" && (
        <Button
          disableElevation
          variant="contained"
          color="success"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          Configurar Escala
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleCloseModal ? () => handleCloseModal : () => navigate(-1)}
        onAction={handleSave}
        actionText="Salvar"
        titulo="Configurar Escala de Trabalho"
        fullScreen="all"
        maxWidth="md"
        component="view"
        buttons={[
          ...(tab == 2
            ? [
                {
                  titulo: "Adicionar Ausência",
                  color: "terciary",
                  action: handleAddAbsence,
                },
              ]
            : []),
          ...(tab == 0 && !opened
            ? [
                {
                  titulo: "Quero Ajuda",
                  color: "terciary",
                  action: handleGetHelp,
                },
              ]
            : []),
          {
            titulo: "Limpar tudo",
            color: "terciary",
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
                <EditableTable
                  columns={lunchColumns}
                  rows={lunchRows}
                  onChange={setLunchRows}
                />,
                <EditableTable
                  columns={absencesColumns}
                  rows={absences}
                  onChange={setAbsences}
                />,
              ]}
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default WorkSchedule;
