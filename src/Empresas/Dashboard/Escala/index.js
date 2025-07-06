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
import { formatTime, getLocalItem } from "../../../Componentes/Funcoes";
import apiService from "../../../Componentes/Api/axios";
import EditableTable from "../../../Componentes/Table";
import { Close } from "@mui/icons-material";
import MenuSuspenso from "../../../Componentes/Popover/Suspenso";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const WorkSchedule = ({
  type = "button",
  openModal = false,
  dados,
  alertCustom,
  handleCloseModal,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [opened, setOpened] = useState(true);

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
      width: 40,
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
      placeholder: "DD/MM/YYYY",
      width: 120,
      format: (i, f, v, va) => formatTime(v, va),
    },
    {
      field: "fim",
      headerName: "Fim",
      editable: true,
      type: "text",
      placeholder: "DD/MM/YYYY",
      width: 120,
      format: (i, f, v, va) => formatTime(v, va),
    },
    {
      headerName: "Remover",
      headerName: "",
      width: 40,
      renderCell: (_, index) => (
        <Tooltip title="Excluir">
          <IconButton onClick={() => handleRemoveAbsence(index)}>
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => setOpen(openModal), [openModal]);

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
        onClose={handleCloseModal || (() => setOpen(false))}
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

          {
            titulo: "Limpar tudo",
            color: "terciary",
            action: handleClearAll,
          },
        ]}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Tabs
              value={tab}
              onChange={(e, val) => setTab(val)}
              sx={{
                mb: 2,
                mb: 2,
                "& .MuiTab-root": {
                  borderRadius: "0 !important",
                  minHeight: 48,
                  color: "text.secondary", // cor dos tabs não selecionados
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#fff",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "secondary.main", // cor da linha indicador do tab ativo
                },
              }}
            >
              <Tab
                label="Escala Semanal"
                sx={{ borderRadius: "0 !important", minHeight: 48 }}
              />
              <Tab
                label="Horário de Almoço"
                sx={{
                  borderRadius: "0 !important",
                  minHeight: 48,
                }}
              />
              <Tab
                label="Ausências"
                sx={{ borderRadius: "0 !important", minHeight: 48 }}
              />
            </Tabs>
          </Grid>

          <Grid size={12}>
            {tab === 0 && (
              <>
                <MenuSuspenso
                  open={opened}
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

                <EditableTable
                  columns={scheduleColumns}
                  rows={workDays}
                  onChange={setWorkDays}
                />
              </>
            )}

            {tab === 1 && (
              <EditableTable
                columns={lunchColumns}
                rows={lunchRows}
                onChange={setLunchRows}
              />
            )}

            {tab === 2 && (
              <EditableTable
                columns={absencesColumns}
                rows={absences}
                onChange={setAbsences}
              />
            )}
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default WorkSchedule;
