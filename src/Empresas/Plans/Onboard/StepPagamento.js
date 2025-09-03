// StepPagamento.jsx
import React from "react";
import {
  Grid2 as Grid,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";

export default function StepPagamento({
  formData = {},
  handleChange,
  setFieldValue,
}) {
  const cc = formData.creditCard || {};
  const holder = formData.creditCardHolderInfo || {};

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Forma de Cobrança
        </Typography>
        <RadioGroup
          row
          name="formaPagamento"
          value={formData.formaPagamento || ""}
          onChange={(e) => setFieldValue("formaPagamento", e.target.value)}
        >
          <FormControlLabel value="PIX" control={<Radio />} label="PIX" />
          <FormControlLabel
            value="CREDIT_CARD"
            control={<Radio />}
            label="Cartão"
          />
          <FormControlLabel value="BOLETO" control={<Radio />} label="Boleto" />
        </RadioGroup>
      </Grid>

      {formData.formaPagamento === "CREDIT_CARD" && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              fullWidth
              label="Número do Cartão"
              name="creditCard.number"
              value={cc.number || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              fullWidth
              label="Nome Impresso"
              name="creditCard.holderName"
              value={cc.holderName || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <CustomInput
              fullWidth
              label="Mês"
              name="creditCard.expiryMonth"
              value={cc.expiryMonth || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <CustomInput
              fullWidth
              label="Ano"
              name="creditCard.expiryYear"
              value={cc.expiryYear || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <CustomInput
              fullWidth
              label="CVV"
              name="creditCard.ccv"
              value={cc.ccv || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Dados do titular
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              fullWidth
              label="Nome do titular"
              name="creditCardHolderInfo.name"
              value={holder.name || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              fullWidth
              label="Email"
              name="creditCardHolderInfo.email"
              value={holder.email || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="CPF / CNPJ"
              name="creditCardHolderInfo.cpfCnpj"
              value={holder.cpfCnpj || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="CEP"
              name="creditCardHolderInfo.postalCode"
              value={holder.postalCode || ""}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInput
              fullWidth
              label="Telefone"
              name="creditCardHolderInfo.phone"
              value={holder.phone || ""}
              onChange={handleChange}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
