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
import Api from "../Componentes/Api/axios";
import { isMobile, Saudacao } from "../Componentes/Funcoes";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Cookies from "js-cookie";
import OptionsPopover from "../Componentes/Popover";
import { useNavigate } from "react-router-dom";
import Permissions from "../Componentes/Permissions";

const ModalRelatorio = ({
  usuario,
  alertCustom,
  handleEdit,
  hanldeRecover,
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
          new Date().toISOString().split("t")[0]
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

  return (
    <Grid size={12}>
      <Card
        elevation={0}
        sx={{
          top: "15px",
          height: "150px",
          overflow: "visible",
          m: "-16px -16px 60px -16px",
          p: "8px 24px",
          borderRadius: isMobile ? 0 : "10px",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "#0195F7",
                width: "50px",
                height: "50px",
                fontSize: 30,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {usuario.nome[0].toUpperCase()}
            </Avatar>
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
                    action: hanldeRecover,
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
            justifyContent: isMobile ? "center" : "left",
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
              <Typography variant="h6">Total Saldo</Typography>
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
