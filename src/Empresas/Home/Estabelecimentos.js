import React, { useEffect, useState } from "react";
import Api from "../../Componentes/Api/axios";
import SimpleSearchNoFilters from "../../Componentes/Search/NoFilter";
import Modal from "../../Componentes/Modal/Simple";
import { useNavigate } from "react-router-dom";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { Rows } from "../../Componentes/Lista/Rows";
import ConeSVG from "../../Assets/cone.svg";
import { formatPhone } from "../../Componentes/Funcoes";
import LocationModalAuto from "../../Componentes/Location/User";
import { LoadingBox } from "../../Componentes/Custom";

const Estabelecimentos = ({ alertCustom }) => {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState([]);
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
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        if (loading) return;

        if (!searchValue && !filters.length) setLoading(true);

        let query = [];

        if (location)
          query.push(
            `location=${location && Object.values(location).join(",")}`
          );

        if (filters.length) {
          filters.forEach(({ key, value }) => query.push(`${key}=${value}`));
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
        const formattedRows = dados.map((item) => ({
          ...item,
          bagde: item.aberto,
          disabled: !item.aberto,
          sx: !item.aberto && { opacity: 0.5 },
        }));
        setEmpresas(formattedRows);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      } finally {
        setLoading(false);
      }
    };
    buscarDados();
  }, [location, searchValue, filters]);

  const getDistance = ({ distancia, metrica }) => {
    if (!distancia || distancia == 99999) return "";

    return `${distancia} ${metrica} |`;
  };

  const formatarRows = (items) => {
    return items.map((item) => ({
      ...item,
      // disabled: !item.aberto,
      // sx: { backgroundColor: !item.aberto ? "#363636" : "transparent" },
      titulo: item.nome,
      subtitulo: `${getDistance(item)}${formatPhone(item.telefone)} | ${
        item.endereco.length > 20
          ? item.endereco.slice(0, 40) + "..."
          : item.endereco
      }`,
      imagem: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/profile/${item.profile}`,
      profile: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/profile/${item.profile}`,
      banner: `${process.env.REACT_APP_BACK_TONSUS}/images/establishment/${item.id}/banner/${item.banner}`,
    }));
  };

  const handleChange = (type, value) => {
    if (type === "search") {
      setSearchValue(value);
    }
    if (type === "filter") {
      setFilters(value);
    }
  };

  return (
    <>
      <Modal
        open={dados.open}
        backAction={dados.back}
        onClose={dados.onClose}
        fullScreen="all"
        component="view"
      >
        {" "}
        <LocationModalAuto
          extLoading={loading}
          location={location}
          alertCustom={alertCustom}
          setLocation={setLocation}
        />
        <Grid
          container
          sx={{ display: "flex", justifyContent: "center", mt: -2 }}
        >
          <Grid size={{ xs: 12, md: 8 }}>
            <SimpleSearchNoFilters
              label="Buscar estabelecimentos..."
              propFilters={[
                { key: "open", label: "Abertos agora", value: true },
                {
                  key: "distance",
                  label: "Mais próximas",
                  value: 25,
                },
              ]}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} sx={{ mt: 1 }}>
            {empresas && empresas.length ? (
              <Rows
                oneTapMode
                checkmode={false}
                items={empresas}
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
            ) : loading ? (
              <LoadingBox
                sx={{ mt: "25%" }}
                message="Carregando barbearias..."
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
                <div style={{ width: "100%" }}>
                  Nenhum resultado encontrado!
                </div>
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
        </Grid>{" "}
      </Modal>
    </>
  );
};

export default Estabelecimentos;
