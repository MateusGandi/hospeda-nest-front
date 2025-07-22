import React, { useState } from "react";
import { Tabs, Tab, Box, Paper, Grid2, Typography } from "@mui/material";
import { isMobile, primeiraMaiuscula } from "../Funcoes";

const CustomTabs = ({ tabs, onChange, selected, views = [], sx = {} }) => {
  return (
    <Box sx={{ width: "100%", mb: 2, ...sx }}>
      <Tabs
        sx={{
          mb: "-0.6px",
          zIndex: 9999,
          px: 0.5,
        }}
        value={selected}
        onChange={(e, newValue) => onChange(newValue)}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        {tabs.map(({ label, id, icon }, index) => (
          <Tab
            key={id || index}
            label={
              <>
                <Box
                  variant="outlined"
                  component={Paper}
                  sx={{
                    borderRadius: "50%",
                    ...(selected == id || selected == index
                      ? { background: "rgba(255, 255, 255, 0.5)" }
                      : {}),
                    width: "60px",
                    height: "60px",
                  }}
                  className="justify-center"
                >
                  {icon}
                </Box>
                <Box sx={{ px: 3, pt: 1 }}>{primeiraMaiuscula(label)}</Box>
              </>
            }
            color="terciary"
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
      <Paper
        elevation={0}
        sx={{
          m: "0 4px",
          borderRadius:
            selected == 0
              ? "0 10px 10px 10px"
              : selected == tabs.length - 1
              ? { xs: "10px 0 10px 10px", md: "10px" }
              : "10px",
          background: "#2A2A2A",
        }}
      >
        <Grid2 container>
          {" "}
          <Grid2
            size={12}
            sx={{
              display: { xs: "block", lg: "none" },
              textAlign: "center",
              mt: 1,
            }}
          >
            <Typography variant="h6">{tabs[selected]?.label}</Typography>
          </Grid2>
          <Grid2 size={12} sx={{ mt: 2 }}>
            {" "}
            {views[selected] || (
              <Typography sx={{ p: 1, textAlign: "center" }}>
                Sem correspondência
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default CustomTabs;
