import React, { useEffect, useState } from "react";
import Api from "../../Componentes/Api/axios";
import SearchBarWithFilters from "../../Componentes/Search";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import ConeSVG from "../../Assets/cone.svg";
import { formatPhone } from "../../Componentes/Funcoes";
import GetUserLocation from "../../Componentes/Location/Button";

const Estabelecimentos = ({ alertCustom }) => {
  const navigate = useNavigate();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [location, setLocation] = useState(null);
  const [empresasFiltred, setEmpresasFiltred] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState({ size: 10, page: 1 });
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
      try {
        let query = [];
        if (location) {
          query.push(
            `location=${location && Object.values(location).join(",")}`
          );
        }
        if (searchValue) {
          query.push(`establishment=${searchValue}`);
        }
        if (page) {
          query.push(`page=${page.page}`);
          query.push(`pageSize=${page.size}`);
        }

        const data = await Api.query(
          "GET",
          `/establishment/all${query.length ? "?" + query.join("&") : ""}`
        );

        const dados = formatarRows(data);
        setEmpresas(dados || []);
        setEmpresasFiltred(
          dados.map((item) => ({
            ...item,
            disabled: !item.aberto,
            sx: !item.aberto && { opacity: 0.5 },
          })) || []
        );
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };
    buscarDados();
  }, [location, searchValue]);

  const formatarRows = (items) => {
    return items.map((item) => ({
      ...item,
      // disabled: !item.aberto,
      // sx: { backgroundColor: !item.aberto ? "#363636" : "transparent" },
      titulo: item.nome,
      subtitulo: `${
        item.distancia && item.distancia != 99999
          ? item.distancia?.toFixed(0) + " km | "
          : ""
      }${formatPhone(item.telefone)} | ${
        item.endereco.length > 20
          ? item.endereco.slice(0, 40) + "..."
          : item.endereco
      }`,
      imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/profile/${item.profile}`,
      profile: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/profile/${item.profile}`,
      banner: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/banner/${item.banner}`,
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
            fullWidth={false}
          >
            <GetUserLocation
              setLoading={setLoadingLocation}
              loading={loadingLocation}
              alertCustom={alertCustom}
              setLocation={setLocation}
            />
          </SearchBarWithFilters>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
          {empresasFiltred && empresasFiltred.length ? (
            <Rows
              oneTapMode
              checkmode={false}
              items={empresasFiltred}
              multipleSelect={dados.multipleSelect}
              onSelect={dados.onSelect}
              sx={{ backgroundColor: "transparent" }}
              avatarProps={{
                width: 70,
                height: 70,
                backgroundColor: "#212121",
                borderRadius: "10px",
              }}
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
          {empresas.length > page.size && (
            <Typography sx={{ textAlign: "center", m: 1 }}>
              <Button
                disableElevation
                variant="text"
                color="secondary"
                onClick={() =>
                  setPage((prev) => ({ ...prev, page: prev.size + 10 }))
                }
              >
                Ver mais
              </Button>
            </Typography>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Estabelecimentos;
