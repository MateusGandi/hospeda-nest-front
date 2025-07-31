import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal";
import ServicoForm from "./Manager";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import Confirm from "../../../Componentes/Alert/Confirm";
import { getLocalItem } from "../../../Componentes/Funcoes";

const GerenciarServicos = ({ alertCustom, onClose }) => {
  const handleCancelEdit = () => {
    setModal({
      open: false,
      titulo: "Adicionar novo serviço",
      servicoSelecionado: null,
      actionText: "Adicionar",
      barbeariaId: getLocalItem("establishmentId"),
    });
  };
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo serviço",
    servicoSelecionado: null,
    actionText: "Adicionar",
    loading: false,
    barbeariaId: getLocalItem("establishmentId"),
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const handleDelete = async (item) => {
    try {
      await Api.query("DELETE", `/service/${item.id}/${modal.barbeariaId}`);
      setServicos(servicos.filter((op) => op.id != item.id));
      alertCustom("Serviço deletado com sucesso!");
    } catch (error) {
      alertCustom("Erro ao deletar serviço!");
    }
    handleCancelEdit();
  };

  const handleSelect = async (item) => {
    setModal({
      buttons: [
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Deletar serviço",
          action: () => handleDelete(item),
        },
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Cancelar Edição",
          action: () => handleCancelEdit(),
        },
      ],
      open: true,
      titulo: `Editar ${item.nome}`,
      servicoSelecionado: { ...item, tempoGasto: item.tempoGasto.slice(0, 5) },
      barbeariaId: getLocalItem("establishmentId"),
      actionText: "Salvar",
    });
    await fetchFuncionarios(item.id);
  };

  const addItem = () => {
    setModal({
      open: true,
      servicoSelecionado: null,
      titulo: "Adicionar novo serviço",
      barbeariaId: getLocalItem("establishmentId"),
    });
  };

  const handleSave = async (dados = []) => {
    const apenasSalvar = dados.length > 0;
    try {
      const servicosAtualizados = [...dados, ...servicos]
        .filter((item) => (!!item.flag && item.id) || !item.id)
        .map(({ flagUpdate, ...item }) => ({
          ...item,
          barbeariaId: modal.barbeariaId,
        }));

      if (servicosAtualizados.find((item) => item.tempoGasto.length < 5))
        return alertCustom("Horário no formato inválido");

      if (
        servicosAtualizados.find((item) =>
          Object.values(item).some((value) => !value)
        )
      )
        return alertCustom("Informe todos os campos obrigatórios");

      if (servicosAtualizados.length)
        await Api.query("POST", `/service`, servicosAtualizados);

      await fetchServicos();
      !apenasSalvar && alertCustom("Serviços atualizados com sucesso!");
    } catch (error) {
      !apenasSalvar && alertCustom("Erro ao cadastrar serviços!");
    }
  };

  const handleSavePreServices = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await Api.query("GET", `/service`);
      if (data.length == 0) {
        setOpenAlertModal(false);
        return alertCustom("Nenhum serviço pré-definido encontrado!");
      }

      handleSave(data.map(({ id, ...item }) => ({ ...item, flag: true })));
      setOpenAlertModal(false);
    } catch (error) {
      alertCustom("Erro ao cadastrar serviços!");
    } finally {
      setModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchServicos = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await Api.query("GET", `/service/${modal.barbeariaId}`);
      setServicos(data);
      if (data && !data.length) {
        setOpenAlertModal(true);
      }
    } catch (error) {
      alertCustom("Houve um problema ao buscar serviços");
    }
    setModal((prev) => ({ ...prev, loading: false }));
  };

  const fetchFuncionarios = async (serviceId) => {
    try {
      const funcionarios = await Api.query(
        "GET",
        `/establishment/employees/${modal.barbeariaId}`
      );

      const comissoes = await Api.query(
        "GET",
        `/service/commission-configurations/${serviceId}`
      );

      const funcionariosComComissoes = funcionarios.map((func) => {
        const comissao = comissoes.find((c) => c.funcionarioId === func.id);
        return {
          ...func,
          percentual: comissao?.percentual || 0,
          valorFixo: comissao?.valorFixo || 0,
        };
      });

      setFuncionarios(funcionariosComComissoes);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      alertCustom("Erro ao buscar funcionários!");
    }
  };

  useEffect(() => {
    if (!modal.open) fetchServicos();
  }, [modal.open]);

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
          fetchServicos();
        } catch (uploadError) {
          alertCustom("Erro ao adicionar foto!");
          console.error("Erro ao fazer upload da imagem:", uploadError);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    } finally {
      fetchServicos();
    }
  };

  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        titulo={"Gerenciar serviços"}
        onAction={addItem}
        actionText="Novo Serviço"
        fullScreen="all"
        component="view"
        loading={modal.loading}
      >
        <ServicoForm
          formData={modal.servicoSelecionado}
          setFormData={setServicos}
          actionText={modal.actionText}
          open={modal.open}
          onSubmit={modal.onSubmit}
          submitText={modal.submitText}
          setOpen={(e) =>
            setModal((prev) => ({
              ...prev,
              open: e,
              servicoSelecionado: null,
            }))
          }
          funcionarios={funcionarios}
          setFuncionarios={setFuncionarios}
          titulo={modal.titulo}
          buttons={modal.buttons}
          barbeariaId={modal.barbeariaId}
          servicos={servicos}
          alertCustom={alertCustom}
        />

        {servicos && servicos.length ? (
          <Grid container spacing={2}>
            {" "}
            <Grid size={12}>
              {" "}
              <Typography variant="body1" className="show-box">
                <Typography variant="h6">
                  <Icon>💡</Icon>Ajuda rápida
                </Typography>
                Clique sobre um <b>SERVIÇO</b> para adicionar uma foto ou em{" "}
                <b>EDITAR</b> para alterar informações
              </Typography>
            </Grid>
            <Grid size={12}>
              {" "}
              <Cards
                onUpload={handlePhotoUpload}
                oneTapMode={true}
                onDelete={(item) => handleDelete({ id: item })}
                label="serviço"
                keys={[
                  { label: "", value: "nome" },
                  {
                    label: "",
                    value: "preco",
                    format: (value) =>
                      `R$ ${(+value).toFixed(2)}`.replace(".", ","),
                  },
                ]}
                onEdit={handleSelect}
                items={servicos.map((item, index) => ({
                  ...item,
                  imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/service/${item.id}/${item.foto}`,
                  titulo: item.nome,
                  subtitulo:
                    item.tempoGasto && item.descricao
                      ? `Duração: ${item.tempoGasto} - ${item.descricao}`
                      : "Sem descrição",
                }))}
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
              Nenhum serviço cadastrado ainda...
            </Typography>
          </Typography>
        )}
      </Modal>

      <Confirm
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={handleSavePreServices}
        title={"Começar com pré-definidos"}
        message="Gostaria de usar e editar serviços pré-definidos?"
      />
    </>
  );
};

export default GerenciarServicos;
