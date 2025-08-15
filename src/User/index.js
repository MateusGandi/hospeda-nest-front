import React, { useEffect, useState } from "react";
import Profile from "./Perfil/Edit";
import apiService from "../Componentes/Api/axios";
import { getLocalItem, isMobile } from "../Componentes/Funcoes";
import Modal from "../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import { Grid2 as Grid, Typography } from "@mui/material";
import ListaAgendamentos from "./Perfil/Agendamentos";
import ModalRelatorio from "./Perfil/Financeiro";
import EditUserModal from "./Perfil/Edit";
import Confirm from "../Componentes/Alert/Confirm";

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
          title="Deseja proceder?"
          message={
            <Typography
              variant="body1"
              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
            >
              <Typography>
                Ao trocar sua senha você vai receber um link ou por WhatsApp ou
                por E-mail.
              </Typography>{" "}
              <Typography>
                Para ambos os casos você precisa ter concordado com o termo de
                uso e consentimento.
              </Typography>{" "}
              <Typography>
                Prosseguindo aqui, você concorda expressadamente com esses
                termos, deseja continuar?
              </Typography>
            </Typography>
          }
        />
      }
      {userData && (
        <EditUserModal
          buscar={fetch}
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
          }}
          alertCustom={alertCustom}
          userData={userData}
        />
      )}
      <Modal
        open={true}
        onClose={() =>
          navigate(getLocalItem("establishmentId") ? "/dashboard" : "/home")
        }
        titulo={"Meu perfil"}
        fullScreen="all"
        component="view"
        loading={loading}
        disablePadding={true}
      >
        {" "}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ p: 2 }}>
          <Grid item size={12}>
            <ModalRelatorio
              usuario={userData}
              alertCustom={alertCustom}
              handleEdit={() => setOpenEdit(true)}
              handleRecover={() =>
                setRecover((prev) => ({ ...prev, open: true }))
              }
              reaload={fetch}
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
