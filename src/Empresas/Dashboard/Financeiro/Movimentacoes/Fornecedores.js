import React from "react";
import { Typography, Box, Paper, Grid2 as Grid, Divider } from "@mui/material";
import Banner from "../../../../Assets/search_undraw.svg";

const FornecedoresInfo = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        {" "}
        <Grid size={12}>
          {" "}
          <Typography variant="h6" sx={{ m: "10px 0", color: "#fff" }}>
            Aguarde, estamos preparando uma nova ferramenta!
          </Typography>
        </Grid>
        {/* Imagem à esquerda */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={Banner}
            alt="Fornecedor de Produtos"
            sx={{
              width: "80%",
              height: "80%",
              objectFit: "cover",
              maxHeight: 250,
            }}
          />
        </Grid>
        {/* Texto à direita */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body1" gutterBottom>
            O Tonsus está desenvolvendo uma nova ferramenta que facilitará a
            busca por fornecedores confiáveis de produtos para barbearias.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Em breve, você poderá encontrar fornecedores de lâminas, toalhas,
            cremes, máquinas e muito mais diretamente na plataforma.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Além disso, se você já possui fornecedores, poderá informar os
            contatos deles. O Tonsus enviará notificações para esses
            fornecedores com pedidos ou lembretes, facilitando o reabastecimento
            do seu estoque.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FornecedoresInfo;
