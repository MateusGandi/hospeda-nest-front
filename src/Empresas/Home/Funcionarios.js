import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";

const Funcionarios = ({ setError, format, form, setForm }) => {
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    const handler = () => {
      console.log("Form barbeira:", form.barbearia);
      try {
        if (form.barbearia && !form.barbearia.funcionarios.length) {
          console.log("Nenhum funcionário encontrado");
          setFuncionarios([]);
          return;
        } else {
          console.log(
            "Formatando funcionários:",
            format(form.barbearia.funcionarios, "barbeiros")
          );
          setFuncionarios(format(form.barbearia.funcionarios, "barbeiros"));
        }
      } catch (error) {
        setError("Não há funcionários disponíveis");
      }
    };
    form.barbearia && handler();
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
