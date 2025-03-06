import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";

const Funcionarios = ({ setError, format, form, setForm }) => {
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    try {
      console.log(form.barbearia.funcionarios); //,format(form.barbearia.funcionarios, "barbeiros"))
      setFuncionarios(format(form.barbearia.funcionarios, "barbeiros"));
    } catch (error) {
      console.log(error);
      setError("Não há funcionários disponíveis");
    }
  }, [form.barbearia]);

  const handleSelect = (item) => {
    setForm((prev) => ({ ...prev, barbeiro: item }));
  };
  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }}>
        {funcionarios && funcionarios.length ? (
          <Rows items={funcionarios} onSelect={handleSelect} />
        ) : (
          <Typography
            variant="body1"
            sx={{ width: "100%", textAlign: "center" }}
          >
            Nenhum funcionário disponível!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Funcionarios;
