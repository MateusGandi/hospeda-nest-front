import React, { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";

export default function Cupom({
  form,
  handleChange,
  applyDescount,
  onRemoveDescount,
  tab,
}) {
  return (
    <>
      {tab === "metodo_pagamento" && (
        <Box sx={{ mt: 3 }}>
          <CustomInput
            fullWidth
            placeholder="Cupom de desconto"
            name="cupom"
            value={form.cupom}
            onChange={handleChange}
            endIcon={
              <Button
                disableElevation
                color="secondary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  applyDescount();
                }}
                sx={{ mr: -1, px: 2 }}
              >
                Adicionar
              </Button>
            }
          />
        </Box>
      )}
      <Typography sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {form.cupons.map((cupom) => (
          <Chip
            key={cupom.id}
            label={cupom.value}
            onDelete={() => onRemoveDescount(cupom.id)}
            color="terciary"
          />
        ))}
      </Typography>
    </>
  );
}
