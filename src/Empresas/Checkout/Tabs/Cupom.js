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
            name="cupom_text"
            value={form.cupom_text || ""}
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
        {form.cupom && (
          <Chip
            key={form.cupom.id}
            label={form.cupom.value}
            onDelete={() => onRemoveDescount(form.cupom.id)}
            color="terciary"
          />
        )}
      </Typography>
    </>
  );
}
