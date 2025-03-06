import React, { useState } from "react";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { QRCodeGenerator } from "../../../Componentes/QRCode";
import { Rows } from "../../../Componentes/Lista/Rows";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const GestorSessoesWhatsApp = () => {
  const [sessoes, setSessoes] = useState([
    { id: "1", titulo: "Sessão 1", subtitulo: "Ativo desde 12/02/2024" },
    { id: "2", titulo: "Sessão 2", subtitulo: "Ativo desde 15/02/2024" },
    {
      id: -1,
      titulo: "Gerar uma nova sessão",
      subtitulo:
        "Crie uma nova instância de WhatsApp para atender seus clientes",
      icon: <AddCircleIcon />,
      noDelete: true,
    },
  ]);

  const [modalSessoes, setModalSessoes] = useState(false);
  const [modalQr, setModalQr] = useState({ open: false, qrData: "" });

  const excluirSessao = (id) => {
    setSessoes((prev) => prev.filter((sessao) => sessao.id !== id));
  };

  const gerarNovaSessao = () => {
    const novaSessao = `whatsapp-session-${Date.now()}`;
    setModalQr({ open: true, qrData: novaSessao });
  };

  return (
    <>
      <Button
        variant="outlined"
        color="success"
        startIcon={<WhatsAppIcon />}
        onClick={() => setModalSessoes(true)}
        sx={{ border: "1px solid rgba(256, 256, 256, 0.2)" }}
        fullWidth
      >
        Configurar WhatsApp
      </Button>

      {/* Modal de Gerenciamento de Sessões */}
      <Modal
        onClose={() => setModalSessoes(false)}
        open={modalSessoes}
        titulo="Sessões Ativas"
        maxWidth="lg"
        fullScreen="all"
        component="view"
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Rows
              oneTapMode={true}
              items={sessoes.map((sessao, index) => ({
                ...sessao,
                icon: sessao.icon || <WhatsAppIcon color="success" />,
                onClick: sessao.id === -1 ? gerarNovaSessao : undefined,
              }))}
              onDelete={excluirSessao}
            />
          </Grid>
        </Grid>
      </Modal>

      {/* Modal do QR Code */}
      <Modal
        onClose={() => setModalQr({ open: false, qrData: "" })}
        open={modalQr.open}
        titulo="Escaneie o QR Code"
        backAction={{
          action: () => setModalQr({ open: false, qrData: "" }),
          titulo: "Fechar",
        }}
        fullScreen="mobile"
        maxWidth="xs"
      >
        {modalQr.qrData && <QRCodeGenerator data={modalQr.qrData} />}
      </Modal>
    </>
  );
};

export default GestorSessoesWhatsApp;
