import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Rating,
  Avatar,
  CardHeader,
  Tooltip,
} from "@mui/material";
import Modal from "../../Componentes/Modal";
import { useNavigate, useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import VideoPlayer from "../../Componentes/Video";
import apiService from "../../Componentes/Api/axios";
import {
  formatNumberToWords,
  getLocalItem,
  isMobile,
} from "../../Componentes/Funcoes";
import LogoPartners from "../../Assets/logo_partners.png";

const ModalPlanos = ({ alertCustom }) => {
  const periodicidade = {
    SEMANAL: "/ semana",
    DIARIO: "/ dia",
    QUINZENAL: "/ 15 dias",
    MENSAL: "/ mês",
    ANUAL: "/ ano",
  };
  const to = {
    client: "/home",
    adm: "/dashboard",
    manager: "/manager",
    "": "/home",
  };
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    video: false,
    open: true,
    onClose: () => navigate(to[getLocalItem("accessType") || ""]),
    loading: false,
    depoimentos: [],
    planos: [],
    usuarios: formatNumberToWords(3000),
    avaliacao: 4.1,
    videos: [
      {
        id: "67f00094-d984-8007-b039-a6cc21a8f7e6",
        title: "Tudo sobre o Tonsus",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: "67f00094-d984-8007-b039-a6cc21a8f7ee",
        title: "Ola mundo",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
  });

  const fetchData = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const [planos, { depoimentos, media }] = await Promise.all([
        apiService.query("GET", "/plan"),
        apiService.query("GET", "/evaluation?page=1&pageSize=3"),
      ]);

      setModal((prev) => ({ ...prev, planos, depoimentos, avaliacao: media }));
    } catch (error) {
      console.log(error);
      alertCustom(
        "Ocorreu um imprevisto ao trazer os dados, verifique sua conexão!"
      );
    }
    setModal((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPlan = async (idPlan) => navigate(`/onboard/${idPlan}`);

  return (
    <>
      <VideoPlayer
        setOpen={(flag) => setModal((prev) => ({ ...prev, video: flag }))}
        title="Bem vindo ao Tonsus"
        maxWidth="xs"
        open={modal.video}
        videoList={modal.videos}
        onClose={() => setModal((prev) => ({ ...prev, video: false }))}
      />
      <Modal
        open={modal.open}
        component="view"
        fullScreen="all"
        maxWidth="lg"
        titulo={
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            <img
              src={LogoPartners}
              style={{ height: "37px", marginLeft: isMobile ? 0 : "8px" }}
            />
          </Typography>
        }
        loading={modal.loading}
        onClose={modal.onClose}
        sx={{ background: "#212121" }}
      >
        <Grid
          container
          spacing={3}
          sx={{ height: "calc(100vh - 100px)", m: 1 }}
        >
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 1 }}>
            <Grid
              container
              sx={{ height: { md: "100%", xs: "500px" }, textAlign: "center" }}
            >
              <Grid size={12}>
                <Typography variant="h5">Bem vindo Empreendedor!</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h4">
                  Aumente seu faturamento e visibilidade por um preço justo!
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">
                  Quer saber como? Veja o vídeo abaixo 👇
                </Typography>
              </Grid>
              <Grid size={12}>
                <Button
                  endIcon={<EastRoundedIcon />}
                  variant="contained"
                  color="force"
                  disableElevation
                  size="large"
                  onClick={() => navigate(modal.videos[0].id)}
                  sx={{
                    width: { xs: "100%", md: "300px" },
                    fontWeight: 600,
                  }}
                >
                  Clique para ver
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
            order={{ xs: 1, md: 1 }}
          >
            <Typography
              variant="h5"
              sx={{ width: "100%", textAlign: "center" }}
            >
              Como começar?
            </Typography>

            {modal.planos.map((plano) => (
              <Card
                disableElevation
                variant="outlined"
                sx={{
                  p: "1%",
                  borderRadius: 3,
                  boxShadow: 3,
                  width: { xs: "100%", md: "47%" },
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  backgroundColor: plano.destaque ? "#012FE5" : "transparent",
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {plano.nome}
                  </Typography>
                  <Typography variant="body1">{plano.descricao}</Typography>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      mt: 3,
                      display: "flex",
                      alignItems: "flex-end",
                      color: plano.destaque ? "#fff" : "#f0f0f0",
                    }}
                  >
                    {plano.preco == 0
                      ? "Gratuito"
                      : `R$ ${plano.preco?.toString().replace(".", ",")}`}
                    <Typography variant="body1">
                      {periodicidade[plano.vencimento]}
                    </Typography>
                  </Typography>
                  <Divider sx={{ m: "10px 0" }} />
                  {plano?.produtos?.map((produto, i) => (
                    <>
                      <Typography
                        key={i}
                        variant="body1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                          cursor: "pointer",
                        }}
                      >
                        <CheckIcon />
                        {produto.nome}
                      </Typography>
                      <Typography variant="body2">
                        {produto.descricao}
                      </Typography>
                    </>
                  ))}
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    color="#fff"
                    fullWidth
                    onClick={() => handleSelectPlan(plano.id)}
                  >
                    Começar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Grid>

          <Grid
            size={{ xs: 12, md: 12 }}
            sx={{ flex: 1, display: "flex" }}
            order={{ xs: 2, md: 10 }}
          >
            <Typography variant="h6" sx={{ width: "100%" }}>
              <Divider sx={{ m: "30px 0" }} />
              <Typography
                variant="h6"
                sx={{ width: "100%", textAlign: "center" }}
              >
                A plataforma completa para gestão do seu negócio e conta com
                mais de {modal.usuarios || "3 mil"} usuários
              </Typography>
              <Divider sx={{ m: "30px 0" }} />
              <Typography
                variant="h5"
                sx={{ width: "100%", textAlign: "center" }}
              >
                Veja a opinião de nossos parceiros
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <span>Avaliações: </span>
                <Rating
                  name="read-only"
                  value={modal.avaliacao.toFixed(0)}
                  readOnly
                  sx={{ color: "#ffb200" }}
                />
                <span>{modal.avaliacao}/5</span>
              </Typography>
            </Typography>
          </Grid>
          {/* Depoimentos de clientes */}
          <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 10 }}>
            <Grid
              container
              spacing={2}
              sx={{ m: "20px 0", alignItems: "stretch" }} // 🔹 Garante que os cards estiquem
            >
              {modal.depoimentos.map((depoimento, index) => (
                <Grid
                  size={{ xs: 12, md: 4 }}
                  key={index}
                  sx={{ display: "flex" }} // 🔹 Mantém altura total
                >
                  <Card
                    disableElevation
                    variant="outlined"
                    sx={{
                      background: "transparent",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1, // 🔹 Faz o card ocupar todo o espaço verticalmente
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          src={`https://srv744360.hstgr.cloud/tonsus/api/images/user/${depoimento.usuario.id}/${depoimento.usuario.foto}`}
                          aria-label="recipe"
                        >
                          {depoimento.avatar}
                        </Avatar>
                      }
                      title={depoimento.usuario.nome}
                      subheader={
                        <Rating
                          value={depoimento.nota}
                          readOnly
                          sx={{ color: "#ffb200" }}
                        />
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                        "{depoimento.descricao}"
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalPlanos;
