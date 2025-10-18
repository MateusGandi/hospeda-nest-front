import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal/Simple";
import { useNavigate, useParams } from "react-router-dom";
import FuncionarioForm from "./AdicionarFuncionario";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Cards } from "../../../Componentes/Lista/Cards";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";
import Icon from "../../../Assets/Emojis";
import {
  formatPhone,
  getLocalItem,
  isMobile,
  orderBy,
  setLocalItem,
} from "../../../Componentes/Funcoes";
import View from "../../../Componentes/View";
import Confirm from "../../../Componentes/Alert/Confirm";

const INITIAL_FORM = {
  open: false,
  titulo: "Adicionar novo funcionário",
  actionText: "Adicionar",
  loading: false,
  barbeariaId: null,
  funcionario: null,
  escala: false,
  actionLoading: false,
  buttons: [],
};
const GerenciarFuncionarios = ({ alertCustom, reload }) => {
  const { subPath } = useParams();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
    origin: "from-list",
  });
  const [modal, setModal] = useState({
    ...INITIAL_FORM,
    barbeariaId: getLocalItem("establishmentId"),
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);

  const handleDelete = async () => {
    try {
      const { item, origin } = confirmDelete;
      setModal((prev) => ({ ...prev, actionLoading: true }));

      await Api.query("PATCH", `/establishment/${modal.barbeariaId}`, {
        funcionarios: funcionarios
          .filter((op) => op.id != item.id)
          .map((item) => ({
            userId: item.id,
            servicesId: item.servicosPrestados.map((service) => service.id),
          })),
      });
      if (item.id === getLocalItem("userId")) {
        setLocalItem("funcionario", false);
        reload && reload();
      }

      fetchFuncionarios();
      if (origin === "from-list") navigate("/dashboard/funcionarios");

      setModal({
        ...INITIAL_FORM,
        barbeariaId: getLocalItem("establishmentId"),
      });
      setConfirmDelete((prev) => ({
        ...prev,
        origin: "from-list",
        open: false,
      }));
      alertCustom("Funcionário removido com sucesso!");
    } catch (error) {
      alertCustom("Erro ao remover funcionários");
    } finally {
      setModal((prev) => ({ ...prev, actionLoading: false }));
    }

    handleClose();
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSelect = (item) => {
    navigate(`/dashboard/funcionarios/${item.id}`);
  };

  useEffect(() => {
    if (subPath != "novo") {
      const funcionario = funcionarios.find((f) => f.id === +subPath);

      if (funcionario) {
        setModal({
          open: true,
          buttons: [
            {
              color: "terciary",
              variant: "outlined",
              titulo: "Remover funcionário",
              action: () =>
                setConfirmDelete({
                  open: true,
                  origin: "from-form",
                  item: funcionario,
                }),
            },
            {
              color: "terciary",
              variant: "outlined",
              titulo: "Cancelar Edição",
              action: () => handleClose(),
            },
          ],
          titulo: `Editar dados de ${funcionario.nome}`,
          actionText: "Salvar",
          barbeariaId: getLocalItem("establishmentId"),
          funcionario: funcionario,
          escala: false,
        });
      } else {
        navigate("/dashboard/funcionarios");
        setModal((prev) => ({
          ...prev,
          open: false,
        }));
      }
    } else {
      setModal({
        ...INITIAL_FORM,
        barbeariaId: getLocalItem("establishmentId"),
        funcionario: null,
        open: true,
      });
    }
  }, [subPath, funcionarios]);

  const addFuncionario = (a) => {
    setModal({
      ...INITIAL_FORM,
      barbeariaId: getLocalItem("establishmentId"),
      open: true,
      funcionario: null,
    });
    navigate(`novo`);
  };

  const fetchFuncionarios = async () => {
    try {
      const funcionarios = await Api.query(
        "GET",
        `/establishment/employees/${modal.barbeariaId}`
      );
      const data = funcionarios.map((item) => ({
        ...item,
        imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${
          item.idOrig || item.id
        }/${item.foto}`,
        titulo: `${item.nome} - ${item.telefone}`,
        subtitulo: item.servicosPrestados?.length
          ? item.servicosPrestados.map(({ nome }) => nome).join(", ")
          : "Sem serviços cadastrados",
      }));
      setFuncionarios(orderBy(data || [], "id", "asc"));

      reload();
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
        onClose={() => navigate("/dashboard")}
        titulo={"Gerenciar funcionários"}
        onAction={addFuncionario}
        actionText="Adicionar Funcionário"
        fullScreen="all"
        component="view"
        disableSubmittion={true}
      >
        {funcionarios && funcionarios.length ? (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" className="show-box">
                <Typography variant="h6">
                  <Icon>💡</Icon>Ajuda rápida
                </Typography>
                Clique sobre um funcionário para adicionar uma foto ou em{" "}
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
                onDelete={(id, item) =>
                  setConfirmDelete({
                    origin: "from-list",
                    open: true,
                    item: item,
                  })
                }
                items={funcionarios}
                keys={[
                  { label: "", value: "nome" },
                  {
                    label: "",
                    value: "telefone",
                    format: (value) => formatPhone(value),
                  },
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
      </Modal>

      <Confirm
        loading={modal.actionLoading}
        open={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Deseja excluir o funcionário ${confirmDelete.item?.nome}?`}
      />

      <FuncionarioForm
        funcionarios={funcionarios}
        funcionario={modal.funcionario}
        setFuncionarios={setFuncionarios}
        actionText={modal.actionText}
        open={modal.open}
        onSubmit={modal.onSubmit}
        submitText={modal.submitText}
        onClose={handleClose}
        titulo={modal.titulo}
        servicos={servicos}
        buttons={modal.buttons}
        barbeariaId={modal.barbeariaId}
        alertCustom={alertCustom}
        buscarDados={fetchFuncionarios}
        reload={reload}
      />
    </>
  );
};

export default GerenciarFuncionarios;
