import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { PersonAdd, PersonSearch } from "@mui/icons-material"; // Ícones
import ClienteForm from "./ClienteForm";
import SearchField from "../../../../Componentes/AutoComplete/searchAutocomplete";

export default function ClienteSelecionar({ formData, setFormData }) {
  const [novoCliente, setNovoCliente] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, cliente: null }));
  }, [novoCliente]);

  useEffect(() => {
    if (clienteSelecionado) setFormData(clienteSelecionado);
  }, [clienteSelecionado]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {/* Card Cliente Existente */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            variant="outlined"
            sx={{
              cursor: "pointer",
              border: !novoCliente
                ? "2px solid rgba(256,256,256,0.1)"
                : "2px solid transparent",
              backgroundColor: !novoCliente
                ? "rgba(256, 256, 256, 0.05)"
                : "transparent",
              p: 3, // Aumenta o padding do card
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2, // Borda arredondada
            }}
            onClick={() => setNovoCliente(false)}
          >
            <Box>
              <Typography variant="h6">Cliente Existente</Typography>
            </Box>
            <Avatar sx={{ bgcolor: "transparent", color: "#fff" }}>
              <PersonSearch />
            </Avatar>
          </Card>
        </Grid>

        {/* Card Novo Cliente */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            variant="outlined"
            sx={{
              cursor: "pointer",
              border: novoCliente
                ? "2px solid rgba(256,256,256,0.1)"
                : "2px solid transparent",
              backgroundColor: novoCliente
                ? "rgba(256, 256, 256, 0.05)"
                : "transparent",
              p: 3, // Aumenta o padding do card
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2, // Borda arredondada
            }}
            onClick={() => setNovoCliente(true)}
          >
            <Box>
              <Typography variant="h6">Novo Cliente</Typography>
            </Box>
            <Avatar sx={{ bgcolor: "transparent", color: "#fff" }}>
              <PersonAdd />
            </Avatar>
          </Card>
        </Grid>
      </Grid>

      <Box mt={5}>
        {novoCliente ? (
          <ClienteForm
            formData={formData.cliente}
            setFormData={(item) =>
              setFormData((prev) => ({ ...prev, cliente: item }))
            }
          />
        ) : (
          <SearchField
            fields={["telefone", "nome"]}
            url={`/user`}
            placeholder="Pesquise por nome ou telefone"
            setItemSelecionado={(item) =>
              setFormData((prev) => ({ ...prev, cliente: item }))
            }
            itemSelecionado={formData.cliente}
          />
        )}
      </Box>
    </Box>
  );
}
