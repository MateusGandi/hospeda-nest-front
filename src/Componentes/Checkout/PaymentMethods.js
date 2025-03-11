import React from "react";
import { Rows } from "../Lista/Rows";
import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";

const PaymentMethods = ({ value, onChange }) => {
  const itens = [
    {
      id: 0,
      titulo: "Pix",
      subtitulo: "Pagamento com confirmação em segundos",
      value: "PIX",
      renderDetails: <div>oiii</div>,
      icon: <PixIcon />,
    },
    {
      id: 1,
      titulo: "Boleto Bancário",
      subtitulo: "Aprovação pode levar até dois dias",
      value: "BOLETO",
      icon: (
        <img
          src={BarcodeIcon}
          style={{ filter: "invert(100%)", width: "24px" }}
        />
      ),
    },
    {
      id: 2,
      titulo: "Cartão Crédito/Débito",
      subtitulo: "Pague em até 12 vezes",
      value: "CARTAO",
      icon: <CardIcon />,
    },
  ];

  return (
    <Rows
      selectedItems={itens.find((item) => item.value === value)}
      onSelect={(e) => onChange(e)}
      items={itens}
    />
  );
};

export default PaymentMethods;
