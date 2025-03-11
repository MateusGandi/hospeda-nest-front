import React from "react";
import { Grid2 as Grid, Container } from "@mui/material";
import axios from "axios";
import { CustomInput } from "../Custom";

const BoletoPayment = ({ setForm, form }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {" "}
        <CustomInput
          fullWidth
          label="CPF"
          value={form.cpf}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, cpf: e.target.value }))
          }
          sx={{ mb: 2 }}
        />
      </Grid>{" "}
    </Grid>
  );
};

export default BoletoPayment;
