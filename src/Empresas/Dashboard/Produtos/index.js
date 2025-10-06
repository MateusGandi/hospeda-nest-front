import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal/Simple";
import Api from "../../../Componentes/Api/axios";
import Confirm from "../../../Componentes/Alert/Confirm";
import { Cards } from "../../../Componentes/Lista/Cards";
import ProductForm from "./ProductForm";
import { getLocalItem, isMobile, orderBy } from "../../../Componentes/Funcoes";
import Icon from "../../../Assets/Emojis";
import View from "../../../Componentes/View";
import { useNavigate, useParams } from "react-router-dom";

const Products = ({ alertCustom }) => {
  const { subPath } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState({
    loading: false,
    open: false,
    item: null,
  });

  const [productModal, setProductModal] = useState({
    open: false,
    titulo: "Adicionar novo produto",
    actionText: "Adicionar",
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

  const handlePhotoUpload = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExtension = file.type.split("/")[1];
      const newName = `${file.name.split(".")[0]}.${fileExtension}`;
      const renamedFile = new File([file], newName, { type: file.type });

      const formData = new FormData();
      formData.append("fotos", renamedFile);

      await Api.query("POST", `/images/product/${productId}`, formData);
      alertCustom("Foto adicionada com sucesso!");
      fetchProducts();
    } catch (error) {
      alertCustom("Erro ao adicionar foto!");
    }
  };

  const handleAdd = () => navigate("/dashboard/produtos/novo");

  const handleEdit = (item) => navigate(`/dashboard/produtos/${item.id}`);

  const handleCloseModal = () => {
    setProductModal((prev) => ({ ...prev, open: false }));
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { valor, id, ...rest } = formData;

      if (id) {
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

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      alertCustom("Erro ao salvar produto!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      setConfirmDelete((prev) => ({ ...prev, loading: true }));
      await Api.query("DELETE", `/product/${item.id}`);
      alertCustom("Produto excluído com sucesso!");
      setConfirmDelete({ open: false, item: null });
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      alertCustom("Erro ao excluir produto!");
    } finally {
      setConfirmDelete((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    fetchProducts();
  }, []);

  // Abre o modal correto conforme a rota
  useEffect(() => {
    if (subPath === "novo") {
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
      return;
    }

    const item = products.find((p) => p.id == subPath);
    if (item) {
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
    } else {
      setProductModal({
        open: false,
        titulo: "Adicionar novo produto",
        actionText: "Adicionar",
      });
    }
  }, [subPath, products]);

  return (
    <>
      {isMobile ? (
        <Modal
          open={true}
          onClose={handleCloseModal}
          titulo="Gerenciar produtos"
          onAction={handleAdd}
          actionText="Novo Produto"
          fullScreen="all"
          component="view"
          loading={loading}
        >
          {products.length ? (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" className="show-box">
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
        </Modal>
      ) : (
        <View
          open={true}
          onClose={handleCloseModal}
          titulo="Gerenciar produtos"
          onAction={handleAdd}
          actionText="Novo Produto"
          fullScreen="all"
          component="view"
          loading={loading}
        >
          {products.length ? (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" className="show-box">
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
        </View>
      )}

      {/* Modal do formulário de produto */}
      <Modal
        open={productModal.open}
        onClose={handleCloseModal}
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
                    setConfirmDelete({ open: true, item: formData }),
                },
                {
                  titulo: "Cancelar Edição",
                  variant: "outlined",
                  color: "terciary",
                  action: handleCloseModal,
                },
              ]
            : []),
        ]}
      >
        <ProductForm form={formData} onChange={handleChange} />
      </Modal>

      {/* Confirmação de exclusão */}
      <Confirm
        loading={confirmDelete.loading}
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
