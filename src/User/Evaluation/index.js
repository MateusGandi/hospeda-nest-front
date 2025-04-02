import React, { useState } from "react";
import { Rating, Box, Grid2 as Grid, Typography } from "@mui/material";
import Modal from "../../Componentes/Modal";
import { CustomInput } from "../../Componentes/Custom";
import apiService from "../../Componentes/Api/axios";
import { getLocalItem } from "../../Componentes/Funcoes";

const ReviewBarbershopModal = ({ barbearia, open, onClose, alertCustom }) => {
  const [formState, setFormState] = useState({
    rating: 0,
    comment: "",
  });

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { rating, comment } = formState;

      if (!comment) {
        alertCustom("O comentário não pode estar vazio.");
        return;
      }
      if (comment.length < 10) {
        alertCustom("O comentário deve ter pelo menos 10 caracteres.");
        return;
      }
      await apiService.query("POST", "/evaluation", {
        descricao: comment,
        nota: rating,
        usuario: getLocalItem("userId"),
        estabelecimento: barbearia.id,
      });
      onClose();
      alertCustom("Avaliação enviada com sucesso!");
    } catch (error) {
      alertCustom("Erro ao enviar seu comentário, tente mais tarde...");
    }

    setFormState({ rating: 0, comment: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      titulo={`Avaliar ${barbearia.nome}`}
      onAction={handleSubmit}
      actionText="Enviar"
      maxWidth="xs"
    >
      <Grid container spacing={3} sx={{ p: 1 }}>
        <Grid item size={12} textAlign="center">
          {" "}
          <Typography variant="h6">
            Avalie seu atendimento de 1 a 5 estrelas
          </Typography>
          <Rating
            sx={{ m: 10 }}
            size="large"
            name="barbershop-rating"
            value={formState.rating}
            onChange={(event, newValue) => handleChange("rating", newValue)}
          />
        </Grid>
        <Grid item size={12}>
          {" "}
          <CustomInput
            label="Digite seu comentário"
            placeholder="O que achou do atendimento..."
            multiline
            rows={4}
            fullWidth
            value={formState.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ReviewBarbershopModal;
