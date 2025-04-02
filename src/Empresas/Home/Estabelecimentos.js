import React, { useEffect, useState } from "react";
import Api from "../../Componentes/Api/axios";
import SearchBarWithFilters from "../../Componentes/Search";
import Modal from "../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import ConeSVG from "../../Assets/cone.svg";

const Estabelecimentos = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [empresasFiltred, setEmpresasFiltred] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dados, setDados] = useState({ open: true });

  useEffect(() => {
    setDados({
      open: true,
      onClose: () => navigate("/home"),
      onSelect: (barbearia) => navigate(`/barbearia/${barbearia.path}`),
      back: {
        action: () => navigate("/home"),
        titulo: "Voltar",
      },
    });
  }, [empresas]);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        const data = await Api.query("GET", "/establishment/all");

        const dados = formatarRows(data);
        setEmpresas(dados || []);
        setEmpresasFiltred(dados || []);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      } finally {
        setLoading(false);
      }
    };
    buscarDados();
  }, []);

  const formatarRows = (items) => {
    return items.map((item) => ({
      ...item,
      titulo: item.nome,
      subtitulo: `${item.endereco} ${item.telefone}`,
      imagem: `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${item.id}/profile/${item.profile}`,
      profile: `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${item.id}/profile/${item.profile}`,
      banner: `https://srv744360.hstgr.cloud/tonsus/api/images/establishment/${item.id}/banner/${item.banner}`,
    }));
  };

  return (
    <Modal
      loading={loading}
      open={dados.open}
      backAction={dados.back}
      onClose={dados.onClose}
      titulo={"Selecione uma barbearia próxima a você"}
      fullScreen="all"
      component="view"
    >
      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SearchBarWithFilters
            initial={empresas}
            elements={empresasFiltred}
            setElements={setEmpresasFiltred}
            label="Barbearias"
            propFilters={["nome"]}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
          {empresasFiltred && empresasFiltred.length ? (
            <Rows
              items={empresasFiltred}
              multipleSelect={dados.multipleSelect}
              onSelect={dados.onSelect}
            />
          ) : (
            <Typography
              variant="subtitle"
              sx={{
                m: 2,
                mt: 10,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <img
                src={ConeSVG}
                style={{
                  height: "100px",
                  filter: "grayscale(100%)",
                  opacity: "0.4",
                }}
              />
              <div style={{ width: "100%" }}>Nenhum resultado encontrado!</div>
            </Typography>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Estabelecimentos;
