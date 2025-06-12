import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Link,
  ListItemIcon,
  Button,
} from "@mui/material";
import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import Doc from "./documento.json";
import Icon from "../../Assets/Emojis";

const FAC = ({ filtro }) => {
  const navigate = useNavigate();
  const { title } = useParams();
  const [documentos, setDocumentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abertos, setAbertos] = useState({});

  const termoBusca = (filtro || title || "").toLowerCase().trim();

  useEffect(() => {
    setCarregando(true);

    const filtrado = Doc.map((doc) => {
      const tituloMatch = doc.title.toLowerCase().includes(termoBusca);
      const sectionsFiltradas = doc.sections.filter((section) => {
        const headingMatch = section.heading.toLowerCase().includes(termoBusca);
        const textMatch = section.text.toLowerCase().includes(termoBusca);
        return headingMatch || textMatch;
      });

      if (tituloMatch || sectionsFiltradas.length > 0) {
        return {
          ...doc,
          sections: sectionsFiltradas,
        };
      }

      return null;
    }).filter(Boolean);

    const docsFinal = termoBusca === "" ? Doc : filtrado;
    setDocumentos(docsFinal);

    // Abre todos se houver título nos params
    if (title) {
      const todosAbertos = {};
      docsFinal.forEach((_, idx) => {
        todosAbertos[idx] = true;
      });
      setAbertos(todosAbertos);
    } else {
      setAbertos({});
    }

    setCarregando(false);
  }, [filtro, title]);

  const toggleAbertura = (index) => {
    setAbertos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatarTexto = (texto) => {
    if (!texto) return "";
    const negrito = texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const comQuebras = negrito.replace(/\n/g, "<br />");
    const comDestaque = termoBusca
      ? comQuebras.replace(
          new RegExp(`(${termoBusca})`, "gi"),
          `<span style="background-color:rgb(59, 59, 59);">$1</span>`
        )
      : comQuebras;
    return comDestaque;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {carregando ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : documentos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Nenhum documento encontrado para "{filtro || title}"
        </Typography>
      ) : (
        <List>
          {documentos.map((doc, index) => (
            <Box key={index}>
              <ListItemButton
                onClick={() => toggleAbertura(index)}
                sx={{ borderRadius: "10px", mb: 1 }}
              >
                <ListItemIcon>
                  {abertos[index] ? <FolderOpen /> : <Folder />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatarTexto(doc.title),
                      }}
                    />
                  }
                />
              </ListItemButton>
              <Collapse in={abertos[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {doc.sections.map((section, idx) => (
                    <Box key={idx} sx={{ mb: 3 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <InsertDriveFile fontSize="small" />
                        </ListItemIcon>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          dangerouslySetInnerHTML={{
                            __html: formatarTexto(section.heading),
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                        dangerouslySetInnerHTML={{
                          __html: formatarTexto(section.text),
                        }}
                      />
                      {section.links?.map((link, lid) => (
                        <Box key={lid}>
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="show-link"
                          >
                            {link.label}
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      )}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button onClick={() => navigate("/fac")}>Veja completo</Button>
      </Box>

      <Typography className="show-box" typography="body1" sx={{ m: "10px 0" }}>
        <Typography variant="h6">
          <Icon>💻</Icon> Atenção
        </Typography>
        Bem vindo aos termos e condições do Tonsus, aqui você tira suas dúvidas
        sobre políticas de uso, privacidade e segurança, além de compreender
        funcionalidades e promoções do sistema. Caso tenha alguma dúvida, entre
        em contato com nossa equipe de suporte.
      </Typography>
    </Container>
  );
};

export default FAC;
