import React, { useEffect, useState } from "react";
import { Avatar, Box, Grid2 as Grid, Stack, Typography } from "@mui/material";
import Icon from "../../../Assets/Emojis";
import Modal from "../../../Componentes/Modal";
import { Rows } from "../../../Componentes/Lista/Rows";
import {
  formatarHorario,
  formatPhone,
  getLocalItem,
} from "../../../Componentes/Funcoes";
import SearchField from "../../../Componentes/AutoComplete/searchAutocomplete";
import apiService from "../../../Componentes/Api/axios";
import WorkSchedule from "../Escala";

const Funcionario = ({
  funcionario,
  funcionarios,
  barbeariaId,
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
    console.log("funcionario", funcionario);
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

    await apiService.query("PATCH", `/establishment/${barbeariaId}`, {
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
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack alignItems="center" spacing={2}>
            <Avatar
              alt={(funcionario ?? data)?.nome ?? "Foto do Funcionário"}
              sx={{ width: 250, height: 250, fontSize: 100 }}
              src={(funcionario ?? data)?.imagem}
            >
              {(funcionario ?? data)?.nome[0]?.toUpperCase() ?? "T"}
            </Avatar>
            <Box sx={{ m: "0 24px", width: "100%" }}>
              {funcionario ? (
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  {data.nome}{" "}
                  <Typography variant="body1">
                    {formatPhone(data.telefone)}
                  </Typography>
                </Typography>
              ) : (
                <SearchField
                  fields={["telefone", "nome"]}
                  url={`/user/employables/XXXX/${getLocalItem("userId")}`}
                  placeholder="Pesquise por nome ou telefone..."
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
                      imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.id}/${item.foto}`,
                      foto: item.foto,
                    }));
                  }}
                  itemSelecionado={data}
                />
              )}
            </Box>
          </Stack>
        </Grid>
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
          <Typography className="show-box">
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 9 }}>
                {" "}
                {funcionario ? (
                  <Typography variant="body1">
                    {" "}
                    Você pode editar a escala do funcionário, programando dias
                    da semana, horário de almoço, e ausências previstas.
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    Seu funcionário deve criar uma conta na plataforma e
                    precisará confirmar seu convite para assumiur o cargo.
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                {" "}
                <WorkSchedule
                  type="button"
                  alertCustom={alertCustom}
                  dados={data}
                  disabled={!funcionario}
                />
              </Grid>
            </Grid>
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Funcionario;
