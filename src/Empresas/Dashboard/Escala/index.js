import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Typography,
  Grid2 as Grid,
  Divider,
  Box,
} from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { CustomInput } from "../../../Componentes/Custom";
import { getLocalItem, isMobile } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import apiService from "../../../Componentes/Api/axios";
import { formatTime } from "../../../Componentes/Funcoes";

const WorkSchedule = ({
  type = "button",
  openModal = false,
  dados,
  alertCustom,
  handleCloseModal,
}) => {
  const [open, setOpen] = useState(false);
  const [workDays, setWorkDays] = useState([
    {
      diaSemana: 1,
      day: "Segunda-feira",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 2,
      day: "Terça-feira",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 3,
      day: "Quarta-feira",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 4,
      day: "Quinta-feira",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 5,
      day: "Sexta-feira",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 6,
      day: "Sábado",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
    {
      diaSemana: 0,
      day: "Domingo",
      horarioForaInicial: "",
      horarioForaFinal: "",
      ativo: false,
    },
  ]);

  const [lunchTime, setLunchTime] = useState({
    horarioForaInicial: "",
    horarioForaFinal: "",
  });

  const handleTimeChange = (index, field, value) => {
    const updated = [...workDays];
    updated[index][field] = formatTime(updated[index][field], value);
    setWorkDays(updated);
  };

  const handleativoChange = (index) => {
    const updated = [...workDays];
    updated[index].ativo = !updated[index].ativo;
    setWorkDays(updated);
  };

  const handleLunchTimeChange = (field, value) => {
    setLunchTime({
      ...lunchTime,
      [field]: formatTime(lunchTime[field], value),
    });
  };

  const setDefaultSchedule = (type) => {
    const updated = workDays.map((day, index) => {
      const isWorkDay =
        (type === "6x1" ? index < 6 : index < 5) && type != "default";
      return {
        ...day,
        horarioForaInicial: isWorkDay ? "08:00" : "00:00",
        horarioForaFinal: isWorkDay ? "18:00" : "00:00",
        ativo: isWorkDay,
      };
    });
    setWorkDays(updated);
    setLunchTime({ horarioForaInicial: "12:00", horarioForaFinal: "13:00" });
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
        lunchTime
      );
      alertCustom("Escala de trabalho salva com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Error saving work schedule:", error);
      alertCustom("Ocorreu um erro ao salvar a escala!");
    }
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  return (
    <>
      {type == "button" && (
        <Box sx={{ width: "100%", pt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            onClick={() => setOpen(true)}
          >
            Configurar Escala
          </Button>
        </Box>
      )}

      <Modal
        open={open}
        onClose={openModal ? handleCloseModal : () => setOpen(false)}
        onAction={handleSave}
        actionText="Salvar"
        titulo="Configurar Escala de Trabalho"
        fullScreen="all"
        maxWidth="md"
        component={"view"}
        modalStyle={{ background: "red" }}
        disablePadding={isMobile}
      >
        <Grid container spacing={3}>
          <Grid size={12} sx={{ mb: 2 }}>
            <Typography variant="body1" className="show-box">
              <Typography variant="h6">
                <Icon>💡</Icon> Personalizar escala
              </Typography>
              Você pode definir os dias e horários de trabalho do funcionário,
              assim como o horário de almoço. Use escalas predefinidas para
              facilitar a configuração!
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setDefaultSchedule("6x1")}
                >
                  Configurar 6x1 (Seg-Sáb)
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setDefaultSchedule("5x2")}
                >
                  Configurar 5x2 (Seg-Sex)
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setDefaultSchedule("default")}
                >
                  Limpar
                </Button>
              </Stack>
            </Typography>
          </Grid>
          {/* {!isMobile && (
            <>
              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{ textAlign: "center" }}
                component="typography"
              >
                Dia da semana
              </Grid>
              <Grid size={{ xs: 12, md: 3.5 }} component="typography">
                Horário de início da jornada
              </Grid>
              <Grid size={{ xs: 12, md: 3.5 }} component="typography">
                Horário de fim da jornada
              </Grid>
            </>
          )} */}
          {workDays.map((day, index) => (
            <>
              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{ minHeight: { xs: 0, md: "50px" }, pl: 2 }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={day.ativo}
                      onChange={() => handleativoChange(index)}
                      color="primary"
                      size="large"
                    />
                  }
                  label={day.day}
                />
              </Grid>

              {day.ativo ? (
                <>
                  {" "}
                  <Grid size={{ xs: 6, md: 3.5 }}>
                    <CustomInput
                      label="Início"
                      value={day.horarioForaInicial}
                      onChange={(e) =>
                        handleTimeChange(
                          index,
                          "horarioForaInicial",
                          e.target.value
                        )
                      }
                      fullWidth
                      placeholder="HH:MM"
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3.5 }}>
                    <CustomInput
                      label="Fim"
                      value={day.horarioForaFinal}
                      onChange={(e) =>
                        handleTimeChange(
                          index,
                          "horarioForaFinal",
                          e.target.value
                        )
                      }
                      fullWidth
                      placeholder="HH:MM"
                    />
                  </Grid>
                </>
              ) : (
                <Grid size={{ xs: 0, md: 7 }}> </Grid>
              )}
            </>
          ))}{" "}
          <Grid size={12}>
            <Typography variant="h6">Horário de Almoço</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Início"
              value={lunchTime.horarioForaInicial}
              onChange={(e) =>
                handleLunchTimeChange("horarioForaInicial", e.target.value)
              }
              placeholder="HH:MM"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Fim"
              value={lunchTime.horarioForaFinal}
              onChange={(e) =>
                handleLunchTimeChange("horarioForaFinal", e.target.value)
              }
              placeholder="HH:MM"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}></Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default WorkSchedule;
