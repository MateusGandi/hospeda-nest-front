import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Icon, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { Rows } from "../../../Componentes/Lista/Rows";
import { formatarHorario } from "../../../Componentes/Funcoes";
import SearchField from "../../../Componentes/AutoComplete/searchAutocomplete";
import apiService from "../../../Componentes/Api/axios";
import WorkSchedule from "../Escala";

const Funcionario = ({
  funcionario, //funcionário selecionado
  setFuncionarios,
  funcionarios,
  barbearia,
  open,
  onClose,
  servicos,
  titulo,
  onSubmit,
  submitText,
  actionText,
  buttons,
  alertCustom,
  buscarDados,
}) => {
  const [data, setData] = useState({
    nome: "",
    telefone: "",
    servicosPrestados: [],
  });

  useEffect(() => {
    if (funcionario && open) {
      setData({
        ...funcionario,
        idOrig: funcionario.id,
        title: `${funcionario.nome} - ${funcionario.telefone}`,
      });
    }
  }, [open]);

  const handleSave = async () => {
    const semAtual = funcionarios.filter((f) => f.id !== data.idOrig);
    const funcionariosFinais = [...semAtual, data];

    await apiService.query("PATCH", `/establishment/${barbearia.id}`, {
      funcionarios: funcionariosFinais.map((item) => ({
        userId: item.id,
        servicesId: item.servicosPrestados.map((service) => service.id),
      })),
    });

    await buscarDados();
    onClose();
    setData({
      nome: "",
      telefone: "",
      servicosPrestados: [],
    });
    alertCustom(
      data.id
        ? "Funcionário adicionado com sucesso!"
        : "Funcionário atualizado com sucesso!"
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setData({
          nome: "",
          telefone: "",
          servicosPrestados: [],
        });
      }}
      titulo={titulo}
      onAction={handleSave}
      actionText={actionText}
      onSubmit={onSubmit}
      submitText={submitText}
      fullScreen="all"
      component="view"
      buttons={buttons}
    >
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SearchField
            fields={["telefone", "nome"]}
            url={`/user`}
            placeholder="Pesquise por nome ou telefone"
            setItemSelecionado={(item) => {
              if (!item) {
                return setData((prev) => ({
                  ...prev,
                  id: null,
                  nome: "",
                  telefone: "",
                  servicosPrestados: [],
                }));
              }

              setData((prev) => ({
                ...prev,
                id: item.id,
                nome: item.nome,
                telefone: item.telefone,
                foto: item.foto,
              }));
            }}
            itemSelecionado={data}
          />
        </Grid>{" "}
        <Grid size={{ xs: 12, md: 6 }}>
          {servicos && servicos.length ? (
            <>
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Selecione Serviços{" "}
              </Typography>

              <Rows
                items={servicos.map((item) => ({
                  ...item,
                  titulo: item.nome,
                  subtitulo: `R$ ${item.preco} | Duração: ${formatarHorario(
                    item.tempoGasto
                  )}`,
                }))}
                onSelect={(value) =>
                  setData({
                    ...data,
                    servicosPrestados: value,
                  })
                }
                selectedItems={data.servicosPrestados}
                multipleSelect={true}
              />
            </>
          ) : (
            <Typography
              variant="h5"
              sx={{
                width: "100%",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              Opps!
              <Typography variant="body1">
                Nenhum serviço cadastrado. Cadastre alguns antes de
                prosseguir...
              </Typography>
            </Typography>
          )}
        </Grid>{" "}
        <Grid size={12}>
          <Typography variant="body1" className="show-box">
            <Typography variant="h6">
              <Icon>💡</Icon> Aviso
            </Typography>
            Para cadastrar um novo funcionário, o mesmo precisa estar
            previamente <b>CADASTRADO</b> na plataforma com uma conta{" "}
            <b>NORMAL</b> e precisará confirmar seu convite para assumiur o
            cargo. Além disso você pode configurar a escala de trabalho:{" "}
            <WorkSchedule alertCustom={alertCustom} dados={data} />
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Funcionario;
