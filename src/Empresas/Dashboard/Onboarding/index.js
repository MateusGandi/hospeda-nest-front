import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import EmpresaForm from "./Empresa";
import FuncionarioForm from "./Funcionario";
import EscalaForm from "./Escala";

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

  const addMoreFuncionario = () => {
    const funcionarios = formData.funcionarios;
    funcionarios.push({
      id: formData.funcionarios.length,
      nome: "",
      telefone: "",
      servicosPrestados: [],
    });
    setFormData({ ...formData, funcionarios: funcionarios });
    setQtdFuncionarios(qtdFuncionarios + 1);
  };

  const selectFuncionario = ({ id }) => {
    const funcionarios = formData.funcionarios
      .filter((func) => func.id != id)
      .map((item, index) => ({ ...item, id: index }));
    setFormData({ ...formData, funcionarios: funcionarios });
    setQtdFuncionarios(qtdFuncionarios - 1);
  };
  const deleteFuncionario = (id) => {
    const funcionarios = formData.funcionarios
      .filter((func) => func.id != id)
      .map((item, index) => ({ ...item, id: index }));
    setFormData({ ...formData, funcionarios: funcionarios });
    setQtdFuncionarios(qtdFuncionarios - 1);
  };

  const paginas = {
    empresa: {
      info: "Complete com mais algumas informações do estabelecimento.",
      actionText: "Adicionar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: <EmpresaForm formData={formData} setFormData={setFormData} />,
    },
    escala: {
      info: "Informe o modelo de escala.",
      actionText: "Confirmar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: <EscalaForm formData={formData} setFormData={setFormData} />,
    },
    funcionarios: {
      info: "Deseja adicionar funcionários além de você?",
      submitText: "Adicionar mais um funcionário",
      onSubmit: () =>
        qtdFuncionarios > 5
          ? alertCustom("Você atingiu o máximo de funcionários possíveis")
          : addMoreFuncionario(),
      actionText: "Finalizar",
      required: false, // Deixar passar mesmo se não tiver todos os dados completos
      component: (
        <FuncionarioForm
          onSelect={selectFuncionario}
          onDelete={deleteFuncionario}
          index={qtdFuncionarios}
          setIndex={setQtdFuncionarios}
          formData={formData}
          setFormData={setFormData}
          servicos={["Corte", "Barba", "Coloração", "Hidratação", "Alisamento"]}
        />
      ),
    },
    final: {
      info: "Peça as funcionários que acesse pelos próprios celulares usando a senha abaixo:",
      actionText: "Fechar",
      required: true, // Não deixar passar enquanto não tiver todos os dados completos
      component: <div>Senha teste</div>,
    },
  };

  const steps = Object.keys(paginas);

  useEffect(() => {
    setEtapa((prev) => ({
      ...prev,
      next: () => handleNext(),
    }));
  }, [etapa.progresso]);

  const handleNext = () => {
    const currentIndex = steps.indexOf(etapa.progresso);

    // Verifica se o índice atual é válido e não ultrapassa os limites
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
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
        <Typography id="edit-modal-description" sx={{ marginBottom: 2 }}>
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
