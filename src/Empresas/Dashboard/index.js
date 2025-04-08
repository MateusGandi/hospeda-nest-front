import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Modal from "../../Componentes/Modal";
import Onboarding from "./Onboarding";
import StyleIcon from "@mui/icons-material/Style";

import EditData from "./Edit";
import EditFuncionarios from "./Funcionarios";
import EditServicos from "./Servicos";
import Agendamentos from "./Agendamentos";
import Financeiro from "./Financeiro";
import WhatsApp from "./WhatsApp";

import CustomCard from "../../Componentes/Card/";
import AgendamentoManual from "./Agendamento";
import { getLocalItem, isMobile } from "../../Componentes/Funcoes";
import Api from "../../Componentes/Api/axios";

import { Edit, People, Build, CalendarMonth } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

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
  });
  const [etapa, setEtapa] = useState({
    progresso: "empresa",
    progressoAnterior: null,
    actionText: "Adicionar",
  });
  const [barbearia, setBarbearia] = useState(null);
  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const cards = {
    employee: [
      {
        action: "agendamento/cliente",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Agendar Cliente",
      },
      {
        action: "agendamentos",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Minha Agenda",
      },
    ],
    manager: [
      {
        action: "edicao",
        icon: <Edit sx={{ mr: 1 }} />,
        title: "Editar dados da barbearia",
      },
      {
        action: "funcionarios",
        icon: <People sx={{ mr: 1 }} />,
        title: "Funcionários",
      },
      {
        action: "servicos",
        icon: <Build sx={{ mr: 1 }} />,
        title: "Serviços",
      },
      {
        action: "agendamento/cliente",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Agendar Cliente",
      },
      {
        action: "agendamentos",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Minha Agenda",
      },
    ],
    adm: [
      {
        action: "edicao",
        icon: <Edit sx={{ mr: 1 }} />,
        title: "Editar dados da barbearia",
      },
      {
        action: "funcionarios",
        icon: <People sx={{ mr: 1 }} />,
        title: "Funcionários",
      },
      {
        action: "servicos",
        icon: <Build sx={{ mr: 1 }} />,
        title: "Serviços",
      },
      {
        action: "agendamento/cliente",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Agendar Cliente",
      },
      {
        action: "agendamentos",
        icon: <CalendarMonth sx={{ mr: 1 }} />,
        title: "Minha Agenda",
      },
    ],
  };

  const handleOpen = (to) => {
    if (!to) return;

    navigate(`/dashboard/${to}`);
    setModal((prev) => ({ ...prev, [to.split("/")[0]]: true }));
  };

  useEffect(() => {
    if (!path) handleClose();
  }, [path]);

  const handleClose = () => {
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
      // Ajustar o nome do arquivo
      const fileExtension = file.type.split("/")[1];
      const newName = `${file.name.split(".")[0]}.${fileExtension}`;
      const renamedFile = new File([file], newName, { type: file.type });

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
        console.log(data);
        //setModal() se o cadastro não estiver completo, so abrir
        setBarbearia(data);
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
      setBarbearia(data);
      alertCustom("Dados do estabelecimento atualizados com sucesso!");
    } catch (error) {
      alertCustom("Erro ao atualizar dados do estabelecimento");
    }
  };

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
        <Grid container spacing={1.5}>
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

              {/* Avatar com a logo da barbearia */}
              <label htmlFor="profile-upload">
                <Avatar
                  src={
                    profileImage ||
                    `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${barbearia.id}/profile/${barbearia.profile}`
                  } // Renderiza a imagem de perfil
                  sx={{
                    position: "absolute",
                    top: isMobile ? "140px" : "160px",
                    left: isMobile ? "50%" : "10%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
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
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <Grid container justifyContent={"space-between"} spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 6, md: 11 } }}>
                    <Typography variant="h6">{barbearia.nome}</Typography>
                    <Typography variant="body1">
                      {barbearia.endereco}
                    </Typography>{" "}
                    <Typography variant="body1">
                      Telefone: {barbearia.telefone}
                    </Typography>
                    {["adm", "manager"].includes(
                      getLocalItem("accessType")
                    ) && (
                      <Box
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          width: "100%",
                          justifyContent: isMobile ? "center" : "left",
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
                    <Grid container spacing={2}>
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
                        <Grid size={{ xs: 12, md: 4 }}>
                          {" "}
                          <Button
                            variant="outlined"
                            color="terciary"
                            size="large"
                            startIcon={<StyleIcon />}
                            onClick={() => navigate("/plans")}
                            sx={{
                              border: "1px solid rgba(256, 256, 256, 0.2)",
                            }}
                            fullWidth
                          >
                            Planos
                          </Button>
                        </Grid>
                      )}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <WhatsApp />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {cards[getLocalItem("accessType")].map(
            ({ action, icon, title }, i) => (
              <Grid item key={i} size={{ xs: 12, md: 3 }}>
                <CustomCard onClick={() => handleOpen(action)}>
                  {icon}
                  <Typography variant="body1">{title}</Typography>
                </CustomCard>
              </Grid>
            )
          )}

          {barbearia && (
            <Agendamentos
              barbearia={barbearia}
              open={modal.agendamentos}
              handleClose={handleClose}
              alertCustom={alertCustom}
            />
          )}

          <EditFuncionarios
            barbearia={barbearia}
            dados={barbearia.funcionarios}
            open={modal.funcionarios}
            handleClose={handleClose}
            alertCustom={alertCustom}
          />
          <EditServicos
            barbearia={barbearia}
            dados={barbearia.servicos}
            open={modal.servicos}
            handleClose={handleClose}
            alertCustom={alertCustom}
          />
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
