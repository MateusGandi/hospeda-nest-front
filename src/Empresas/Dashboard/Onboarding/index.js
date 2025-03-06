import React, { useEffect, useState } from "react";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import EmpresaForm from "./Empresa";
import EscalaForm from "./Escala";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Onboarding = ({ etapa, setEtapa, alertCustom }) => {
  const [qtdFuncionarios, setQtdFuncionarios] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    funcionarios: [
      {
        id: 1,
        nome: "",
        telefone: "",
        servicosPrestados: [],
      },
    ],
    // funcionariosTemp: [

    // ],
    endereco: "",
    aberto: false,
    telefone: "",
    permitirAgendamentos: null,
    escala: null,
    quantidadeVagas: null,
    tempoMedio: null,
  });

  const paginas = {
    empresa: {
      info: "Complete com mais algumas informações do estabelecimento.",
      actionText: "Adicionar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: <EmpresaForm formData={formData} setFormData={setFormData} />,
    },
    escala: {
      info: "Você pode escolher o período em que podemos deixar sua agenda disponível",
      actionText: "Confirmar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: <EscalaForm formData={formData} setFormData={setFormData} />,
    },

    final: {
      info: "Agora é com você!",
      actionText: "Fechar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: (
        <Box className="show-box">
          <Typography variant="h6">
            🛠️ Adicione serviços
            <Typography variant="body1" color="GrayText">
              Adicione seus próprios serviços!
            </Typography>
          </Typography>
          <Typography variant="h6" sx={{ m: "10px 0" }}>
            🤝 Adicione funcionários{" "}
            <Typography variant="body1" color="GrayText">
              Pessoas que trabalham junto a você terão, por meio dos seus
              próprios celulares, uma conta, agenda e rotina próprias!
            </Typography>
          </Typography>
          <Typography variant="h6" sx={{ m: "10px 0" }}>
            <WhatsAppIcon
              sx={{
                mb: -0.6,
                bgcolor: "#25D366",
                p: 0.5,
                borderRadius: "50px",
                width: "25px",
                height: "25px",
              }}
            />{" "}
            Configure seu robô de WhatsApp{" "}
            <Typography variant="body1" color="GrayText">
              Deixe tudo no automático, você pode automatizar seus atendimentos
              direcionando seus contatos para o nosso Bot!
            </Typography>
          </Typography>
          <Typography variant="h6">
            ✨ Customize{" "}
            <Typography variant="body1" color="GrayText">
              Adicione à sua barbearia um banner e foto de perfil!
            </Typography>
          </Typography>
        </Box>
      ),
    },
  };

  const steps = Object.keys(paginas);

  useEffect(() => {
    setEtapa((prev) => ({
      ...prev,
      next: () => handleNext(),
      back: () => handleBack(),
    }));
  }, [etapa.progresso]);

  const handleBack = () => {
    const currentIndex = steps.indexOf(etapa.progresso);
    console.log("currentIndex", currentIndex);
    // Verifica se o índice atual é válido e não ultrapassa os limites
    if (currentIndex >= 0) {
      const nextStep = steps[currentIndex - 1];

      if (!nextStep) return;
      setEtapa({
        ...etapa,
        submitText: paginas[nextStep].submitText,
        onSubmit: paginas[nextStep].onSubmit,
        progresso: nextStep,
        progressoAnterior: etapa.progresso,
        actionText: paginas[nextStep].actionText,
      });
    } else {
      console.log("Nenhuma próxima etapa disponível.");
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(etapa.progresso);

    // Verifica se o índice atual é válido e não ultrapassa os limites
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (!nextStep) return;

      setEtapa({
        ...etapa,
        submitText: paginas[nextStep].submitText,
        onSubmit: paginas[nextStep].onSubmit,
        progresso: nextStep,
        progressoAnterior: etapa.progresso,
        actionText: paginas[nextStep].actionText,
      });
    } else {
      console.log("Nenhuma próxima etapa disponível.");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography
          id="edit-modal-description"
          color="GrayText"
          textAlign="center"
          variant="h6"
          sx={{ mb: "30px" }}
        >
          {paginas[etapa.progresso]?.info || "Carregando..."}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        {paginas[etapa.progresso]?.component || null}
      </Grid>
    </Grid>
  );
};

export default Onboarding;
