import React, { useState } from "react";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../../Componentes/Modal";
import { QRCodeGenerator } from "../../../Componentes/QRCode";
import { Rows } from "../../../Componentes/Lista/Rows";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import imagemTeste from "../../../Assets/undraw_barber_utly.svg";
import Icon from "../../../Assets/Emojis";
const GestorSessoesWhatsApp = () => {
  const [sessoes, setSessoes] = useState([
    {
      id: "1",
      name: "TESTE1",
      titulo: "Sessão 1",
      subtitulo: "Ativo desde 12/02/2024",
    },
    {
      id: "2",
      name: "TESTE2",
      titulo: "Sessão 2",
      subtitulo: "Ativo desde 15/02/2024",
    },
  ]);

  const [modalSessoes, setModalSessoes] = useState(false);
  const [modalQr, setModalQr] = useState({ open: false, qrData: "" });

  const handleDeleteSession = (id) => {
    setSessoes((prev) => prev.filter((sessao) => sessao.id !== id));
  };

  const handleGenerateNewSession = async () => {
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
        titulo="WhatsApp"
        maxWidth="lg"
        fullScreen="all"
        component="view"
        buttons={[
          {
            titulo: "Gerar uma nova sessão",
            action: handleGenerateNewSession,
            color: "success",
            variant: "contained",
          },
        ]}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            {" "}
            <Typography variant="h6">Sessões Ativas</Typography>
          </Grid>
          <Grid size={12}>
            {" "}
            <Typography variant="h6" className="show-box">
              <Icon>📌</Icon>Atenção
              <Typography variant="body1">
                Ao usar a ferramenta de WhatsApp você concorda com os termos e
                condições previstos e concorda em ceder informações sobre seus
                contatos para fins de personalização e atendimento, além dos
                demais subitens dispostos no regulamento completo.
              </Typography>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Rows
              oneTapMode={true}
              items={sessoes.map((sessao, index) => ({
                ...sessao,
                icon: sessao.icon || <WhatsAppIcon color="success" />,
              }))}
              onDelete={handleDeleteSession}
            />
          </Grid>{" "}
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "center" }}>
            <img
              src={imagemTeste}
              style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}
            />
          </Grid>
        </Grid>
      </Modal>

      {/* Modal do QR Code */}
      <Modal
        onClose={() => setModalQr({ open: false, qrData: "" })}
        open={modalQr.open}
        titulo="Escaneie o QR Code"
        fullScreen="mobile"
        maxWidth="xs"
      >
        <Grid container spacing={3}>
          <Grid size={12}>
            {" "}
            {modalQr.qrData && <QRCodeGenerator data={modalQr.qrData} />}
          </Grid>
          <Grid size={12}>
            {" "}
            <Typography variant="h6" className="show-box">
              Utilidade
              <Typography variant="body1">
                Use o scan do próprio WhatsApp para usar as automatizações para
                WhatsApp Web.
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default GestorSessoesWhatsApp;
