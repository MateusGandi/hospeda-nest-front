import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import Api from "../../../Componentes/Api/axios";
import Confirm from "../../../Componentes/Alert/Confirm";
import { Cards } from "../../../Componentes/Lista/Cards";
import ProductForm from "./ProductForm";
import { getLocalItem, isMobile } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import View from "../../../Componentes/View";

const Products = ({ alertCustom, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [productModal, setProductModal] = useState({
    open: false,
    titulo: "Adicionar novo produto",
    actionText: "Adicionar",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    item: null,
  });

  const [formData, setFormData] = useState({
    id: null,
    nome: "",
    descricao: "",
    valor: "",
    quantidade: 0,
    quantidadeMinima: 0,
    fotoPath: "",
    categoria: "",
    marca: "",
    codigoBarras: "",
    ativo: true,
    disponivel: true,
  });

  const establishmentId = getLocalItem("establishmentId");

  const handlePhotoUpload = async (e, productId) => {
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
          const endpoint = `/images/product/${productId}`;
          await Api.query("POST", endpoint, formData);
          alertCustom("Foto adicionada com sucesso!");
          fetchProducts();
        } catch (uploadError) {
          alertCustom("Erro ao adicionar foto!");
          console.error("Erro ao fazer upload da imagem:", uploadError);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    } finally {
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await Api.query("GET", `/product/${establishmentId}`);
      setProducts(
        data.map((item) => ({
          ...item,
          imagem: item.fotoPath
            ? `${process.env.REACT_APP_BACK_TONSUS}/images/product/${item.id}/${item.fotoPath}`
            : null,
        })) || []
      );
    } catch (err) {
      alertCustom("Erro ao buscar produtos!");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para adicionar
  const handleAdd = () => {
    setFormData({
      id: null,
      nome: "",
      descricao: "",
      valor: "",
      quantidade: 0,
      quantidadeMinima: 0,
      fotoPath: "",
      categoria: "",
      marca: "",
      codigoBarras: "",
      ativo: true,
      disponivel: true,
    });
    setProductModal({
      open: true,
      titulo: "Adicionar novo produto",
      actionText: "Adicionar",
    });
  };

  // Abrir modal para editar
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nome: item.nome || "",
      descricao: item.descricao || "",
      valor: item.valor || "",
      quantidade: item.quantidade || 0,
      quantidadeMinima: item.quantidadeMinima || 0,
      fotoPath: item.fotoPath || "",
      categoria: item.categoria || "",
      marca: item.marca || "",
      codigoBarras: item.codigoBarras || "",
      ativo: item.ativo ?? true,
      disponivel: item.disponivel ?? true,
    });

    setProductModal({
      open: true,
      titulo: `Editar ${item.nome}`,
      actionText: "Salvar",
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { valor, id, ...rest } = formData;
      if (formData.id) {
        await Api.query("PUT", `/product/${id}`, {
          valor: +valor,
          ...rest,
        });
        alertCustom("Produto atualizado com sucesso!");
      } else {
        await Api.query("POST", "/product", {
          ...rest,
          valor: +valor,
          estabelecimentoId: String(establishmentId),
        });
        alertCustom("Produto adicionado com sucesso!");
      }
      setProductModal((prev) => ({ ...prev, open: false }));
      fetchProducts();
    } catch (error) {
      alertCustom("Erro ao salvar produto!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      await Api.query("DELETE", `/product/${item.id}`);
      alertCustom("Produto excluído com sucesso!");
      setConfirmDelete({ open: false, item: null });
      setProductModal((prev) => ({ ...prev, open: false }));
      fetchProducts();
    } catch (error) {
      alertCustom("Erro ao excluir produto!");
    }
  };

  const handleChange = (name, value) => {
    console.log("teste", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {isMobile ? (
        <Modal
          open={true}
          onClose={onClose}
          titulo="Gerenciar produtos"
          onAction={handleAdd}
          actionText="Novo Produto"
          fullScreen="all"
          component="view"
          loading={loading}
        >
          {products && products.length ? (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" className="show-box">
                  {" "}
                  <Typography variant="h6">
                    <Icon>💡</Icon> Ajuda rápida
                  </Typography>
                  Clique em um <b>PRODUTO</b> para editar ou excluir
                </Typography>
              </Grid>
              <Grid size={12}>
                <Cards
                  onUpload={handlePhotoUpload}
                  oneTapMode={false}
                  onEdit={handleEdit}
                  onDelete={(id) =>
                    setConfirmDelete({
                      open: true,
                      item: products.find((p) => p.id === id),
                    })
                  }
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
                  items={products || []}
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
        </Modal>
      ) : (
        <View
          open={true}
          onClose={onClose}
          titulo="Gerenciar produtos"
          onAction={handleAdd}
          actionText="Novo Produto"
          fullScreen="all"
          component="view"
          loading={loading}
        >
          {products && products.length ? (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" className="show-box">
                  {" "}
                  <Typography variant="h6">
                    <Icon>💡</Icon> Ajuda rápida
                  </Typography>
                  Clique em um <b>PRODUTO</b> para editar ou excluir
                </Typography>
              </Grid>
              <Grid size={12}>
                <Cards
                  onUpload={handlePhotoUpload}
                  oneTapMode={false}
                  onEdit={handleEdit}
                  onDelete={(id) =>
                    setConfirmDelete({
                      open: true,
                      item: products.find((p) => p.id === id),
                    })
                  }
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
                  items={products || []}
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
        </View>
      )}{" "}
      <Modal
        open={productModal.open}
        onClose={() => setProductModal((prev) => ({ ...prev, open: false }))}
        titulo={productModal.titulo}
        actionText={productModal.actionText}
        onAction={handleSave}
        loadingButton={isSaving}
        fullScreen="all"
        component="view"
        maxWidth="md"
        buttons={[
          ...(formData.id
            ? [
                {
                  titulo: "Deletar Produto",
                  variant: "outlined",
                  color: "terciary",
                  action: () =>
                    setConfirmDelete({
                      open: true,
                      item: formData,
                    }),
                },
              ]
            : []),
          {
            titulo: "Cancelar Edição",
            variant: "outlined",
            color: "terciary",
            action: () => setProductModal((prev) => ({ ...prev, open: false })),
          },
        ]}
      >
        <ProductForm form={formData} onChange={handleChange} />
      </Modal>
      <Confirm
        open={confirmDelete.open}
        onClose={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
        onConfirm={() => handleDelete(confirmDelete.item)}
        title="Confirmar Exclusão"
        message={`Deseja excluir o produto ${confirmDelete.item?.nome}?`}
      />
    </>
  );
};

export default Products;
