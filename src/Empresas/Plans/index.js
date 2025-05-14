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
  Stack,
  Box,
} from "@mui/material";
import Modal from "../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
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
import barbeiroConfuso from "../../Assets/Landing/barbeiro-confuso.png";
import barbeiroConfusoLeft from "../../Assets/Landing/barbeiro-confuso-left.png";
import gradienteAzul from "../../Assets/Landing/gradiente-azul-bg.png";
import Icon from "../../Assets/Emojis";
import { Rows } from "../../Componentes/Lista/Rows";
import WhatsAppButton from "../../Componentes/Alert/WhatsApp";
import Image from "../../Assets/Landing/planos.png";

const ModalPlanos = ({ alertCustom }) => {
  const [mensagensChat] = useState([
    { remetente: "cliente", texto: "Olá, bom dia." },
    {
      remetente: "bot",
      texto:
        "🤝 Olá Edu, como podemos te ajudar hoje?\n\nPor hora, podemos te ajudar com:\n- Notificações\n- Cancelamentos\n- Agendamentos\n- Dúvidas sobre o app\n- Recuperar sua conta perdida",
    },
    { remetente: "cliente", texto: "Estou com algumas dúvidas..." },
    {
      remetente: "bot",
      texto:
        "Vamos lá, sobre o que quer saber mais?\n- Como funciona o app\n- Como funciona o CashBack",
    },
  ]);

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
    detalhes: [],
  });

  const fetchData = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const [planos, { depoimentos, media }] = await Promise.all([
        apiService.query("GET", "/plan"),
        apiService.query("GET", "/evaluation?page=1&pageSize=3"),
      ]);
      const [t1, t2] = planos;
      setModal((prev) => ({
        ...prev,
        planos: [t2, { ...t1, destaque: true }],
        depoimentos,
        avaliacao: media,
      }));
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
        open={modal.detalhes.length > 0}
        onClose={() => setModal((prev) => ({ ...prev, detalhes: [] }))}
        maxWidth="md"
        titulo={modal.nome}
        sx={{ background: "#181818" }}
        component="modal"
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
            <img src={Image} style={{ width: "450px" }}></img>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {" "}
            <Rows
              sx={{ background: "none" }}
              items={modal.detalhes.map((detalhe, i) => ({
                id: i,
                icon: (
                  <Avatar
                    sx={{
                      bgcolor: "secondary.light",
                      color: "#000",
                      width: 32,
                      height: 32,

                      fontSize: "1rem",
                    }}
                  >
                    {i + 1}
                  </Avatar>
                ),
                titulo: detalhe.nome,
                subtitulo: detalhe.descricao,
              }))}
              disabled={true}
            />
          </Grid>
        </Grid>
      </Modal>
      <Modal
        open={modal.open}
        component="view"
        fullScreen="all"
        maxWidth="lg"
        titulo={
          <Typography
            variant="h6"
            sx={{
              width: "calc(100vw - 100px)",
              position: "relative", // Container relativo para posicionamento absoluto do filho
              display: "inline-flex", // Mantém o comportamento inline mas permite posicionamento
            }}
          >
            <img
              onClick={() => navigate("/home")}
              src={LogoPartners}
              style={{
                cursor: "pointer",
                height: "37px",
                marginLeft: isMobile ? 0 : "8px",
              }}
            />
            {!isMobile && (
              <Button
                variant="outlined"
                disableElevation
                color="secondary"
                onClick={() => navigate("/login")}
                sx={{
                  position: "absolute",
                  right: "0", // Alinha à direita do container
                  top: "60%", // Centraliza verticalmente
                  transform: "translateY(-50%)", // Ajuste fino para centralização perfeita
                }}
              >
                Acesse sua conta
              </Button>
            )}
          </Typography>
        }
        loading={modal.loading}
        onClose={modal.onClose}
        sx={{
          backgroundColor: "#212121",
          backgroundImage: `url(${gradienteAzul})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <WhatsAppButton />
        <Grid container spacing={3} sx={{ m: 1 }}>
          <Grid
            size={{ xs: 12, md: 6 }}
            order={{ xs: 1, md: 1 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Grid
              container
              sx={{
                height: { md: "60vh", xs: "500px" },
              }}
            >
              <Grid size={12}>
                <Typography variant="h3">
                  Aumente seu <b>faturamento</b> e visibilidade por um preço
                  justo!
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">
                  Descubra na prática como revolucionar sua gestão com nossas
                  ferramentas para atrair mais clientes
                </Typography>
              </Grid>
              <Grid size={12}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  size="large"
                  onClick={() => navigate(modal.videos[0].id)}
                  sx={{
                    mt: 2,
                    width: { xs: "100%", md: "300px" },
                    fontWeight: 600,
                  }}
                  endIcon={<EastRoundedIcon />}
                >
                  Entenda como funciona
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
            order={{ xs: 1, md: 1 }}
          >
            {modal.planos.map((plano) => (
              <Card
                elevation={0}
                sx={{
                  p: "1%",
                  borderRadius: 3,
                  width: { xs: "100%", md: "47%" },
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",

                  backgroundColor: "#fff",
                  color: "#000 !important",
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {plano.nome}
                  </Typography>
                  <Typography variant="body1">{plano.descricao}</Typography>
                  <Typography
                    variant="h4"
                    color={plano.destaque ? "success" : "primary"}
                    sx={{
                      fontWeight: 600,
                      mt: 3,
                      display: "flex",
                      alignItems: "flex-end",
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
                  {plano?.produtosContratados?.map((produto, i) => (
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
                      {/* <Typography variant="body2">
                        {produto.descricao}
                      </Typography> */}
                    </>
                  ))}
                </CardContent>
                <CardActions sx={{}}>
                  <Stack sx={{ width: "100%", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="#fff"
                      fullWidth
                      onClick={() => handleSelectPlan(plano.id)}
                    >
                      Começar
                    </Button>
                    <Button
                      variant="text"
                      color="#000"
                      fullWidth
                      onClick={() =>
                        setModal((prev) => ({
                          ...prev,
                          nome: plano.nome,
                          detalhes: plano.produtosContratados,
                        }))
                      }
                    >
                      ver mais detalhes
                    </Button>
                  </Stack>
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
                <span>{modal.avaliacao.toFixed(2)}/5</span>
              </Typography>
            </Typography>
          </Grid>
          {/* Depoimentos de clientes */}
          <Grid size={12} order={{ xs: 2, md: 10 }}>
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
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.1)",
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
          </Grid>{" "}
          <Grid size={12} order={998} sx={{ textAlign: "center", mb: -7 }}>
            <Typography variant={"h4"}>
              Atendimento Automático WhatsApp
              <Typography variant={"h6"}>
                Um Atendente Virtual para atender aos seus clientes até mesmo
                fora do expediente!
              </Typography>
            </Typography>
          </Grid>
          <Grid size={12} order={999}>
            <Grid container>
              <Grid size={{ xs: 12, md: 7 }} sx={{ position: "relative" }}>
                <img
                  src={isMobile ? barbeiroConfusoLeft : barbeiroConfuso}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "76%",
                    marginBottom: "-24px",
                    zIndex: 998,
                  }}
                />

                <Card
                  disableElevation
                  variant="outlined"
                  sx={{
                    background: "transparent",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: { xs: "5px", md: "16px" },
                    position: "absolute",
                    width: { xs: "45%", md: "250px" },

                    zIndex: 997,
                    ...(isMobile
                      ? { top: 90, left: 10 }
                      : { top: 180, right: 140 }),
                  }}
                >
                  <CardHeader
                    title={
                      <Typography variant={isMobile ? "body2" : "h6"}>
                        <Icon>🔥</Icon> Chega de confusão para responder seus
                        clientes no WhatsApp!
                      </Typography>
                    }
                  />
                </Card>
              </Grid>
              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{ mt: isMobile ? -9 : 8, zIndex: 999 }}
              >
                <Stack>
                  <Card elevation={0} sx={{ background: "transparent" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          borderRadius: 2,
                          padding: 1.5,
                          fontSize: "0.9rem",
                          height: "100%",
                        }}
                      >
                        {mensagensChat.map((mensagem, index) => (
                          <Box
                            key={index}
                            sx={{
                              alignSelf:
                                mensagem.remetente === "bot"
                                  ? "flex-end"
                                  : "flex-start",
                              background:
                                mensagem.remetente === "bot"
                                  ? "#d1f7d6"
                                  : "#ffffff",
                              borderRadius:
                                mensagem.remetente === "bot"
                                  ? "10px 10px 0px 10px"
                                  : "10px 10px 10px 0px",
                              padding: "8px 12px",
                              maxWidth: "80%",
                              whiteSpace: "pre-line",
                              color: "#000",
                            }}
                          >
                            {mensagem.texto}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>{" "}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ModalPlanos;
