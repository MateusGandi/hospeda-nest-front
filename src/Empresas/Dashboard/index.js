import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  IconButton,
  Typography,
  Grid2 as Grid,
  CardContent,
  Box,
  Card,
  Container,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { v4 as uuidv4 } from "uuid";
import Modal from "../../Componentes/Modal";
import CustomCard from "../../Componentes/Card";
import {
  formatPhone,
  gerarGradient,
  getDominantColorFromURL,
  getLocalItem,
  isMobile,
  primeiraMaiuscula,
} from "../../Componentes/Funcoes";
import Api from "../../Componentes/Api/axios";

import StyleIcon from "@mui/icons-material/Style";
import PersonIcon from "@mui/icons-material/Person";

import Onboarding from "./Onboarding";

import GetUserLocation from "../../Componentes/Location/Modal";
import LogoIcon from "../../Assets/Login/tonsus_logo_white.png";
import {
  Store,
  Settings,
  People,
  Build,
  CalendarMonth,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoadingImagePulse from "../../Componentes/Effects/loading";
import EditData from "./Edit";

const BarberShopMenu = ({ alertCustom, barbearia, reload, onSave }) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    complete: false,
    location: false,
  });
  const [etapa, setEtapa] = useState({
    progresso: "empresa",
    progressoAnterior: null,
    actionText: "Adicionar",
  });
  const [color, setColor] = useState("#363636");
  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [permitions, setPermissions] = useState({
    banner: getLocalItem("accessType") === "adm",
    perfil: getLocalItem("accessType") === "adm",
  });

  const cards = (user) => {
    if (!user) return [];
    if (user === "adm")
      user += getLocalItem("funcionario") ? "funcionario" : "";

    const perm = {
      employee: [
        {
          to: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          to: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
        {
          to: "profile",
          icon: <Settings sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Escala",
        },
        {
          to: "/me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],

      manager: [
        {
          to: "editar",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          to: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          to: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          to: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          to: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
      ],
      adm: [
        {
          to: "editar",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          to: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          to: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          to: "/me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],
      admfuncionario: [
        {
          to: "editar",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          to: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          to: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          to: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          to: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
        {
          to: "profile",
          icon: <Settings sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Escala",
        },
        {
          to: "/me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],
    };
    return perm[user];
  };

  const renderOption = ({ icon, title, to }) => {
    return (
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", width: "25%" }}
        onClick={() => navigate(to)}
      >
        <IconButton>{icon}</IconButton>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          {primeiraMaiuscula(title)}
        </Typography>
      </Stack>
    );
  };

  const renderCards = () => {
    const opcoes = cards(getLocalItem("accessType"));
    const barraCenter = isMobile
      ? opcoes.slice(isMobile ? 4 : 0, opcoes.length)
      : opcoes;
    const barraBottom = opcoes.slice(0, 4).map((item) => renderOption(item));

    return { barraBottom, barraCenter };
  };

  useEffect(() => {
    if (barbearia)
      getDominantColorFromURL(
        `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
      )
        .then((color) => setColor(color))
        .catch((error) => {});
  }, [barbearia, profileImage]);

  const handleClose = () => {
    setModal((prev) => {
      return Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      );
    });
  };

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("Nenhum arquivo selecionado!");
      return;
    }

    try {
      const fileExtension = file.name.split(".").pop();
      const uniqueName = `${uuidv4()}.${fileExtension}`;
      const renamedFile = new File([file], uniqueName, { type: file.type });

      const formData = new FormData();
      formData.append("fotos", renamedFile);

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const endpoint = `/images/establishment/${barbearia.id}/${
            type === "banner" ? "banner" : "profile"
          }`;

          await Api.query("POST", endpoint, formData);

          if (type === "banner") {
            setBannerImage(reader.result);
          } else if (type === "profile") {
            setProfileImage(reader.result);
          }

          const { profile } = await Api.query(
            "GET",
            `/establishment?establishmentId=${getLocalItem("establishmentId")}`
          );

          if (type === "profile") {
            setTimeout(() => {
              getDominantColorFromURL(
                `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${
                  barbearia.id
                }/profile/${profile}?t=${Date.now()}`
              ).then(setColor);
            }, 1000);
          }
          await reload();
          alertCustom("Imagem adicionada com sucesso!");
        } catch (uploadError) {
          alertCustom("Erro ao adicionar imagem!");
          console.error("Erro ao fazer upload da imagem:", uploadError);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };

  useEffect(() => {
    const loc = barbearia?.location || {};
    if (
      getLocalItem("accessType") == "adm" &&
      Object.values(loc).some((item) => !item)
    ) {
      setModal((prev) => ({ ...prev, location: true }));
    }
  }, [barbearia]);

  return (
    <Container maxWidth="lg" sx={{ p: "10px" }}>
      {!barbearia ? (
        <Grid
          container
          sx={{ minHeight: "80vh", display: "flex", flexDirection: "cloumn" }}
        >
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingImagePulse src={LogoIcon} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1.5} sx={{ m: "0 2px" }}>
          <Grid item size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: "10px",
                background: "#363636",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  backgroundImage: `url(${
                    bannerImage ||
                    `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/banner/${barbearia.banner}`
                  })`,
                  height: 160,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="banner-upload"
                type="file"
                onChange={(e) => handlePhotoUpload(e, "banner")}
              />
              {permitions.banner && (
                <label htmlFor="banner-upload">
                  <IconButton
                    color="primary"
                    sx={{
                      position: "absolute",
                      right: 1,
                      top: 1,
                      background: "rgba(0,0,0,0.1)",
                    }}
                    component="span"
                  >
                    <AddPhotoAlternateIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </label>
              )}

              <label htmlFor={permitions.perfil ? "profile-upload" : "none"}>
                <Avatar
                  src={
                    profileImage ||
                    `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
                  }
                  sx={{
                    position: "absolute",
                    top: { xs: "140px", md: "160px" },
                    left: { xs: "50%", md: "10%" },
                    transform: "translate(-50%, -50%)",
                    ...(permitions.perfil ? { cursor: "pointer" } : {}),
                    width: {
                      xs: 160,
                      md: 160,
                    },
                    height: {
                      xs: 160,
                      md: 160,
                    },
                  }}
                />
              </label>

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-upload"
                type="file"
                onChange={(e) => handlePhotoUpload(e, "profile")}
              />

              <CardContent
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  background: gerarGradient(color),
                }}
              >
                <Grid container justifyContent={"space-between"} spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 6, md: 11 } }}>
                    <Typography variant="h6">{barbearia.nome}</Typography>
                    <Typography variant="body1">
                      {barbearia.endereco}
                    </Typography>
                    <Typography variant="body1">
                      Telefone: {formatPhone(barbearia.telefone)}
                    </Typography>
                    {["adm", "manager"].includes(
                      getLocalItem("accessType")
                    ) && (
                      <Box
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          width: "100%",
                          justifyContent: { xs: "center", md: "left" },
                        }}
                      >
                        <EditData
                          open={false}
                          onClose={() => navigate(-1)}
                          barbearia={barbearia}
                          alertCustom={alertCustom}
                          onSave={onSave}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }} sx={{ textAlign: "right" }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "end",
                      }}
                    >
                      <Grid size={{ xs: 12, md: 4 }}>A</Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="large"
                          startIcon={<StyleIcon />}
                          onClick={() => navigate("/plans")}
                          sx={{
                            border: "1.5px solid rgba(256, 256, 256, 0.2)",
                          }}
                          fullWidth
                        >
                          Planos
                        </Button>
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>B</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <AppBar
            position="fixed"
            sx={{
              bottom: 0,
              top: "auto",
              borderRadius: "10px 10px 0 0",
              background: "rgba(0, 0, 0, 0.7)",
              display: { xs: "block", md: "none" },
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                m: "5px 0",
              }}
            >
              {renderCards().barraBottom}
            </Toolbar>
          </AppBar>
          {renderCards().barraCenter.map(({ icon, title, to }, i) => (
            <Grid item key={i} size={{ xs: 12, md: 3 }}>
              <CustomCard onClick={() => navigate(to)}>
                {icon}
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {title}
                </Typography>
              </CustomCard>
            </Grid>
          ))}
          <Box sx={{ marginTop: { xs: 10, md: 0 }, width: "100%" }}></Box>

          {modal.location && (
            <GetUserLocation
              alertCustom={alertCustom}
              address={barbearia.endereco}
              onLocationSelected={({ coordinates }) =>
                onSave({ longitudeAndLatitude: Object.values(coordinates) })
              }
            />
          )}

          {etapa && (
            <Modal
              open={modal.complete}
              onClose={() => setEtapa({ ...etapa, progresso: 0 })}
              titulo={"Completar dados"}
              onAction={etapa.next}
              actionText={etapa.actionText}
              onSubmit={etapa.onSubmit}
              submitText={etapa.submitText}
              backAction={{
                action: etapa.back,
                titulo: "Voltar",
              }}
              fullScreen="all"
              component="view"
            >
              <Onboarding
                dados={barbearia}
                etapa={etapa}
                setEtapa={setEtapa}
                alertCustom={alertCustom}
              />
            </Modal>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default BarberShopMenu;
