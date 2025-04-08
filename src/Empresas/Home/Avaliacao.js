import React from "react";
import ReviewBarbershopModal from "../../User/Evaluation";
import { useNavigate, useParams } from "react-router-dom";

const Reviews = ({ alertCustom }) => {
  const { barbeariaId } = useParams();
  const navigate = useNavigate();

  return (
    <ReviewBarbershopModal
      fullScreen={true}
      barbearia={{ barbeariaId: barbeariaId, nome: "" }}
      open={true}
      onClose={() => navigate(-1)}
      alertCustom={alertCustom}
    />
  );
};
export default Reviews;
