import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Api from "../../../Componentes/Api/axios";
import { Cards } from "../../../Componentes/Lista/Cards";
import { getLocalItem, isMobile, orderBy } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import View from "../../../Componentes/View";
import Modal from "../../../Componentes/Modal/Simple";

const Products = ({ alertCustom }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const establishmentId = getLocalItem("establishmentId");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await Api.query("GET", `/product/${establishmentId}`);
      const dados =
        data.map((item) => ({
          ...item,
          imagem: item.fotoPath
            ? `${process.env.REACT_APP_BACK_TONSUS}/images/product/${item.id}/${item.fotoPath}`
            : null,
        })) || [];
      setProducts(orderBy(dados || [], "id", "asc"));
    } catch (err) {
      alertCustom("Erro ao buscar produtos!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const content = (
    <>
      {products.length ? (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" className="show-box">
              <Typography variant="h6">
                <Icon>💡</Icon> Ajuda rápida
              </Typography>
              Aqui estão os produtos cadastrados
            </Typography>
          </Grid>

          <Grid size={12}>
            <Cards
              oneTapMode
              label="produto"
              keys={[
                { label: "", value: "nome" },
                {
                  label: "",
                  value: "valor",
                  format: (value) =>
                    `R$ ${(+value).toFixed(2).replace(".", ",")}`,
                },
                {
                  label: "",
                  value: "quantidade",
                  format: (value) =>
                    value > 1 ? `${value} unidades` : `${value} unidade`,
                },
              ]}
              items={products}
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
            Nenhum produto cadastrado ainda...
          </Typography>
        </Typography>
      )}
    </>
  );

  return isMobile ? (
    <Modal
      open
      titulo="Produtos"
      fullScreen="all"
      component="view"
      loading={loading}
      onClose={() => {}}
    >
      {content}
    </Modal>
  ) : (
    <View
      open
      titulo="Produtos"
      fullScreen="all"
      component="view"
      loading={loading}
      onClose={() => {}}
    >
      {content}
    </View>
  );
};

export default Products;
