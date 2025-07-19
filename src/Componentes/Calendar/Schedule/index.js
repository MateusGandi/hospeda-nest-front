import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Container,
  Grid2 as Grid,
  Button,
} from "@mui/material";
import { Close, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { formatDataToString } from "../../Funcoes";
import BoxSuspenso from "../../Popover/Suspenso";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const ItemTypes = {
  EVENT: "event",
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
        bgcolor: "#00aaff",
        color: "#fff",
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        overflow: "hidden",
        zIndex: 99,
        cursor: allowDrag ? "grab" : "default",
        userSelect: "none",
        borderRadius: "6px",
      }}
    >
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box sx={{ mr: 1, fontSize: 18, userSelect: "none" }}>⠿</Box>
        <Typography variant="body2" fontWeight="bold" flexGrow={1} noWrap>
          {event.title}
        </Typography>
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
      </Box>
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
  disabledTime = [],
  allowEventMove = true,
  onEventClick = () => {},
  onEventMove = () => {},
  onWeekChange = () => {},
  onCellClick = () => {},
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

  const hours = Array.from({ length: 11 }, (_, i) => 13 + i);

  // Atualiza evento na nova data/hora/minuto
  const handleDropEvent = (id, dayIndex, hour, minute) => {
    const newDate = new Date(weekDates[dayIndex]);
    newDate.setHours(hour, minute, 0, 0);

    const updated = internalEvents.map((ev) =>
      ev.id === id ? { ...ev, date: newDate } : ev
    );
    setInternalEvents(updated);
    onEventMove(updated.find((e) => e.id === id));
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

  const goWeek = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + dir * 7);
    setCurrentDate(newDate);
    onWeekChange(newDate);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
            <Box className="justify-between-wrap" sx={{ mb: 2 }}>
              {" "}
              <Box
                className="justify-center-wrap"
                sx={{
                  gap: 1,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button
                  variant="outlined"
                  color="terciary"
                  size="large"
                  onClick={onAction}
                  startIcon={actionIcon}
                  sx={{ width: { xs: "100%", md: "auto" } }}
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
                </Typography>
              </Box>
              {tools && (
                <>
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    {tools}
                  </Box>
                  <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    {" "}
                    <BoxSuspenso
                      title="Opções"
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
          <Grid
            size={12}
            sx={{ p: 5, overflowX: "scroll", bgcolor: "#131314" }}
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
                      style={{ borderRight: "1px solid #444", height: "15px" }}
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
                      style={{ borderTop: "1px solid #444", width: "10px" }}
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

                          return (
                            <Cell
                              key={subIndex}
                              day={dayIndex}
                              hour={hour}
                              minute={cellStartMinute}
                              onDropEvent={handleDropEvent}
                              onCellClick={onCellClick}
                            >
                              {cellEvents.map((event) => (
                                <Event
                                  key={event.id}
                                  event={event}
                                  onSelect={onEventClick}
                                  onDelete={() => {}}
                                  allowDrag={allowEventMove}
                                />
                              ))}
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
