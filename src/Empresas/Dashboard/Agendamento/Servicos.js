import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";

const Servicos = ({ setError, format, form, setForm, alertCustom }) => {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    try {
      console.log(`aaaaaa`, form);
      console.log(
        `format(form.barbeiro.servicosPrestados, "servicos")`,
        format(form.barbeiro.servicosPrestados, "servicos")
      );
      setServicos(format(form.barbeiro.servicosPrestados, "servicos"));
    } catch (error) {
      console.log(error);
      setError("Não há serviços disponíveis");
    }
  }, [form.barbeiro]);

  const handleSelect = (item) => {
    setForm((prev) => ({ ...prev, servicos: item }));
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }}>
        {servicos && servicos.length ? (
          <Rows
            items={servicos}
            multipleSelect={true}
            onSelect={handleSelect}
          />
        ) : (
          <Typography variant="body1">Nenhum resultado encontrado!</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Servicos;
