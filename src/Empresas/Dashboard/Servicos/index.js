import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import ServicoForm from "./addServico";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";

const GerenciarServicos = ({
  dados,
  barbearia,
  open,
  handleClose,
  alertCustom,
}) => {
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo serviço",
    servicoSelecionado: null,
    actionText: "Adicionar",
  });
  const [servicos, setServicos] = useState([]);
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const handleDelete = async (item) => {
    try {
      await Api.query("DELETE", `/service/${item.id}`);
      setServicos(servicos.filter((op) => op.id != item.id));
      alertCustom("Serviços atualizados com sucesso!");
    } catch (error) {
      alertCustom("Erro ao deletar serviço!");
    }
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setModal({
      open: false,
      titulo: "Adicionar novo serviço",
      servicoSelecionado: null,
      actionText: "Adicionar",
    });
  };
  const handleSelect = (item) => {
    setModal({
      buttons: [
        {
          color: "error",
          titulo: "Deletar serviço",
          action: () => handleDelete(item),
        },
      ],
      open: true,
      titulo: `Editar ${item.nome}`,
      servicoSelecionado: { ...item, tempoGasto: item.tempoGasto.slice(0, 5) },
      onSubmit: () => handleCancelEdit(),
      submitText: "Cancelar Edição",
      actionText: "Editar",
    });
  };
  const addItem = () => {
    setModal({
      open: true,
      titulo: "Adicionar novo serviço",
    });
  };
  const handleSave = async () => {
    try {
      const servicosAtualizados = servicos.map(({ flagUpdate, ...item }) => ({
        ...item,
        barbeariaId: barbearia.id,
      }));

      if (servicosAtualizados.length)
        await Api.query("POST", `/service`, servicosAtualizados);

      await fetchServicos();
      alertCustom("Serviços atualizados atualizada!");
    } catch (error) {
      alertCustom("Erro ao cadastrar serviços!");
    }
  };

  const handleSavePreServices = async () => {
    try {
      const data = await Api.query("GET", `/service`);
      setServicos(data);
      setOpenAlertModal(false);
    } catch (error) {
      alertCustom("Erro ao cadastrar serviços!");
    }
  };
  const fetchServicos = async () => {
    const dados = await Api.query("GET", `/service/${barbearia.id}`);
    setServicos(dados);
  };

  useEffect(() => {
    if (dados && !dados.length) {
      return setOpenAlertModal(true);
    }
    setServicos(dados);
    fetchServicos();
  }, [open]);

  const handlePhotoUpload = async (e, serviceId) => {
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
          const endpoint = `/images/service/${serviceId}`;
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
        titulo={"Gerenciar serviços"}
        onAction={handleSave}
        actionText={"Salvar"}
        onSubmit={addItem}
        submitText="Adicionar serviços"
        fullScreen="all"
        component="view"
      >
        <ServicoForm
          formData={modal.servicoSelecionado}
          setFormData={setServicos}
          actionText={modal.actionText}
          open={modal.open}
          onSubmit={modal.onSubmit}
          submitText={modal.submitText}
          setOpen={(e) => setModal((prev) => ({ ...prev, open: e }))}
          titulo={modal.titulo}
          buttons={modal.buttons}
        />{" "}
        {servicos && servicos.length ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              {" "}
              <Cards
                onUpload={handlePhotoUpload}
                oneTapMode={true}
                label="produto"
                keys={[
                  { label: "", value: "nome" },
                  { label: "Preço (R$)", value: "preco" },
                ]}
                onEdit={handleSelect}
                items={servicos.map((item, index) => ({
                  ...item,
                  imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/service/${item.id}/${item.foto}`,
                  titulo: item.nome,
                  subtitulo:
                    item.tempoGasto && item.descricao
                      ? `Duração: ${item.tempoGasto} - ${item.descricao}`
                      : "Sem descrição",
                }))}
              />
            </Grid>
            <Grid size={12}>
              {" "}
              <Typography variant="body1" className="show-box">
                💡 Clique sobre o item para trocar a imagem
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
            <Typography variant="body1">Nenhum serviço cadastrado</Typography>
          </Typography>
        )}
      </Modal>
      <Modal
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        titulo={"Começar com pré-definidos"}
        onAction={handleSavePreServices}
        actionText={"Quero usar"}
        onSubmit={() => setOpenAlertModal(false)}
        submitText="Quero cadastrar os meus"
        maxWidth="xs"
        fullScreen="mobile"
        component="modal"
      >
        <Typography variant="body1" sx={{ m: 1 }} color="GrayColor">
          Gostaria de usar e editar serviços pré-definidos?
        </Typography>
      </Modal>
    </>
  );
};

export default GerenciarServicos;
