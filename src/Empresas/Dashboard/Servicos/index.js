import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal/Simple";
import ServicoForm from "./ServicoForm";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import Confirm from "../../../Componentes/Alert/Confirm";
import { getLocalItem, orderBy } from "../../../Componentes/Funcoes";
import { useNavigate, useParams } from "react-router-dom";

const GerenciarServicos = ({ alertCustom, reload }) => {
  const navigate = useNavigate();
  const { subPath } = useParams();
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
    origin: "from-list", // from-form
  });
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo serviço",
    servicoSelecionado: null,
    actionText: "Adicionar",
    loading: false,
    barbeariaId: getLocalItem("establishmentId"),
    actionLoading: false,
    buttons: [],
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const onClose = () => {
    navigate(-1);
    setModal((prev) => ({
      ...prev,
      open: false,
      titulo: "Adicionar novo serviço",
      actionText: "Adicionar",
      barbeariaId: getLocalItem("establishmentId"),
    }));
  };

  const handleDelete = async (item) => {
    try {
      setModal((prev) => ({ ...prev, actionLoading: true }));
      await Api.query("DELETE", `/service/${item.id}/${modal.barbeariaId}`);
      fetchServicos();
      reload();
      alertCustom("Serviço deletado com sucesso!");
      if (confirmDelete.origin != "from-form") navigate("/dashboard/servicos");
    } catch (error) {
      alertCustom("Erro ao deletar serviço!");
    } finally {
      setConfirmDelete((prev) => ({
        ...prev,
        open: false,
        origin: "from-list",
      }));
      setModal((prev) => ({ ...prev, actionLoading: false }));
      onClose();
    }
  };

  const handleSelect = async (item) => {
    setModal((prev) => ({
      ...prev,
      buttons: [
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Deletar serviço",
          action: () =>
            setConfirmDelete({
              origin: "from-form",
              open: true,
              item: item,
            }),
        },
        {
          color: "terciary",
          variant: "outlined",
          titulo: "Cancelar Edição",
          action: onClose,
        },
      ],
      open: true,
      titulo: `Editar ${item.nome}`,
      servicoSelecionado: { ...item, tempoGasto: item.tempoGasto.slice(0, 5) },
      barbeariaId: getLocalItem("establishmentId"),
      actionText: "Salvar",
    }));
    await fetchFuncionarios(item.id);
  };

  const addItem = () => {
    navigate("/dashboard/servicos/novo");
    setModal((prev) => ({
      ...prev,
      open: true,
      servicoSelecionado: null,
      titulo: "Adicionar novo serviço",
      barbeariaId: getLocalItem("establishmentId"),
    }));
  };

  const handleSave = async (dados = []) => {
    const apenasSalvar = dados.length > 0;
    try {
      setModal((prev) => ({ ...prev, actionLoading: true }));
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
          Object.values(item).some(
            (value) => !value && typeof value != "boolean"
          )
        )
      )
        return alertCustom("Informe todos os campos obrigatórios");

      if (servicosAtualizados.length)
        await Api.query("POST", `/service`, servicosAtualizados);

      await fetchServicos();
      !apenasSalvar && alertCustom("Serviços atualizados com sucesso!");
    } catch (error) {
      !apenasSalvar && alertCustom("Erro ao cadastrar serviços!");
    } finally {
      setModal((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  const handleSavePreServices = async () => {
    try {
      setModal((prev) => ({ ...prev, actionLoading: true }));
      const data = await Api.query("GET", `/service`);
      if (data.length == 0) {
        setOpenAlertModal(false);
        return alertCustom("Nenhum serviço pré-definido encontrado!");
      }

      handleSave(
        data.map(({ id, foto, ...item }) => ({
          ...item,
          flag: true,
          descricao: item.nome,
        }))
      );
      setOpenAlertModal(false);
    } catch (error) {
      alertCustom("Erro ao cadastrar serviços!");
    } finally {
      setModal((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  const fetchServicos = async () => {
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      const data = await Api.query("GET", `/service/${modal.barbeariaId}`);
      setServicos(orderBy(data || [], "id", "asc"));
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
      const employees = await Api.query(
        "GET",
        `/establishment/employees/${modal.barbeariaId}`
      );
      setFuncionarios(employees);
      const comissions = await Api.query(
        "GET",
        `/service/commission-configurations/${serviceId}`
      );
      let final = employees.map((f) => {
        const comissao = comissions.find((c) => c.funcionarioId === f.id);
        return {
          id: comissao.id,
          funcionarioId: f.id,
          nome: f.nome,
          valorFixo: comissao && comissao.tipo === "VALOR" ? comissao.valor : 0,
          percentual:
            comissao && comissao.tipo === "PERCENTUAL" ? comissao.valor : 0,
        };
      });
      setComissoes(final);
    } catch (error) {
      console.error("Erro ao buscar funcionários e comissões: ", error);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  useEffect(() => {
    if (subPath) {
      const servico = servicos.find((s) => s.id == subPath);
      if (servico) handleSelect(servico);
    }
  }, [subPath]);

  const handlePhotoUpload = async (e, serviceId) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("Nenhum arquivo selecionado.");
      return;
    }

    try {
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
          onClose={onClose}
          open={modal.open}
          fetchServicos={fetchServicos}
          formData={modal.servicoSelecionado}
          setFormData={setServicos}
          barbeariaId={modal.barbeariaId}
          funcionarios={funcionarios}
          comissoes={comissoes}
          titulo={modal.titulo}
          buttons={modal.buttons}
          alertCustom={alertCustom}
          actionText={modal.actionText}
        />

        {servicos && servicos.length ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" className="show-box">
                <Typography variant="h6">
                  <Icon>💡</Icon> Ajuda rápida
                </Typography>
                Clique sobre um <b>SERVIÇO</b> para adicionar uma foto ou em{" "}
                <b>EDITAR</b> para alterar informações
              </Typography>
            </Grid>
            <Grid size={12}>
              <Cards
                onUpload={handlePhotoUpload}
                oneTapMode={true}
                onDelete={(id, item) =>
                  setConfirmDelete({
                    origin: "from-list",
                    open: true,
                    item: item,
                  })
                }
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
                onEdit={(item) => navigate(`/dashboard/servicos/${item.id}`)}
                items={servicos.map((item) => ({
                  ...item,
                  imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/service/${item.id}/${item.foto}`,
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
        loading={modal.actionLoading}
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={handleSavePreServices}
        title={"Começar com pré-definidos"}
        message="Gostaria de usar e editar serviços pré-definidos?"
      />

      <Confirm
        loading={modal.actionLoading}
        open={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={() => handleDelete(confirmDelete.item)}
        title="Confirmar Exclusão"
        message={`Deseja excluir o serviço ${confirmDelete.item?.nome}?`}
      />
    </>
  );
};

export default GerenciarServicos;
