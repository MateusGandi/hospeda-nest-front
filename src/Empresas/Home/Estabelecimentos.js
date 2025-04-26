import React, { useEffect, useState } from "react";
import Api from "../../Componentes/Api/axios";
import SearchBarWithFilters from "../../Componentes/Search";
import Modal from "../../Componentes/Modal";
import { useNavigate } from "react-router-dom";
import { Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import ConeSVG from "../../Assets/cone.svg";
import { formatPhone } from "../../Componentes/Funcoes";
import GetUserLocation from "../../Componentes/Location";

const Estabelecimentos = ({ alertCustom }) => {
  const navigate = useNavigate();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [location, setLocation] = useState(null);
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
      !empresas.length && setLoading(true);
      try {
        const data = await Api.query(
          "GET",
          `/establishment/all${
            location
              ? `?location=${location && Object.values(location).join(",")}`
              : ""
          }`
        );

        const dados = formatarRows(data);
        setEmpresas(dados || []);
        setEmpresasFiltred(dados || []);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      } finally {
        !empresas.length && setLoading(false);
      }
    };
    buscarDados();
  }, [location]);

  const formatarRows = (items) => {
    return items.map((item) => ({
      ...item,
      titulo: item.nome,
      subtitulo: `${formatPhone(item.telefone)} | ${
        item.endereco.length > 20
          ? item.endereco.slice(0, 40) + "..."
          : item.endereco
      }`,
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
            aditionalFilters={
              <GetUserLocation
                setLoading={setLoadingLocation}
                loading={loadingLocation}
                alertCustom={alertCustom}
                setLocation={setLocation}
              />
            }
            aditionalFiltersFocus={!!location || loadingLocation}
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
