import React, { useEffect, useState } from "react";
import Profile from "./Edit";
import apiService from "../Componentes/Api/axios";
import { getLocalItem, isMobile } from "../Componentes/Funcoes";
import Modal from "../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import { Grid2 as Grid, Typography } from "@mui/material";
import ListaAgendamentos from "./Agendamentos";
import ModalRelatorio from "./Financeiro";
import EditUserModal from "./Edit";
import Confirm from "../Componentes/Alert/Confirm";
import EmojiNumber from "../Assets/Emojis/EmojiNumber";

const Usuarios = ({ alertCustom }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleResetPassword = async () => {
    try {
      const data = await apiService.query(
        "POST",
        `/user/recover/${userData.telefone}`
      );
      alertCustom(data);
      setRecover((prev) => ({ ...prev, open: false }));
    } catch (error) {
      alertCustom(
        error.response.data?.message || "Erro ao solicitar link de recuperação"
      );
    }
  };

  const [recover, setRecover] = useState({
    open: false,
    message: "",
  });
  const fetch = async () => {
    setLoading(true);
    try {
      const data = await apiService.query(
        "GET",
        `/user/profile/${getLocalItem("userId")}`
      );
      setUserData(data);
    } catch (error) {
      console.error("Erro ao buscar dados da conta:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetch().then(() => {
      setRecover({
        open: false,
        message: "",
        onCancel: () => {
          setRecover((prev) => ({ ...prev, open: false }));
        },
      });
    });
  }, []);

  return (
    <>
      {
        <Confirm
          open={recover.open}
          onClose={recover.onCancel}
          onConfirm={handleResetPassword}
          title="Deseja realmente trocar sua senha?"
          message={
            <Typography variant="body1">
              Ao trocar sua senha você vai receber um link:
              <Typography
                variant="body1"
                sx={{ m: 1, display: "flex", gap: 1 }}
              >
                <EmojiNumber num={1} /> Por WhatsApp
              </Typography>
              <Typography
                variant="body1"
                sx={{ m: 1, display: "flex", gap: 1 }}
              >
                <EmojiNumber num={2} />
                Por E-mail
              </Typography>
              <Typography variant="body1">
                Para ambos os casos você precisa ter concordado com o termo de
                uso e consentimento. Prosseguindo aqui, você concorda
                expressadamente com esses termos, deseja continuar?
              </Typography>
            </Typography>
          }
        />
      }
      {userData && (
        <EditUserModal
          buscar={fetch}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          alertCustom={alertCustom}
          userData={userData}
        />
      )}
      <Modal
        open={true}
        onClose={() => navigate("/home")}
        titulo={"Meu perfil"}
        fullScreen="all"
        component="view"
        loading={loading}
        disablePadding={true}
        buttons={[
          {
            color: "error",
            action: () => setRecover((prev) => ({ ...prev, open: true })),
            titulo: "Resetar Senha",
          },
        ]}
      >
        {" "}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ p: 2 }}>
          <Grid item size={12}>
            <ModalRelatorio
              usuario={userData}
              alertCustom={alertCustom}
              handleEdit={() => setOpenEdit(true)}
            />
          </Grid>
          <Grid item size={12}>
            <ListaAgendamentos usuario={userData} alertCustom={alertCustom} />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default Usuarios;
