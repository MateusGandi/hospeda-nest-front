import React from "react";
import { Box, Typography, Avatar, Chip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const StepIndicator = ({ steps = [], currentStep = 0, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getColor = (step, index) => {
    if (step.status === "done") return theme.palette.success.main; // verde
    if (step.status === "error") return theme.palette.error.main; // vermelho
    if (index === currentStep) return theme.palette.primary.main; // azul
    return "transparent"; // cinza
  };

  if (isMobile) {
    const step = steps[currentStep] || {};
    return (
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <Chip
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                {currentStep + 1}/{steps.length}
              </Typography>
            </Box>
          }
          onClick={() => onChange && onChange(currentStep)}
          sx={{
            bgcolor: getColor(step, currentStep),
            color: "#fff",
          }}
        />{" "}
        <Typography variant="body1">{step.label}</Typography>
      </Typography>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {steps.map((step, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => onChange && onChange(index)}
          sx={{ cursor: "pointer", userSelect: "none" }}
        >
          <Avatar
            sx={{
              bgcolor: getColor(step, index),
              color: "#fff",
              width: 25,
              height: 25,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </Avatar>
          <Typography variant="body1">{step.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StepIndicator;
