import { useEffect, useState } from "react";
import { Rows } from "../../../Componentes/Lista/Rows";
import VideoPlayer from "../../../Componentes/Video";
import {
  Box,
  Paper,
  Typography,
  Container,
  Fade,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { primeiraMaiuscula } from "../../../Componentes/Funcoes";
import axios from "axios";
import { LoadingBox } from "../../../Componentes/Custom";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import Icon from "../../../Assets/Emojis";

const Tutorial = ({ alertCustom }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState({
    videos: [
      {
        id: "d9b8a6d5-7a73-4f64-82d1-9f3a9df6b4f3",
        src: "https://www.youtube.com/embed/mQYXEf1FJgM",
        description: "GERENCIANDO FILA (ORDEM DE CHEGADA) - TONSUS APP",
        title: "Gerenciando fila",
      },
      {
        id: "c5f9de23-83a4-4b8c-9a88-76c9a4bb21f7",
        src: "https://www.youtube.com/embed/6wIBhkCnjbg",
        description: "GERENCIANDO SERVIÇOS - TONSUS APP",
        title: "Gerenciando serviços",
      },
      {
        id: "a2e57b94-37f2-442d-bb13-83e625d68a3f",
        src: "https://www.youtube.com/embed/lSlc1qt79Uk",
        description: "CRIANDO CONTA - TONSUS APP",
        title: "Criar conta",
      },
      {
        id: "9e8ac9ad-bc7a-4b2a-86d3-7cc8ffb8b7fd",
        src: "https://www.youtube.com/embed/Z9grlnYO7nU",
        description: "CRIANDO ÍCONE DO APP - TONSUS APP",
        title: "Aplicativo",
      },
      {
        id: "b1f4f936-77f8-4dc7-b0cc-9f4e447874d5",
        src: "https://www.youtube.com/embed/E2Up7HUJtLk",
        description: "GERENCIANDO FUNCIONÁRIOS - TONSUS APP",
        title: "Gerenciando funcionários",
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  //   const handleGet = async () => {
  //     try {

  //       console.log("Tutoriais carregados:", data);
  //       if (!Array.isArray(data)) throw new Error("Dados de tutoriais inválidos");
  //       setContent({ videos: data });
  //     } catch (err) {
  //       alertCustom(err.message || "Erro ao carregar tutoriais");
  //       console.error("Erro ao carregar tutoriais:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleClose = () => {
    const loc = location.pathname.split("/");
    loc.pop();
    navigate(loc.join("/"));
    setOpen(false);
  };

  //   useEffect(() => {
  //     handleGet();
  //   }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Cabeçalho */}

      <Typography variant="h6" className="show-box" sx={{ mb: 2 }}>
        <Icon>🎓</Icon> Tutoriais
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Aprenda rapidamente a utilizar os principais recursos do app.
        </Typography>
      </Typography>

      {/* Lista de vídeos */}
      {loading ? (
        <LoadingBox message="Carregando tutoriais..." />
      ) : content.videos.length ? (
        <Fade in>
          <Box>
            <Rows
              oneTapMode
              onSelect={(i) => navigate(`/dashboard/tutorial/${i.id}`)}
              items={content.videos.map((v) => ({
                icon: (
                  <PlayCircleFilledRoundedIcon
                    fontSize="large"
                    color="primary"
                  />
                ),
                sx: { background: "none", color: "#fff" },
                id: v.id,
                titulo: primeiraMaiuscula(v.description.split(" - ")[0]),
                descricao:
                  v.description.split(" - ")[1]?.replace("TONSUS APP", "") ||
                  "",
                ...v,
              }))}
            />
          </Box>
        </Fade>
      ) : (
        <Typography className="show-box-outlined">
          Nenhum tutorial disponível no momento
        </Typography>
      )}

      {/* Player modal */}
      <VideoPlayer
        url="dashboard/tutorial"
        setOpen={setOpen}
        maxWidth="xs"
        open={open}
        videoList={content.videos}
        onClose={handleClose}
      />
    </Container>
  );
};

export default Tutorial;
