import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Container,
  Grid2 as Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { formatDataToString, isMobile } from "../../Funcoes";
import BoxSuspenso from "../../Popover/Suspenso";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Preview } from "react-dnd-multi-backend";
import { LoadingBox } from "../../Custom";

const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: undefined,
    },
    {
      id: "touch",
      backend: TouchBackend,
      preview: true,
      transition: TouchTransition,
      options: {
        enableMouseEvents: true,
      },
    },
  ],
};

const ItemTypes = {
  EVENT: "event",
};

const isDisabledDateTime = (disabledRanges, dateTime) => {
  if (!Array.isArray(disabledRanges)) return false;

  return disabledRanges.some(({ inicio, fim }) => {
    if (!inicio || !fim) return false;
    return dateTime >= inicio && dateTime < fim;
  });
};

function Event({ event, onSelect, onDelete, allowDrag }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.EVENT,
      item: { id: event.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: allowDrag,
    }),
    [event.id, allowDrag]
  );

  if (isDragging) return null;

  // Altura proporcional à duração em minutos (2px por minuto)
  const eventHeight = event.duration * 2;

  // top fixo dentro da célula, já que cada célula corresponde a 10 minutos (20px de altura)
  const topPx = 2;

  return (
    <Paper
      ref={allowDrag ? drag : null}
      onClick={() => onSelect(event)}
      sx={{
        position: "absolute",
        top: topPx,
        left: 4,
        right: 4,
        height: eventHeight,
        bgcolor: event.color || "#00aaff",
        color: "#fff",
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        overflow: "hidden",
        zIndex: 99,
        userSelect: "none",
        borderRadius: "6px",
        cursor: allowDrag ? "grab" : "grabbing !important",
        p: 1,
      }}
    >
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body2" fontWeight="bold" flexGrow={1} noWrap>
          {event.title}
        </Typography>
        {onDelete && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            sx={{ color: "white" }}
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Typography variant="body2">{event.description}</Typography>
    </Paper>
  );
}

function Cell({ day, hour, minute, children, onDropEvent, onCellClick }) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item) => onDropEvent(item.id, day, hour, minute),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [day, hour, minute, onDropEvent]
  );

  return (
    <div
      ref={drop}
      onClick={() => onCellClick(day, hour, minute)}
      style={{
        height: 20,
        position: "relative",
        cursor: "pointer",
        backgroundColor: isOver && canDrop ? "#555" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default function WeekCalendar({
  events = [],
  onAction = () => {},
  actionText = "Novo Evento",
  actionIcon = null,
  tools,
  toolsText = "Opções",
  disable = null,
  allowEventMove = true,
  onEventClick = () => {},
  onEventMove = () => {},
  onWeekChange = () => {},
  onCellClick = () => {},
  onError = () => {},
  legend,
  startHour = 7,
  endHour = 20,
  loading = false,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [internalEvents, setInternalEvents] = useState([]);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Sincroniza internalEvents com props.events (se precisar)
  useEffect(() => {
    // Certifica que eventos tenham Date no campo 'date'
    const evs = events.map((ev) => ({
      ...ev,
      date: ev.date instanceof Date ? ev.date : new Date(ev.date),
    }));
    setInternalEvents(evs);
  }, [events]);

  // Calcula começo da semana (segunda-feira)
  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = d.getDate() - day; // volta para domingo
    d.setHours(0, 0, 0, 0);
    d.setDate(diff);

    return d;
  }, [currentDate]);

  const weekDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [startOfWeek]
  );

  // useEffect(() => {
  //   const sunday = new Date(startOfWeek);
  //   sunday.setHours(0, 0, 0, 0);

  //   const saturday = new Date(sunday);
  //   saturday.setDate(saturday.getDate() + 6);
  //   saturday.setHours(0, 0, 0, 0);
  //   console.log("calculei de novo ", saturday, sunday);
  //   onWeekChange(saturday, sunday);
  // }, [startOfWeek]);

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  // Atualiza evento na nova data/hora/minuto
  const handleDropEvent = (id, dayIndex, hour, minute) => {
    const newDate = new Date(weekDates[dayIndex]);
    newDate.setHours(hour, minute, 0, 0);

    const eventoExistente = internalEvents.find(
      (ev) => ev.id !== id && ev.date.getTime() === newDate.getTime()
    );

    if (eventoExistente) {
      onError({
        message: "Já existe um evento nesse horário.",
      });
      return; // impede sobreposição
    }

    const updated = internalEvents.map((ev) =>
      ev.id === id ? { ...ev, date: newDate } : ev
    );

    setInternalEvents(updated);
    onEventMove(
      updated.find((e) => e.id === id),
      newDate
    );
  };

  // Formata cabeçalho dias da semana
  const renderDay = (date) => {
    const parts = date
      .toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })
      .split(".,");

    return (
      <Box>
        <Typography variant="h6">{parts[1]}</Typography>
        <Typography variant="body2" color="GrayText">
          {parts[0].toUpperCase()}
        </Typography>
      </Box>
    );
  };
  // useEffect(() => {
  //   const sunday = new Date(startOfWeek);
  //   sunday.setHours(0, 0, 0, 0);

  //   const saturday = new Date(sunday);
  //   saturday.setDate(saturday.getDate() + 6);
  //   saturday.setHours(0, 0, 0, 0);
  //   console.log("calculei de novo ", saturday, sunday);
  //   onWeekChange(saturday, sunday);
  // }, [startOfWeek]);

  const goWeek = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + dir * 7);
    setCurrentDate(newDate);

    const sunday = new Date(newDate);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);
    onWeekChange(saturday, sunday);
  };

  const generatePreview = ({ itemType, item, style }) => {
    if (itemType === "event") {
      return (
        <div
          style={{
            ...style,
            padding: "4px 6px",
            backgroundColor: "#00aaff",
            color: "#fff",
            borderRadius: "6px",
            width: "150px",
            zIndex: 9999,
          }}
        >
          {item.title || "Evento"}
        </div>
      );
    }
    return null;
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {isMobile && <Preview generator={generatePreview} />}
      <Container
        maxWidth="lg"
        sx={{
          p: 2,
          borderRadius: "10px",
          color: "#fff",
          overflowX: "auto",
        }}
      >
        <Grid container justifyContent="center">
          <Grid size={12}>
            <Box className="justify-between-wrap" sx={{ my: 3 }}>
              {" "}
              <Box
                className="justify-center-wrap"
                sx={{
                  gap: 1,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={onAction}
                  startIcon={actionIcon}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  disableElevation={0}
                >
                  {actionText}
                </Button>
                <IconButton onClick={() => goWeek(-1)}>
                  <ChevronLeftRoundedIcon sx={{ color: "white" }} />
                </IconButton>
                <IconButton onClick={() => goWeek(1)}>
                  <ChevronRightRoundedIcon sx={{ color: "white" }} />
                </IconButton>
                <Typography variant="h6" sx={{ userSelect: "none" }}>
                  {formatDataToString(startOfWeek.toISOString(), [
                    "mes",
                    "ano",
                  ])}
                </Typography>{" "}
                {loading && (
                  <IconButton disabled>
                    <CircularProgress color="inherit" size={25} />
                  </IconButton>
                )}
              </Box>
              {tools && (
                <>
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    {tools}
                  </Box>
                  <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    {" "}
                    <BoxSuspenso
                      title={toolsText}
                      open={toolsOpen}
                      setOpen={setToolsOpen}
                      icon={<FilterAltIcon />}
                      button={true}
                    >
                      {tools}
                    </BoxSuspenso>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
          {legend && <Grid size={12}>{legend}</Grid>}

          <Grid
            size={12}
            sx={{
              overflowX: "auto",
              background: "#212121",
              p: "24px",
              borderRadius: "24px",
            }}
            elevation={0}
            component={Paper}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
                userSelect: "none",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: 8, width: 60 }}></th>
                  <th style={{ width: "10px" }}></th>
                  {weekDates.map((date, i) => (
                    <th key={i} style={{ padding: 8, textAlign: "center" }}>
                      {renderDay(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <td
                      key={i}
                      style={{
                        borderRight: "1px solid #444",
                        height: "15px",
                      }}
                    ></td>
                  ))}
                </tr>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "start",
                        fontWeight: "bold",
                        display: "flex",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ marginTop: "-22px" }}>{`${hour
                        .toString()
                        .padStart(2, "0")}:00`}</span>
                    </td>
                    <td
                      style={{
                        borderTop: "1px solid #444",
                        borderBottom: "1px solid #444",
                        width: "10px",
                      }}
                    ></td>
                    {weekDates.map((date, dayIndex) => (
                      <td
                        key={dayIndex}
                        style={{
                          border: "1px solid #444",
                          height: 120,
                          verticalAlign: "top",
                          padding: 0,
                          position: "relative",
                        }}
                      >
                        {Array.from({ length: 6 }).map((_, subIndex) => {
                          const cellStartMinute = subIndex * 10;

                          const cellDateTime = new Date(date);
                          cellDateTime.setHours(hour, cellStartMinute, 0, 0);

                          const cellEvents = internalEvents.filter((ev) => {
                            const evDate = ev.date;
                            return (
                              evDate.toDateString() ===
                                cellDateTime.toDateString() &&
                              evDate.getHours() === hour &&
                              evDate.getMinutes() >= cellStartMinute &&
                              evDate.getMinutes() < cellStartMinute + 10
                            );
                          });
                          const isDisabled = isDisabledDateTime(
                            disable,
                            cellDateTime
                          );
                          return (
                            <Cell
                              key={subIndex}
                              day={dayIndex}
                              hour={hour}
                              minute={cellStartMinute}
                              onDropEvent={
                                isDisabled
                                  ? () =>
                                      onError({
                                        message: "Horário não disponível",
                                      })
                                  : handleDropEvent
                              }
                              onCellClick={
                                isDisabled
                                  ? () =>
                                      onError({
                                        message: "Horário não disponível",
                                      })
                                  : onCellClick
                              }
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: isDisabled
                                    ? "#333"
                                    : undefined,
                                  opacity: isDisabled ? 0.5 : 1,
                                  pointerEvents: isDisabled ? "none" : "auto",
                                }}
                              >
                                {cellEvents.map((event) => {
                                  const isDisabledEvent = isDisabledDateTime(
                                    disable,
                                    event.date
                                  );
                                  return (
                                    <Event
                                      key={event.id}
                                      event={event}
                                      onSelect={onEventClick}
                                      // onDelete={() => {}}
                                      allowDrag={
                                        allowEventMove && !isDisabledEvent
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </Cell>
                          );
                        })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
}
