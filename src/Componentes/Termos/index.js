import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material";

import SearchUndrawImage from "../../Assets/search_undraw.svg";
import termosDeUso from "./termosDeUso.txt";
import { isMobile } from "../Funcoes";

const FAC = ({ filtro }) => {
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Função para processar o arquivo txt e estruturar os artigos
    const processarArquivo = (arquivo) => {
      const linhas = arquivo.split("\n"); // Dividindo o arquivo por linhas
      let artigosArray = [];
      let artigoAtual = { titulo: "", corpo: "" };

      linhas.forEach((linha) => {
        if (linha.match(/^\d+\./)) {
          // Se a linha começa com número (indicando um título de artigo)
          if (artigoAtual.titulo) {
            artigosArray.push(artigoAtual); // Adiciona o artigo anterior
          }
          artigoAtual = { titulo: linha.trim(), corpo: "" }; // Cria um novo artigo
        } else {
          artigoAtual.corpo += linha.trim() + " "; // Adiciona o conteúdo ao corpo
        }
      });

      // Adiciona o último artigo
      if (artigoAtual.titulo) {
        artigosArray.push(artigoAtual);
      }

      setArtigos(artigosArray);
      setCarregando(false); // Finaliza o carregamento
    };

    // Carregar e processar o arquivo txt
    fetch(termosDeUso)
      .then((response) => response.text())
      .then((texto) => processarArquivo(texto))
      .catch((error) => {
        console.error("Erro ao carregar o arquivo:", error);
        setErro("Erro ao carregar os termos de uso");
        setCarregando(false);
      });
  }, []);

  // Verificar se o filtro é válido
  const filtroValido = filtro ? filtro.toLowerCase() : "";

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {/* Exibindo carregando ou erro se necessário */}
      {carregando ? (
        <CircularProgress />
      ) : erro ? (
        <Typography variant="body1" color="error">
          {erro}
        </Typography>
      ) : (
        <>
          <Box className="show-box">
            {artigos
              .filter((artigo) =>
                artigo.titulo.toLowerCase().includes(filtroValido)
              ) // Filtra os artigos com base no filtro
              .map((artigo, index) => (
                <div style={{ padding: 2, marginBottom: 2, boxShadow: 3 }}>
                  <Typography variant="h6">{artigo.titulo}</Typography>
                  <Divider sx={{ marginY: 1 }} />
                  <Typography variant="body1">{artigo.corpo}</Typography>
                </div>
              ))}
          </Box>{" "}
        </>
      )}
    </Container>
  );
};

export default FAC;
