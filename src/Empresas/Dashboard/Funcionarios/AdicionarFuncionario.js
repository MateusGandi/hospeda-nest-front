import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import Icon from "../../../Assets/Emojis";
import Modal from "../../../Componentes/Modal/Simple";
import { Rows } from "../../../Componentes/Lista/Rows";
import {
  formatarHorario,
  formatPhone,
  getLocalItem,
  primeiraMaiuscula,
} from "../../../Componentes/Funcoes";
import SearchField from "../../../Componentes/AutoComplete/searchAutocomplete";
import apiService from "../../../Componentes/Api/axios";
import WorkSchedule from "../Escala";
import { useNavigate } from "react-router-dom";

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
  reload,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    nome: "",
    telefone: "",
    servicosPrestados: [],
  });

  useEffect(() => {
    if (funcionario) {
      setData({
        ...funcionario,
        idOrig: funcionario.id,
        title: `${funcionario.nome} - ${funcionario.telefone}`,
      });
    } else {
      setData({
        nome: "",
        telefone: "",
        servicosPrestados: [],
      });
    }
  }, [funcionario]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const semAtual = funcionarios.filter((f) => f.id !== data.idOrig);

      if (!data.id) {
        throw new Error("Selecione um funcionário!");
      }

      const funcionariosFinais = [...semAtual, data];
      await apiService.query("PATCH", `/establishment/${barbeariaId}`, {
        funcionarios: funcionariosFinais.map((item) => ({
          userId: item.id,
          servicesId: item.servicosPrestados.map((service) => service.id),
        })),
      });
      if (data.id == getLocalItem("userId")) {
        localStorage.setItem("funcionario", true);
        reload && reload();
      }

      await buscarDados();
      onClose();
    } catch (error) {
      alertCustom(error.message || "Erro ao salvar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        loadingButton={loading}
        titulo={titulo}
        onAction={handleSave}
        actionText={actionText}
        onSubmit={onSubmit}
        submitText={submitText}
        fullScreen="all"
        component="view"
        buttons={(buttons || []).map((btn) => ({
          ...btn,
          disabled: btn.disabled || loading,
        }))}
        maxWidth="md"
      >
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar
                alt={data.nome || "Foto do Funcionário"}
                sx={{
                  width: 225,
                  height: 225,
                  color: "#fff",
                  background: "#0195F7",
                  fontSize: funcionario && data.id ? 100 : 50,
                }}
                src={data.imagem}
              >
                {funcionario && data.id
                  ? primeiraMaiuscula(data.nome[0])
                  : "Tonsus"}
              </Avatar>
              <Box sx={{ m: "0 24px", width: "100%" }}>
                {data.id && funcionario ? (
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    {data.nome}
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
                          idOrig: null,
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
                        imagem:
                          `${process.env.REACT_APP_BACK_TONSUS}/images/user/${item.id}/${item.foto}` ||
                          null,
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
                    titulo: `R$ ${item.preco} ${item.nome}`,
                    subtitulo: `Duração: ${formatarHorario(item.tempoGasto)}`,
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
                <Typography sx={{ width: "100%" }} className="justify-center">
                  <Button
                    sx={{ px: 2, mt: 2 }}
                    onClick={() => navigate("/dashboard/servicos")}
                  >
                    Cadastrar
                  </Button>
                </Typography>
              </Typography>
            )}
          </Grid>{" "}
          <Grid size={12}>
            <Typography className="show-box">
              <Grid
                container
                spacing={2}
                className="justify-between"
                sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
              >
                {funcionario ? (
                  <>
                    <Typography variant="body1">
                      {" "}
                      Edite a escala para expediente, horário de almoço e
                      preferências gerais
                    </Typography>{" "}
                    <WorkSchedule
                      reload={reload}
                      type="button"
                      alertCustom={alertCustom}
                      dados={data}
                      disabled={!funcionario}
                    />
                  </>
                ) : (
                  <Typography variant="body1">
                    Seu funcionário deve criar uma conta na plataforma e
                    precisará confirmar seu convite para assumiur o cargo.
                  </Typography>
                )}{" "}
              </Grid>
            </Typography>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default Funcionario;
