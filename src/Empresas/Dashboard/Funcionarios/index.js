import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import FuncionarioForm from "./AdicionarFuncionario";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";

const GerenciarFuncionarios = ({
  dados,
  barbearia,
  open,
  handleClose,
  alertCustom,
}) => {
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo funcionário",
    funcionarioSelecionado: null,
    actionText: "Adicionar",
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    setFuncionarios(dados);
  }, [dados]);
  const handleDelete = async (item) => {
    try {
      await Api.query("DELETE", `/employees/${item.id}`);
      setFuncionarios(funcionarios.filter((op) => op.id != item.id));
      alertCustom("Funcionários atualizados com sucesso!");
    } catch (error) {
      alertCustom("Erro ao remover funcionário!");
    }
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setModal({
      open: false,
      titulo: "Adicionar novo funcionário",
      funcionarioSelecionado: null,
      actionText: "Adicionar",
    });
  };
  const handleSelect = (item) => {
    setModal({
      open: true,
      buttons: [
        {
          color: "error",
          titulo: "Remover funcionário",
          action: () => handleDelete(item),
        },
      ],
      titulo: `Editar dados de ${item.nome}`,
      funcionarioSelecionado: item,
      onSubmit: () => handleCancelEdit(),
      submitText: "Cancelar Edição",
      actionText: "Editar",
    });
  };
  const addFuncionario = () => {
    setModal({
      open: true,
      titulo: "Adicionar novo funcionário",
    });
  };

  const editFuncionario = (funcionario) => {
    setModal({
      open: true,
      titulo: `Editar dados de ${funcionario.nome}`,
      funcionarioSelecionado: funcionario,
    });
  };

  const handleSave = async () => {
    //envio para a api
    try {
      await Api.query("PATCH", `/establishment/${barbearia.id}`, {
        funcionarios: funcionarios.map((item) => ({
          userId: item.id,
          servicesId: item.servicosPrestados.map((service) => service.id),
        })),
      });
      alertCustom("Equipe atualizada!");
    } catch (error) {
      alertCustom("Erro ao cadastrar funcionários");
    }
  };

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const dados = await Api.query("GET", `/service/${barbearia.id}`);
        setServicos(dados);
      } catch (e) {
        console.log(e);
        alertCustom("Erro ao buscar serviços!");
      }
    };

    fetchServicos();
  }, [barbearia.id]);

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
        open={open}
        onClose={handleClose}
        titulo={"Gerenciar funcionários"}
        onAction={handleSave}
        actionText={"Salvar"}
        onSubmit={addFuncionario}
        submitText="Adicionar Funcionário"
        fullScreen="all"
        component="view"
      >
        <FuncionarioForm
          formData={modal.funcionarioSelecionado}
          setFormData={setFuncionarios}
          actionText={modal.actionText}
          open={modal.open}
          onSubmit={modal.onSubmit}
          submitText={modal.submitText}
          setOpen={(e) => setModal((prev) => ({ ...prev, open: e }))}
          titulo={modal.titulo}
          servicos={servicos}
          buttons={modal.buttons}
        />{" "}
        {funcionarios && funcionarios.length ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Cards
                onEdit={editFuncionario}
                onUpload={handlePhotoUpload}
                oneTapMode={true}
                onSelect={handleSelect}
                items={funcionarios.map((item, index) => ({
                  ...item,
                  imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/user/${item.id}/${item.foto}`,
                  titulo: `${item.nome} - ${item.telefone}`,

                  subtitulo: item.servicosPrestados?.length
                    ? item.servicosPrestados.map(({ nome }) => nome).join(", ")
                    : "Sem serviços cadastrados",
                }))}
                keys={[
                  { label: "", value: "nome" },
                  { label: "Tel", value: "telefone" },
                ]}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" className="show-box">
                Aviso: Clique sobre um funcionário para editar ou excluir
              </Typography>
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
        )}
      </Modal>
    </>
  );
};

export default GerenciarFuncionarios;
