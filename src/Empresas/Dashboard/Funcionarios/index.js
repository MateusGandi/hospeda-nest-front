import React, { useEffect, useState } from "react";
import Modal from "../../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import FuncionarioForm from "./AdicionarFuncionario";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";

const GerenciarFuncionarios = ({
  dados,
  barbearia,
  open,
  handleClose,
  alertCustom,
}) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    titulo: "Adicionar novo funcionário",
    funcionarioSelecionado: null,
    actionText: "Adicionar",
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([
    { id: 1, nome: "Corte", duracao: 30, valor: 50 },
    { id: 2, nome: "Barba", duracao: 20, valor: 30 },
    { id: 3, nome: "Coloração", duracao: 120, valor: 150 },
    { id: 4, nome: "Hidratação", duracao: 60, valor: 80 },
    { id: 5, nome: "Alisamento", duracao: 180, valor: 200 },
  ]);

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
          titulo: "Remover funcionários",
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
  const handleSave = async () => {
    //envio para a api
    try {
      const funcionariosNovos = funcionarios.filter((item) => !item.id);
      await Api.query(
        "POST",
        `/establishment/employees/${barbearia.id}`,
        funcionariosNovos
      );
      alertCustom("Equipe atualizada!");
    } catch (error) {
      alertCustom("Erro ao cadastrar funcionários");
    }
  };

  useEffect(() => {
    const fetchServicos = async () => {
      const dados = await Api.query(
        "GET",
        `/establishment/services/${barbearia.id}`
      );
      setServicos(dados);
    };
    setFuncionarios(dados);
    // fetchServicos()
  }, [dados]);
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
          <>
            <Rows
              oneTapMode={true}
              onSelect={handleSelect}
              items={funcionarios.map((item, index) => ({
                ...item,
                id: index,
                titulo: `${item.nome} - ${item.telefone}`,
                subtitulo: item.servicosPrestados?.length
                  ? item.servicosPrestados.map(({ nome }) => nome).join(", ")
                  : "Sem serviços cadastrados",
              }))}
            />
            <Typography variant="body1" className="show-box">
              Aviso: Clique sobre um funcionário para editar ou excluir
            </Typography>
          </>
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
