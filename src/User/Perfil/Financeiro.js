import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid2 as Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  CardActions,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../../Componentes/Api/axios";
import { getLocalItem, isMobile, Saudacao } from "../../Componentes/Funcoes";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Cookies from "js-cookie";
import OptionsPopover from "../../Componentes/Popover";
import { useNavigate } from "react-router-dom";
import Permissions from "../../Componentes/Permissions";

const ModalRelatorio = ({
  usuario,
  alertCustom,
  handleEdit,
  handleRecover,
  reaload,
}) => {
  const [dados, setDados] = useState(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const navigate = useNavigate();
  const handleGet = async () => {
    try {
      const data = await Api.query(
        "GET",
        `/financial/user/${usuario.id}?data=${
          new Date().toISOString().split("T")[0]
        }`
      );
      setDados({
        approved: { valor: data.total },
      });
    } catch (error) {
      alertCustom("Erro ao buscar histórico financeiro!");
    }
  };

  useEffect(() => {
    handleGet();
  }, []);

  const handlePhotoUpload = async (e, userId) => {
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
          const endpoint = `/images/user/${userId}`;
          await Api.query("POST", endpoint, formData);
          reaload();
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

  return (
    <Grid size={12}>
      <Card
        elevation={0}
        sx={{
          top: "15px",
          height: "180px",
          overflow: "visible",
          m: "-16px -16px 60px -16px",
          p: "8px 24px",
          borderRadius: { xs: 0, md: "10px" },
          background: { xs: "none", md: "#363636" },
        }}
      >
        <CardHeader
          avatar={
            <Box sx={{ position: "relative", width: 80, height: 80 }}>
              <Avatar
                sx={{
                  bgcolor: "#0195F7",
                  width: 80,
                  height: 80,
                  fontSize: 30,
                  color: "rgba(256,256,256,0.5)",
                  fontWeight: 600,
                }}
                src={`${process.env.REACT_APP_BACK_TONSUS}/images/user/${usuario.id}/${usuario.foto}`}
              >
                {usuario.nome[0].toUpperCase()}
              </Avatar>

              {/* Botão de upload */}
              {getLocalItem("establishmentId") && (
                <label htmlFor="upload-foto">
                  <input
                    id="upload-foto"
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    style={{ display: "none" }}
                    onChange={(e) => handlePhotoUpload(e, usuario.id)}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "rgba(0,0,0,0.6)",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="caption" color="#fff">
                      +
                    </Typography>
                  </Box>
                </label>
              )}
            </Box>
          }
          title={<Typography variant="body1">{Saudacao()}</Typography>}
          subheader={
            <Typography variant="h6" sx={{ mt: "-8px" }}>
              {usuario.nome.split(" ")[0]}
            </Typography>
          }
          action={
            <Grid container spacing={isMobile ? 0 : 1}>
              <IconButton onClick={handleEdit}>
                <ModeEditOutlineOutlinedIcon />
              </IconButton>{" "}
              <OptionsPopover
                options={[
                  {
                    title: "Gerenciar permissões",
                    action: () => {
                      setOpenPermissions(true);
                      Cookies.remove("getPermission");
                    },
                  },
                  {
                    title: "Trocar senha",
                    action: handleRecover,
                  },
                  {
                    title: "Editar meus dados",
                    action: handleEdit,
                  },
                ]}
              />
            </Grid>
          }
        />
        <CardActions
          sx={{
            display: "flex",
            justifyContent: { xs: "center", lg: "left" },
          }}
        >
          {" "}
          <Card
            variant="outlined"
            sx={{
              background: "#388E3C",
              minWidth: "350px",
              position: "relative",
            }}
          >
            <CardContent>
              <Typography variant="h6">Saldo Total </Typography>
              <Typography variant="h5">
                {mostrarSaldo
                  ? `R$ ${dados.approved.valor.toFixed(2)}`
                  : "******"}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <IconButton
                  onClick={() => setMostrarSaldo(!mostrarSaldo)}
                  sx={{
                    color: "#fff",
                  }}
                >
                  {mostrarSaldo ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>

                <OptionsPopover
                  icon={<HelpRoundedIcon />}
                  options={[
                    {
                      title: "Como usar meu bônus?",
                      action: () => {
                        navigate("/faq/cashback");
                      },
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </CardActions>
      </Card>
      <Permissions
        type="view"
        open={openPermissions}
        handleClose={() => setOpenPermissions(false)}
        alertCustom={alertCustom}
      />
    </Grid>
  );
};

export default ModalRelatorio;
