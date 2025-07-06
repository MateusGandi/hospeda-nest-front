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
import CustomCard from "../../Componentes/Card/";
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
import EditData from "./Edit";
import GerenciarFuncionarios from "./Funcionarios";
import GerenciarServicos from "./Servicos";
import Agendamentos from "./Agendamentos";
import Financeiro from "./Financeiro";
import WhatsApp from "./WhatsApp";
import AgendamentoManual from "./Agendamento";
import WorkSchedule from "./Escala";
import GetUserLocation from "../../Componentes/Location/Modal";

import {
  Store,
  Settings,
  People,
  Build,
  CalendarMonth,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "date-fns";

const BarberShopMenu = ({ alertCustom }) => {
  const navigate = useNavigate();
  const { path } = useParams();

  const [modal, setModal] = useState({
    funcionarios: false,
    servicos: false,
    agendamento: false,
    edicao: false,
    agendamentos: false,
    plans: false,
    complete: false,
    profile: false,
    location: false,
  });
  const [modalData, setModalData] = useState({});
  const [color, setColor] = useState("#363636");
  const [etapa, setEtapa] = useState({
    progresso: "empresa",
    progressoAnterior: null,
    actionText: "Adicionar",
  });
  const [barbearia, setBarbearia] = useState(null);
  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [permitions, setPermissions] = useState({
    banner: getLocalItem("accessType") === "adm",
    perfil: getLocalItem("accessType") === "adm",
  });

  const cards = (user) => {
    if (!user) return [];
    if (user === "adm")
      user += +getLocalItem("funcionario") ? "funcionario" : "";

    const perm = {
      employee: [
        {
          action: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          action: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
        {
          action: "profile",
          icon: <Settings sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Escala",
        },
        {
          to: "/me",
          action: "me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],

      manager: [
        {
          action: "edicao",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          action: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          action: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          action: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          action: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
      ],
      adm: [
        {
          action: "edicao",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          action: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          action: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          to: "/me",
          action: "me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],
      admfuncionario: [
        {
          action: "edicao",
          icon: <Store sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Editar barbearia",
        },
        {
          action: "funcionarios",
          icon: <People sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Funcionários",
        },
        {
          action: "servicos",
          icon: <Build sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Serviços",
        },
        {
          action: "agendamento/cliente",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Agendar Cliente",
        },
        {
          action: "agendamentos",
          icon: <CalendarMonth sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Agenda",
        },
        {
          action: "profile",
          icon: <Settings sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Minha Escala",
        },
        {
          to: "/me",
          action: "me",
          icon: <PersonIcon sx={{ mr: { md: 1, xs: 0 } }} />,
          title: "Meu perfil",
        },
      ],
    };
    return perm[user];
  };
  const renderOption = ({ action, icon, title, to }) => {
    return (
      <Stack
        sx={{ justifyContent: "center", alignItems: "center", width: "25%" }}
        onClick={() => (to ? navigate(to) : handleOpen(action))}
      >
        <IconButton>{icon}</IconButton>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          {primeiraMaiuscula(
            title.split(" ")[title.split(" ").length - 1].trim()
          )}
        </Typography>
      </Stack>
    );
  };

  const renderCards = () => {
    const opcoes = cards(getLocalItem("accessType"));

    //se for celular, pega as 4 primeiras opções para a barra de baixo
    //se não for celular, deixa vazio
    const barraCenter = isMobile
      ? opcoes.slice(isMobile ? 4 : 0, opcoes.length)
      : opcoes;

    //se for celular, pega as opções restantes para o centro
    //se não for celular, pega todas as opções
    const barraBottom = opcoes.slice(0, 4).map((item) => renderOption(item));

    return { barraBottom, barraCenter };
  };

  const handleOpen = (to) => {
    if (!to) return;

    navigate(`/dashboard/${to}`);
    setModal((prev) => ({ ...prev, [to.split("/")[0]]: true }));
  };

  useEffect(() => {
    if (!path) handleClose();
  }, [path]);

  useEffect(() => {
    const get = async () => {
      if (!barbearia) return;
      try {
        const cor = await getDominantColorFromURL(
          `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
        );
        setColor(cor);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, [barbearia, profileImage]);

  const handleClose = () => {
    setModalData({});
    setModal((prev) => {
      return Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      );
    });
  };

  useEffect(() => {
    if (Object.values(modal).every((item) => !item)) navigate(`/dashboard`);
  }, [modal]);

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("Nenhum arquivo selecionado.");
      return;
    }

    try {
      const fileExtension = file.name.split(".").pop(); // extensão segura
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

          // Atualiza imagem localmente
          if (type === "banner") {
            setBannerImage(reader.result);
          } else if (type === "profile") {
            setProfileImage(reader.result);
          }

          // Atualiza dados
          const dataAtualizada = await Api.query(
            "GET",
            `/establishment?establishmentId=${getLocalItem("establishmentId")}`
          );
          const [latitude, longitude] = dataAtualizada.longitudeAndLatitude
            ? dataAtualizada.longitudeAndLatitude
            : [];

          setBarbearia({
            ...dataAtualizada,
            location: { latitude, longitude },
          });

          if (type === "profile") {
            setTimeout(() => {
              const imageUrl = `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${
                barbearia.id
              }/profile/${dataAtualizada.profile}?t=${Date.now()}`;
              getDominantColorFromURL(imageUrl).then(setColor);
            }, 1000);
          }

          alertCustom("Foto adicionada com sucesso!");
        } catch (uploadError) {
          alertCustom("Erro ao adicionar foto!");
          console.error("Erro ao fazer upload da imagem:", uploadError);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await Api.query(
          "GET",
          `/establishment?establishmentId=${getLocalItem("establishmentId")}`
        );
        // const teste = await Api.query(
        //   "GET",
        //   `/plan/hire-plan/${getLocalItem("establishmentId")}`
        // );
        // console.log("teste", teste);
        //setModal() se o cadastro não estiver completo, so abrir

        const [latitude, longitude] = data.longitudeAndLatitude
          ? data.longitudeAndLatitude
          : [];
        const { horarioFechamento, horarioAbertura } = data;

        setBarbearia({
          ...data,

          horarioFechamento: horarioFechamento.slice(0, 5),
          horarioAbertura: horarioAbertura.slice(0, 5),
          location: { latitude, longitude },
        });
      } catch (error) {
        alertCustom("Erro ao buscar informações do estabelecimento!");
      }
    };
    fetch();
  }, []);

  const handleSave = async (info) => {
    try {
      const data = await Api.query(
        "PATCH",
        `/establishment/${barbearia.id}`,
        info
      );
      const [latitude, longitude] = data.longitudeAndLatitude
        ? data.longitudeAndLatitude
        : [];
      setBarbearia({
        ...data,
        location: { latitude, longitude },
      });

      handleClose();
      alertCustom("Dados do estabelecimento atualizados com sucesso!");
    } catch (error) {
      console.log(error);
      alertCustom("Erro ao atualizar dados do estabelecimento");
    }
  };

  useEffect(() => {
    Object.values(barbearia?.location ?? {}).some((item) => !item) &&
      setModal((prev) => ({ ...prev, location: true }));
  }, [barbearia]);

  return (
    <Container maxWidth="lg" sx={{ p: "10px" }}>
      {!barbearia ? (
        <Grid
          container
          sx={{ minHeight: "80vh", display: "flex", flexDirection: "cloumn" }}
        >
          <Grid
            item
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1.5} sx={{ m: "0 2px" }}>
          {/* Banner com ícone de adicionar foto */}
          <Grid item size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: "10px",
                background: "#363636",
              }}
            >
              {/* Imagem de fundo estilo banner */}
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
              {/* Input de upload oculto para o banner */}
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

              {/* Avatar com a logo da barbearia */}
              <label htmlFor={permitions.perfil ? "profile-upload" : "none"}>
                <Avatar
                  src={
                    profileImage ||
                    `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
                  } // Renderiza a imagem de perfil
                  sx={{
                    position: "absolute",
                    top: { xs: "140px", md: "160px" },
                    left: { xs: "50%", md: "10%" },
                    transform: "translate(-50%, -50%)",
                    ...(permitions.perfil ? { cursor: "pointer" } : {}),
                    width: {
                      xs: 160, // Para telas pequenas
                      md: 160, // Para telas médias e maiores
                    },
                    height: {
                      xs: 160,
                      md: 160,
                    },
                  }}
                />
              </label>

              {/* Input de upload oculto para o avatar */}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-upload"
                type="file"
                onChange={(e) => handlePhotoUpload(e, "profile")}
              />

              {/* Nome da barbearia e localização */}
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
                    </Typography>{" "}
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
                        {" "}
                        <EditData
                          open={modal.edicao}
                          handleClose={handleClose}
                          initialData={barbearia}
                          onSave={handleSave}
                          alertCustom={alertCustom}
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
                      <Grid size={{ xs: 12, md: 4 }}>
                        {" "}
                        <Financeiro
                          alertCustom={alertCustom}
                          barbearia={barbearia}
                        />
                      </Grid>
                      {["adm", "manager"].includes(
                        getLocalItem("accessType")
                      ) && (
                        <>
                          <Grid size={{ xs: 12, md: 4 }}>
                            {" "}
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

                          <Grid size={{ xs: 12, md: 4 }}>
                            <WhatsApp
                              barbearia={barbearia}
                              alertCustom={alertCustom}
                            />
                          </Grid>
                        </>
                      )}
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
          {renderCards().barraCenter.map(({ action, icon, title, to }, i) => (
            <Grid item key={i} size={{ xs: 12, md: 3 }}>
              <CustomCard
                onClick={() => (to ? navigate(to) : handleOpen(action))}
              >
                {icon}
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {title}
                </Typography>
              </CustomCard>
            </Grid>
          ))}
          <Box sx={{ marginTop: { xs: 10, md: 0 }, width: "100%" }}></Box>

          {barbearia && modal.agendamentos && (
            <Agendamentos
              barbearia={barbearia}
              open={modal.agendamentos}
              handleClose={handleClose}
              alertCustom={alertCustom}
            />
          )}

          <GerenciarFuncionarios
            barbearia={barbearia}
            open={modal.funcionarios}
            handleClose={handleClose}
            alertCustom={alertCustom}
            onSelect={(funcionario) => setModalData({ funcionario })}
          />
          <GerenciarServicos
            barbearia={barbearia}
            open={modal.servicos}
            handleClose={handleClose}
            alertCustom={alertCustom}
            //onSelect={(servico) => setModalData({ servico })}
          />
          <WorkSchedule
            dados={modalData.funcionario}
            type="modal"
            openModal={modal.profile}
            alertCustom={alertCustom}
            handleCloseModal={handleClose}
          />
          {modal.location && (
            <GetUserLocation
              alertCustom={alertCustom}
              address={barbearia.endereco}
              onLocationSelected={({ coordinates }) =>
                handleSave({ longitudeAndLatitude: Object.values(coordinates) })
              }
            />
          )}
          {barbearia && barbearia.funcionarios && (
            <AgendamentoManual
              onClose={handleClose}
              open={modal.agendamento}
              barbearia={barbearia}
              barbeiro={barbearia.funcionarios[0]}
              alertCustom={alertCustom}
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
