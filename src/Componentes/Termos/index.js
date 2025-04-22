import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Container } from "@mui/material";
import ReactMarkdown from "react-markdown";
import termosDeUso from "./termosDeUso.md"; // Certifique-se de que o Webpack está configurado para isso

const FAC = ({ filtro }) => {
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(termosDeUso)
      .then((response) => response.text())
      .then((texto) => {
        setConteudo(texto);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar o arquivo:", error);
        setErro("Erro ao carregar os termos de uso");
        setCarregando(false);
      });
  }, []);

  const filtroValido = filtro ? filtro.toLowerCase() : "";

  const markdownFiltrado = conteudo
    .split(/\n(?=#)/g) // Divide por seções que começam com "#"
    .filter((bloco) => bloco.toLowerCase().includes(filtroValido))
    .join("\n");

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {carregando ? (
        <CircularProgress />
      ) : erro ? (
        <Typography variant="body1" color="error">
          {erro}
        </Typography>
      ) : markdownFiltrado.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Nenhum resultado encontrado para "{filtro}"
        </Typography>
      ) : (
        <Box className="show-box" sx={{ padding: 2 }}>
          <ReactMarkdown>{markdownFiltrado}</ReactMarkdown>
        </Box>
      )}
    </Container>
  );
};

export default FAC;
