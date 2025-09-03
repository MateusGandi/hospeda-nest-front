import React from "react";
import { FormControlLabel, Grid2 as Grid, Switch } from "@mui/material";
import { CustomInput } from "../../../Componentes/Custom";
import { formatMoney } from "../../../Componentes/Funcoes";

const ProductForm = ({ form, onChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      onChange(name, checked);
    } else {
      const isNumber = ["quantidade", "valor", "quantidadeMinima"].includes(
        name
      );
      onChange(
        name,
        isNumber
          ? name == "valor"
            ? formatMoney(value)
            : value
            ? +Number(value).toFixed(0)
            : ""
          : value
      );
    }
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2, rowGap: 3 }}>
      <Grid size={{ xs: 12, md: 9 }}>
        <CustomInput
          name="nome"
          label="Nome do Produto"
          fullWidth
          value={form.nome}
          onChange={handleChange}
        />
      </Grid>{" "}
      <Grid size={{ xs: 6, md: 3 }}>
        <CustomInput
          name="valor"
          label="Preço"
          type="number"
          fullWidth
          startIcon={"R$"}
          value={formatMoney(form.valor)}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={12}>
        <CustomInput
          name="descricao"
          label="Descrição"
          minRows={4}
          multiline
          fullWidth
          value={form.descricao || ""}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <CustomInput
          name="quantidade"
          label="Quantidade"
          type="number"
          fullWidth
          value={form.quantidade}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <CustomInput
          name="quantidadeMinima"
          label="Quantidade Mínima"
          type="number"
          fullWidth
          value={form.quantidadeMinima}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <CustomInput
          name="categoria"
          label="Categoria"
          fullWidth
          value={form.categoria || ""}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <CustomInput
          name="marca"
          label="Marca"
          fullWidth
          value={form.marca || ""}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={!!form.ativo}
              onChange={handleChange}
              name="ativo"
              color="primary"
            />
          }
          label="Produto Ativo"
        />
      </Grid>
      <Grid size={{ xs: 6, md: 6 }}>
        <FormControlLabel
          control={
            <Switch
              checked={!!form.disponivel}
              onChange={handleChange}
              name="disponivel"
              color="primary"
            />
          }
          label="Disponível para Venda"
        />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 6 }}>
        <CustomInput
          name="codigoBarras"
          label="Código de Barras"
          fullWidth
          value={form.codigoBarras || ""}
          onChange={handleChange}
        />
      </Grid> */}
    </Grid>
  );
};

export default ProductForm;
