import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../../Componentes/Lista/Rows";
import Icon from "../../../Assets/Emojis";

const Servicos = ({ setError, format, form, setForm }) => {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    try {
      setServicos(format(form.barbeiro.servicosPrestados, "servicos"));
    } catch (error) {
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
          <Typography variant="h6" sx={{ width: "100%" }} className="show-box">
            <Icon>✂️</Icon> Nenhum serviço disponível!
            <Typography variant="body1">
              A barbearia ainda não possui serviços cadastrados.
            </Typography>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Servicos;
