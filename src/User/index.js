import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import apiService from "../Componentes/Api/axios";

const Usuarios = () => {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await apiService.query("GET", "/auth/profile");

        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da conta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Profile
        open={open}
        setOpen={setOpen}
        formData={userData}
        setFormData={setUserData}
        titulo={`Bem vindo, ${localStorage.nome}!`}
        loading={loading}
      />
    </>
  );
};

export default Usuarios;
