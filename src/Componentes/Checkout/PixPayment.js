import React from "react";
import { CustomInput } from "../Custom";
import { Grid2 as Grid } from "@mui/material";

const PixPayment = ({ form, setForm }) => {
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Grid container spacing={2} sx={{ p: "20px 0" }}>
      <Grid size={12}>
        <CustomInput
          fullWidth
          label="E-mail"
          placeholder="Seu e-mail"
          name="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Grid>
    </Grid>
  );
};

export default PixPayment;
