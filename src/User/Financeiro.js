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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Api from "../Componentes/Api/axios";
import { isMobile, Saudacao } from "../Componentes/Funcoes";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const ModalRelatorio = ({ usuario, alertCustom, handleEdit }) => {
  const [dados, setDados] = useState(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);

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
                bgcolor: "#fff",
                width: "50px",
                height: "50px",
                fontSize: 30,
                color: "#212121",
                fontWeight: 600,
              }}
            >
              {usuario.nome[0].toUpperCase()}
            </Avatar>
          }
          title={<Typography variant="body1">{Saudacao()}</Typography>}
          subheader={
            <Typography variant="h6" sx={{ mt: "-8px" }}>
              {usuario.nome}
            </Typography>
          }
          action={
            isMobile ? (
              <IconButton onClick={handleEdit}>
                <ModeEditOutlineOutlinedIcon />
              </IconButton>
            ) : (
              <Button
                color="#fff"
                variant="outlined"
                sx={{ border: "1px solid rgb(98, 98, 98)" }}
                onClick={handleEdit}
              >
                Editar dados
              </Button>
            )
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
              <Typography variant="h6">Total Cash Back</Typography>
              <Typography variant="h5">
                {mostrarSaldo
                  ? `R$ ${dados.approved.valor.toFixed(2)}`
                  : "******"}
              </Typography>
              <IconButton
                onClick={() => setMostrarSaldo(!mostrarSaldo)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "#fff",
                }}
              >
                {mostrarSaldo ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </CardContent>
          </Card>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ModalRelatorio;
