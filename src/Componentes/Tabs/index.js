import React from "react";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import { primeiraMaiuscula } from "../Funcoes";

const CustomTabs = ({ tabs, onChange, selected, views = [], sx = {} }) => {
  return (
    <Box sx={{ width: "100%", mb: 2, ...sx }}>
      <Box sx={{ overflowX: "auto", px: 0.5 }}>
        <Tabs
          centered
          value={selected}
          onChange={(e, newValue) => onChange(newValue)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {tabs.map(({ label, id, icon, disabled }, index) => (
            <Tab
              disabled={disabled}
              key={id || index}
              label={
                <Box
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    variant="outlined"
                    component={Paper}
                    sx={{
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                      mb: 1,
                      ...(selected === id || selected === index
                        ? { background: "rgba(255, 255, 255, 0.5)" }
                        : disabled
                        ? { background: "#212121" }
                        : {}),
                    }}
                    className="justify-center"
                  >
                    {icon}
                  </Box>
                  <Box
                    sx={{ display: { xs: "none", lg: "block" }, width: "100%" }}
                  >
                    {primeiraMaiuscula(label)}
                  </Box>
                </Box>
              }
              sx={{
                color: "#fff !important",
                borderRadius: "10px !important",
                px: 0,
                minWidth: "fit-content",
                borderBottom: "none !important",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Conteúdo da aba */}
      <Paper
        elevation={0}
        sx={{
          m: "0 4px",
          borderRadius: "10px",
          background: "#2A2A2A",
        }}
      >
        <Grid container>
          <Grid
            size={12}
            sx={{
              display: { xs: "block", lg: "none" },
              textAlign: "center",
              mt: 1,
            }}
          >
            <Typography variant="h6">{tabs[selected]?.label}</Typography>
          </Grid>
          <Grid size={12} sx={{ mt: 2 }}>
            {views[selected] || (
              <Typography sx={{ p: 1, textAlign: "center" }}>
                Sem correspondência
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CustomTabs;
