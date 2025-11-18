import { useState, useEffect } from "react";
import SearchField from "../../../Componentes/AutoComplete/searchAutocomplete";
import View from "../../../Componentes/View";
import { useNavigate } from "react-router-dom";
import apiService from "../../../Componentes/Api/axios";
import { formatPhone, getLocalItem } from "../../../Componentes/Funcoes";
import { Rows } from "../../../Componentes/Lista/Rows";
import { Grid2 as Grid, Typography } from "@mui/material";
import Icon from "../../../Assets/Emojis";
import Confirm from "../../../Componentes/Alert/Confirm";

export const GerenciarClientes = ({ alertCustom }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    loading: false,
    cliente: null,
  });

  const [checklist, setChecklist] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadChecklist = async () => {
    try {
      const id = getLocalItem("establishmentId");
      if (!id) return;
      setLoading(true);
      const { checklist } = await apiService.query(
        "GET",
        `/establishment/${id}/checklist`
      );
      setChecklist(checklist || []);
    } catch (error) {
      alertCustom("Erro ao carregar lista de clientes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, []);

  const handleSave = async () => {
    try {
      const id = getLocalItem("establishmentId");
      if (!id || !form.cliente) return;

      setForm((p) => ({ ...p, loading: true }));

      await apiService.query("POST", `/establishment/addChecklist/${id}`, {
        userId: form.cliente.id,
      });

      alertCustom("Cliente adicionado!", "success");
      setForm((p) => ({ ...p, loading: false, cliente: null }));
      loadChecklist();
    } catch (error) {
      setForm((p) => ({ ...p, loading: false }));
      alertCustom("Erro ao salvar", "error");
    }
  };

  const askDelete = (userId) => {
    setDeleteTarget(userId);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setConfirmLoading(true);

      const id = getLocalItem("establishmentId");

      await apiService.query(
        "DELETE",
        `/establishment/${id}/checklist/${deleteTarget}`
      );

      alertCustom("Cliente desbloqueado!", "success");
      loadChecklist();
    } catch (error) {
      alertCustom("Erro ao desbloquear cliente", "error");
    } finally {
      setConfirmLoading(false);
      setOpenConfirm(false);
      setDeleteTarget(null);
    }
  };

  return (
    <View
      open={true}
      onClose={() => navigate(-1)}
      loadingButton={form.loading}
      onAction={handleSave}
      actionText="Salvar"
      titulo="Gerenciar clientes"
      fullScreen="all"
      maxWidth="md"
      component="view"
      loading={loading}
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={12} className="show-box">
          <Typography variant="h6">
            <Icon>⚙️</Icon> Controle de Clientes
            <Typography variant="body1">
              Bloqueie clientes para que eles não possam fazer agendamentos no
              seu estabelecimento sem notificá-los.
            </Typography>
          </Typography>
        </Grid>
        <Grid size={{ xs: 0, md: 6 }}></Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SearchField
            fields={["telefone", "nome"]}
            url={`/user`}
            placeholder="Pesquise por nome ou telefone"
            setItemSelecionado={(item) =>
              setForm((p) => ({ ...p, cliente: item }))
            }
            itemSelecionado={form.cliente}
          />
        </Grid>

        <Grid size={12}>
          <Rows
            disableRipple
            oneTapMode
            avatarProps={{ backgroundColor: "#1976d2" }}
            sx={{ backgroundColor: "transparent" }}
            items={checklist.map((item) => ({
              id: item.id,
              titulo: item.nome,
              subtitulo: formatPhone(item.telefone),
              icon: item.nome.slice(0, 1).toUpperCase(),
            }))}
            onDelete={(id) => askDelete(id)}
            deleteMessage="Desbloquear cliente"
          />
        </Grid>

        <Confirm
          loading={confirmLoading}
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={confirmDelete}
          title="Desbloquear cliente"
          message="Tem certeza que deseja desbloquear este cliente?"
        />
      </Grid>
    </View>
  );
};
