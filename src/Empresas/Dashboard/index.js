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
import { isMobile } from "../../Componentes/Funcoes";
import Api from "../../Componentes/Api/axios";

import { Edit, People, Build, CalendarMonth } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const BarberShopMenu = ({ alertCustom }) => {
  const navigate = useNavigate();
  const { subPath } = useParams();

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

  const handleOpen = (to) => {
    if (!to) return;
    setModal((prev) => ({ ...prev, [to]: true }));
  };

  const handleClose = () => {
    setModal({ ...Object.keys(modal).map((key) => ({ [key]: false })) });
  };

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
          `/establishment?establishmentId=${localStorage?.establishmentId}`
        );
        console.log(data);
        //setModal() se o cadastro não estiver completo, so abrir
        setBarbearia(data);
      } catch (error) {
        alertCustom("Erro ao buscar informações do estabelecimento!");
      }
    };
    if (subPath) navigate("/dashboard");
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
    <Container maxWidth="lg" sx={{ p: "5px" }}>
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
        <Grid container spacing={1}>
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
                    `${String(process.env.REACT_APP_BACK_TONSUS).replace(
                      /"/g,
                      ""
                    )}/images/establishment/${barbearia.id}/banner/${
                      barbearia.banner
                    }`
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
                  sx={{ position: "absolute", right: 1, top: 1 }}
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
                    `${String(process.env.REACT_APP_BACK_TONSUS).replace(
                      /"/g,
                      ""
                    )}/images/establishment/${barbearia.id}/profile/${
                      barbearia.profile
                    }`
                  } // Renderiza a imagem de perfil
                  sx={{
                    position: "absolute",
                    top: isMobile ? "140px" : "160px",
                    left: isMobile ? "50%" : "10%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    width: {
                      xs: 120, // Para telas pequenas
                      md: 160, // Para telas médias e maiores
                    },
                    height: {
                      xs: 120,
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
                  <Grid size={{ xs: 12, md: 4 }} sx={{ pt: { xs: 4, md: 11 } }}>
                    <Typography variant="h6">{barbearia.nome}</Typography>
                    <Typography variant="body1">
                      {barbearia.endereco}
                    </Typography>{" "}
                    <Typography variant="body1">
                      Telefone: {barbearia.telefone}
                    </Typography>
                    <EditData
                      open={modal.edicao}
                      handleClose={handleClose}
                      initialData={barbearia}
                      onSave={handleSave}
                      alertCustom={alertCustom}
                    />
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
                      <Grid size={{ xs: 12, md: 4 }}>
                        {" "}
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<StyleIcon />}
                          onClick={() => navigate("/plans")}
                          sx={{ border: "1px solid rgba(256, 256, 256, 0.2)" }}
                          fullWidth
                        >
                          Planos
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <WhatsApp />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <CustomCard onClick={() => handleOpen("edicao")}>
              <Edit sx={{ mr: 1 }} />
              <Typography variant="body1">Editar dados da barbearia</Typography>
            </CustomCard>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <CustomCard onClick={() => handleOpen("funcionarios")}>
              <People sx={{ mr: 1 }} />
              <Typography variant="body1">Funcionários</Typography>
            </CustomCard>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <CustomCard onClick={() => handleOpen("servicos")}>
              <Build sx={{ mr: 1 }} /> {/* Ícone de serviços */}
              <Typography variant="body1">Serviços</Typography>
            </CustomCard>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <CustomCard
              onClick={() => {
                handleOpen("agendamento");
                navigate("/dashboard/cliente");
              }}
            >
              <CalendarMonth sx={{ mr: 1 }} /> {/* Ícone de calendário */}
              <Typography variant="body1">Agendar Cliente</Typography>
            </CustomCard>
          </Grid>

          <Grid item size={{ xs: 12, md: 3 }}>
            <CustomCard onClick={() => handleOpen("agendamentos")}>
              <CalendarMonth sx={{ mr: 1 }} /> {/* Ícone de calendário */}
              <Typography variant="body1">Minha Agenda</Typography>
            </CustomCard>
          </Grid>

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
