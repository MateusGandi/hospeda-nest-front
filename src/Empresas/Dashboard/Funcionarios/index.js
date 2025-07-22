import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import FuncionarioForm from "./AdicionarFuncionario";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import { getLocalItem } from "../../../Componentes/Funcoes";
import WorkSchedule from "../Escala";

const GerenciarFuncionarios = ({ alertCustom, onClose }) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo funcionário",
    funcionarioSelecionado: null,
    actionText: "Adicionar",
    loading: false,
    barbeariaId: getLocalItem("establishmentId"),
    funcionario: null,
    escala: false,
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);

  const handleDelete = async (item) => {
    try {
      setModal((prev) => ({ ...prev, loading: true }));
      await Api.query("PATCH", `/establishment/${modal.barbeariaId}`, {
        funcionarios: funcionarios
          .filter((op) => op.id != item.id)
          .map((item) => ({
            userId: item.id,
            servicesId: item.servicosPrestados.map((service) => service.id),
          })),
      });
      setFuncionarios(funcionarios.filter((op) => op.id != item.id));
      alertCustom("Funcionário removido com sucesso!");
    } catch (error) {
      alertCustom("Erro ao remover funcionários");
    } finally {
      setModal((prev) => ({ ...prev, loading: false }));
    }

    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setModal({
      open: false,
      titulo: "Adicionar novo funcionário",
      funcionarioSelecionado: null,
      actionText: "Adicionar",
      barbeariaId: getLocalItem("establishmentId"),
      funcionario: null,
      escala: false,
    });
  };

  const handleSelect = (item) => {
    setModal({
      open: true,
      buttons: [
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Remover funcionário",
          action: () => handleDelete(item),
        },
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Cancelar Edição",
          action: () => handleCancelEdit(),
        },
      ],
      titulo: `Editar dados de ${item.nome}`,
      funcionarioSelecionado: item,
      actionText: "Editar",
      barbeariaId: getLocalItem("establishmentId"),
      funcionario: item,
      escala: false,
    });
  };

  const addFuncionario = () => {
    setModal({
      open: true,
      barbeariaId: getLocalItem("establishmentId"),
      titulo: "Adicionar novo funcionário",
      funcionario: null,
      escala: false,
    });
  };

  const fetchFuncionarios = async () => {
    try {
      const { funcionarios } = await Api.query(
        "GET",
        `/establishment?establishmentId=${modal.barbeariaId}`
      );
      setFuncionarios(
        funcionarios.map((item) => ({
          ...item,
          imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/user/${
            item.idOrig || item.id
          }/${item.foto}`,
          titulo: `${item.nome} - ${item.telefone}`,
          subtitulo: item.servicosPrestados?.length
            ? item.servicosPrestados.map(({ nome }) => nome).join(", ")
            : "Sem serviços cadastrados",
        }))
      );
    } catch (error) {
      alertCustom("Erro ao buscar funcionários!");
    }
  };

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const dados = await Api.query("GET", `/service/${modal.barbeariaId}`);
        setServicos(dados);
      } catch (e) {
        alertCustom("Erro ao buscar serviços!");
      }
    };

    setModal((prev) => ({ ...prev, loading: true }));
    Promise.all([fetchServicos(), fetchFuncionarios()]).finally(() => {
      setModal((prev) => ({ ...prev, loading: false }));
    });
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
          fetchFuncionarios();
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
    <>
      <Modal
        loading={modal.loading}
        open={true}
        onClose={onClose}
        titulo={"Gerenciar funcionários"}
        onAction={addFuncionario}
        actionText="Adicionar Funcionário"
        fullScreen="all"
        component="view"
      >
        {funcionarios && funcionarios.length ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" className="show-box">
                <Typography variant="h6">
                  <Icon>💡</Icon>Ajuda rápida
                </Typography>
                Clique sobre um funcionário para adicionar uma foto ou em
                <b>EDITAR</b> para adicionar <b>SERVIÇOS</b> ao atendimento do
                funcionário
              </Typography>
            </Grid>
            <Grid size={12}>
              <Cards
                label="funcionário"
                onEdit={handleSelect}
                onUpload={handlePhotoUpload}
                oneTapMode={true}
                onDelete={(item) => handleDelete({ id: item })}
                items={funcionarios}
                keys={[
                  { label: "", value: "nome" },
                  { label: "", value: "telefone" },
                ]}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography
            variant="h5"
            sx={{
              width: "100%",
              height: "70vh",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Opps!
            <Typography variant="body1">
              Nenhum funcionário cadastrado
            </Typography>
          </Typography>
        )}{" "}
        {/* <WorkSchedule
          dados={modal.funcionario}
          type="button"
          openModal={modal.escala}
          alertCustom={alertCustom}
          handleCloseModal={() =>
            setModal((prev) => ({ ...prev, escala: false }))
          }
        /> */}
      </Modal>
      <FuncionarioForm
        funcionarios={funcionarios}
        funcionario={modal.funcionarioSelecionado}
        setFuncionarios={setFuncionarios}
        actionText={modal.actionText}
        open={modal.open}
        onSubmit={modal.onSubmit}
        submitText={modal.submitText}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        titulo={modal.titulo}
        servicos={servicos}
        buttons={modal.buttons}
        barbeariaId={modal.barbeariaId}
        alertCustom={alertCustom}
        buscarDados={fetchFuncionarios}
      />
    </>
  );
};

export default GerenciarFuncionarios;
