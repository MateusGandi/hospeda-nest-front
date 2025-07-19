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

export default function ClienteSelecionar({ formaData, setFormData }) {
  const [option, setOption] = useState(0);

  const handleChangeOption = (value) => {
    setFormData((prev) => ({ ...prev, cliente: null }));
    setOption(value);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {[
          { id: 0, label: "Buscar Cliente", icon: <PersonSearch /> },
          { id: 1, label: "Novo Cliente", icon: <PersonAdd /> },
        ].map((item) => (
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              variant="outlined"
              sx={{
                cursor: "pointer",
                border:
                  option == item.id
                    ? "2px solid rgba(256,256,256,0.1)"
                    : "2px solid transparent",
                backgroundColor:
                  option == item.id
                    ? "rgba(256, 256, 256, 0.05)"
                    : "transparent",
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px",
              }}
              onClick={() => handleChangeOption(item.id)}
            >
              <Box>
                <Typography variant="h6">{item.label}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "transparent", color: "#fff" }}>
                {item.icon}
              </Avatar>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={5}>
        {option == 1 ? (
          <ClienteForm
            formaData={formaData?.cliente}
            setformaData={(item) =>
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
            itemSelecionado={formaData?.cliente}
          />
        )}
      </Box>
    </Box>
  );
}
