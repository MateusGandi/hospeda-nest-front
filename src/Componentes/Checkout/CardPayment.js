import React from "react";
import { Grid2 as Grid } from "@mui/material";
import { CustomInput } from "../Custom";
import { formatCardInfo } from "../Funcoes";

const CardPayment = ({ setForm, form }) => {
  const handleChange = (e) => {
    let valor = e.target.value;
    if (e.target.name == "numeroCartao")
      valor = formatCardInfo(valor, "numero");

    if (e.target.name == "validade") valor = formatCardInfo(valor, "data");

    if (e.target.name == "cvv") valor = valor.slice(0, 3);

    setForm((prev) => ({ ...prev, [e.target.name]: valor }));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {" "}
        <CustomInput
          fullWidth
          label="Nome do titular do cartão"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid size={12}>
        <CustomInput
          fullWidth
          label="Número do Cartão"
          placeholder="XXXX XXXX XXXX XXXX"
          name="numeroCartao"
          value={form.numeroCartao}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid size={6}>
        {" "}
        <CustomInput
          fullWidth
          label="Validade (MM/AA)"
          name="validade"
          value={form.validade}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid size={6}>
        {" "}
        <CustomInput
          fullWidth
          label="CVV"
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Grid>
    </Grid>
  );
};

export default CardPayment;
