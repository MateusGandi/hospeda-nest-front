import React, { useState } from "react";
import { Tabs, Tab, Box, Paper, Grid2, Typography } from "@mui/material";
import { isMobile } from "../Funcoes";

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
            key={id}
            label={
              <>
                <Box sx={{ display: { xs: "none", lg: "block" }, px: 3 }}>
                  {label}
                </Box>
                <Box sx={{ display: { xs: "block", lg: "none" }, px: 3 }}>
                  {icon}
                </Box>
              </>
            }
            color="terciary"
            sx={{
              background: selected == id ? "#2A2A2A" : "none",
              color: "#fff !important",
              border:
                selected == id ? "1px solid #444444" : "1px solid transparent",
              borderRadius: "10px 10px 0 0 !important",
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
        variant="outlined"
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
        <Grid2 container spacing={1}>
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
          <Grid2 size={12}>
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
