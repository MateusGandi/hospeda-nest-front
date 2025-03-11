import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Box,
  Container,
  Rating,
  Avatar,
  CardHeader,
  Tooltip,
} from "@mui/material";
import Modal from "../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import VideoPlayer from "../../Componentes/Video";
import AvatarImage from "../../Assets/1.jpg";
import apiService from "../../Componentes/Api/axios";

const ModalPlanos = ({ alertCustom }) => {
  const periodicidade = {
    SEMANAL: "/ semana",
    DIARIO: "/ dia",
    QUINZENAL: "/ 15 dias",
    MENSAL: "/ mês",
    ANUAL: "/ ano",
  };
  const navigate = useNavigate();
  const [dados, setDados] = useState({
    totalUsers: 3000,
    avaliacaoGeral: 4.1,
    urlVideoPresentation: null,
  });
  const [planos, setPlanos] = useState([
    {
      nome: "Gratuito",
      vencimento: "",
      preco: "0.00",
      descricao: "Teste por 7 dias grátis",
      ativo: true,
      id: 1,
      produtos: [
        {
          nome: "Acesso ao App",
          descricao:
            "Teste a agenda automática por 7 dias sem qualquer compromisso",
          id: 6,
        },
      ],
    },
    {
      nome: "Premium",
      vencimento: "MENSAL",
      preco: "29.90",
      descricao: "Tudo em um só plano",
      ativo: true,
      id: 2,
      destaque: true,
      produtos: [
        {
          nome: "Automação de WhatsApp",
          descricao:
            "Acesso a um robo que controla seus atendimentos automaticamente",
          id: 1,
        },

        {
          nome: "Automação de Marketing ",
          descricao:
            "Geração de posts automáticos e movimentações nas redes sociais para trazer ainda mais clientes para perto de você",
          id: 2,
        },
        {
          nome: "Vendas na Plataforma",
          descricao:
            "Venda seus próprios produtos no maketplace do Tonsus e simplifique sua logística, não precisa se preocupar com entrega",
          id: 3,
        },
        {
          nome: "Programas de Incentivo",
          descricao:
            "Promova promoções para novos clientes com recorrentes descontos nos serviços sem ter que gastar um real a mais para isso",
          id: 4,
        },
        {
          nome: "Formas de Pagamento",
          descricao:
            "Tenha consigo todas as modalidades de pagamento: PIX, Boleto, Cartão com taxas acessíveis e direto no App, além de poder receber adiantado.",
          id: 5,
        },
      ],
    },
  ]);
  const [depoimentos, setDepoimentos] = useState([
    {
      nome: "Carlos Mendes",
      comentario:
        "O Tonsus revolucionou meu negócio! Agora consigo gerenciar tudo de forma simples e prática.",
      avaliacao: 5,
      foto: AvatarImage,
    },
    {
      nome: "Fernanda Oliveira",
      comentario:
        "Adorei a plataforma! Meus clientes agora conseguem agendar horários sem complicação.",
      avaliacao: 4,
      foto: AvatarImage,
    },
    {
      nome: "João Silva",
      comentario:
        "O marketing automático me ajudou a atrair mais clientes. Vale muito a pena!",
      avaliacao: 5,
      foto: AvatarImage,
    },
  ]);
  const [modal, setModal] = useState({
    video: false,
    open: true,
    onClose: () => navigate(-1),
    loading: false,
  });

  const fetchData = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const [data, page, comments] = await Promise.all[
        (apiService.query("GET", `/plans`),
        apiService.query("GET", `/plans/content`),
        apiService.query("GET", `/comments/plans/3`))
      ];
      setPlanos(data);
      const { totalUsers, avaliacaoGeral, urlVideoPresentation } = page;
      setDepoimentos(comments);
      setDados({ totalUsers, avaliacaoGeral, urlVideoPresentation });
    } catch (error) {
      alertCustom(
        "Ocorreu um imprevisto ao trazer os dados, verifique sua conexão!"
      );
    }
    setModal((prev) => ({ ...prev, loading: false }));
  };

  const handleSelectPlan = async (idPlan) => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      alertCustom("Faça login antes de prosseguir com a contratação do plano");
      if (!localStorage.establishmentId) return navigate("/login");

      const { key } = apiService.query("POST", `/plans/hire-plan`, {
        planId: idPlan,
        establishmentId: localStorage.establishmentId,
      });
      navigate(`/checkout/${key}`);
    } catch (error) {
      alertCustom("Ocorreu ao escolher plano, tente novamente mais tarde!");
    }
    setModal((prev) => ({ ...prev, loading: false }));
  };

  return (
    <>
      <VideoPlayer
        title="Bem vindo ao Tonsus"
        maxWidth="xs"
        open={modal.video}
        onClose={() => setModal((prev) => ({ ...prev, video: false }))}
      />
      <Modal
        open={modal.open}
        component="view"
        fullScreen="all"
        maxWidth="lg"
        titulo={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tonsus App
            <Typography variant="body1" sx={{ mt: "-8px", ml: "44px" }}>
              Parceiros
            </Typography>
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
          {/* Texto e botão do vídeo */}
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
                  onClick={() => setModal((prev) => ({ ...prev, video: true }))}
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
          {/* Planos */}
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

            {planos.map((plano) => (
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
                  {plano.produtos.map((produto, i) => (
                    <Tooltip title={produto.descricao}>
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
                    </Tooltip>
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
          {/* Depoimentos e avaliações */}
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
                mais de 3 mil usuários
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
                  value={dados.avaliacaoGeral.toFixed(0)}
                  readOnly
                  sx={{ color: "#ffb200" }}
                />
                <span>{dados.avaliacaoGeral}/5</span>
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
              {depoimentos.map((depoimento, index) => (
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
                        <Avatar src={depoimento.foto} aria-label="recipe">
                          {depoimento.avatar}
                        </Avatar>
                      }
                      title={depoimento.nome}
                      subheader={
                        <Rating
                          value={depoimento.avaliacao}
                          readOnly
                          sx={{ color: "#ffb200" }}
                        />
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* 🔹 flexGrow faz com que o conteúdo cresça e o Card ocupe toda a altura */}
                      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                        "{depoimento.comentario}"
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
