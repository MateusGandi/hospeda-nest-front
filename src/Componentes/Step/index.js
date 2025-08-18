import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const StepIndicator = ({ steps = [], currentStep = 0, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    // Mantém o layout mobile como você já fez
    const step = steps[currentStep] || {};
    return (
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Typography variant="body2">
          {currentStep + 1}/{steps.length}
        </Typography>
        <Typography variant="body1">{step.label}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
      {steps.map((step, index) => (
        < >
          <Typography
            variant="body1"
            sx={{
              cursor: index < currentStep ? "pointer" : "default",
              color:
                index < currentStep
                  ? theme.palette.primary.main // azul para anteriores
                  : index === currentStep
                  ? theme.palette.text.primary // atual preto
                  : theme.palette.text.secondary, // próximos cinza 
            }}
            onClick={() => index < currentStep && onChange && onChange(index)}
          >
            {step.label}
          </Typography>
          {index < steps.length - 1 && ( 
             <ChevronRightIcon/> 
          )}
        </ >
      ))}
    </Box>
  );
};

export default StepIndicator;
