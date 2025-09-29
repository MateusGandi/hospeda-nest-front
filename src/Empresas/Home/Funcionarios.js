import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import Icon from "../../Assets/Emojis";
import Confirm from "../../Componentes/Alert/Confirm";

const Funcionarios = ({ setError, format, form, setForm }) => {
  const [content, setContent] = useState({
    fila: [],
    agendamento: [],
    selected: [],
    total: 0,
    alert: false,
  });

  const handleInfo = (open) => setContent((prev) => ({ ...prev, alert: open }));

  const formatItems = () => {
    const rows = [];
    if (content.fila.length) {
      rows.push({
        titulo: "Trabalham com fila",
        disabled: true,
      });
      rows.push(...content.fila);
    }

    if (content.agendamento.length) {
      rows.push({
        titulo: "Trabalham com agendamento",
        disabled: true,
      });
      rows.push(...content.agendamento);
    }
    return rows;
  };

  useEffect(() => {
    const handler = () => {
      try {
        if (form.barbearia && !form.barbearia.funcionarios.length) {
          setContent({
            fila: [],
            agendamento: [],
            selected: [],
            total: 0,
          });
          return;
        } else {
          const temp = format(form.barbearia.funcionarios, "barbeiros");

          setContent({
            fila: temp.filter((f) => f.filaDinamicaClientes),
            agendamento: temp.filter((f) => !f.filaDinamicaClientes),
            selected: [],
            total: temp.length,
          });
        }
      } catch (error) {
        setError("Não há funcionários disponíveis");
      }
    };
    form.barbearia && handler();
  }, [form.barbearia]);

  const handleSelect = (item) => {
    if (!item.clientesPodemEntrarNaFila && item.filaDinamicaClientes) {
      handleInfo(true);

      throw new Error("Funcionário não pode ser selecionado");
    }
    setForm((prev) => ({ ...prev, barbeiro: item, selected: [item] }));
    setContent((prev) => ({ ...prev, selected: [item] }));
  };

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12, md: 12 }}>
          {content.total > 0 ? (
            <Rows
              selectedItems={content.selected}
              items={formatItems()}
              onSelect={handleSelect}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{ width: "100%" }}
              className="show-box"
            >
              <Icon>✂️</Icon> Nenhum funcionário disponível!
              <Typography variant="body1">
                A barbearia ainda não possui funcionários cadastrados.
              </Typography>
            </Typography>
          )}
        </Grid>
      </Grid>

      <Confirm
        open={content.alert}
        onClose={() => handleInfo(false)}
        onConfirm={() => handleInfo(false)}
        confirmText="Entendi"
        cancelText="Voltar"
        title={"Este funcionário não está disponível no momento"}
        message="Este funcionário trabalha com filas e não permite que você participe dela em casa. Desloque-se à barbearia para que o barbeiro te coloque na fila de espera!"
      />
    </>
  );
};

export default Funcionarios;
