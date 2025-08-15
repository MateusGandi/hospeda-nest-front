import React from "react";
import { Rows } from "../../../Componentes/Lista/Rows";

import PixPayment from "../Forms/Pix";
import CardPayment from "../Forms/Cartao";
import BoletoPayment from "../Forms/Boleto";

import PixIcon from "@mui/icons-material/Pix";
import BarcodeIcon from "../../../Assets/barcode.png";
import CardIcon from "@mui/icons-material/CreditCard";

const PaymentMethods = ({ selected, onChange, form, setForm }) => {
  const items = [
    {
      id: 0,
      titulo: "Pix",
      value: "PIX",
      component: <PixPayment form={form} setForm={setForm} />,
      icon: <PixIcon />,
    },
    {
      id: 1,
      titulo: "Boleto",
      value: "BOLETO",
      component: <BoletoPayment form={form} setForm={setForm} />,
      icon: (
        <img
          src={BarcodeIcon}
          style={{ filter: "invert(100%)", width: "24px" }}
        />
      ),
    },
    {
      id: 2,
      titulo: "Cartão",
      value: "CARTAO",
      component: <CardPayment form={form} setForm={setForm} />,
      icon: <CardIcon />,
    },
  ];

  return (
    <Rows
      checkmode={false}
      unSelectMode={true}
      styleSelect={{ background: "#0195F7" }}
      selectedItems={items.find((item) => item.id == selected?.id)}
      onSelect={(e) => onChange(e)}
      items={items}
    />
  );
};

export default PaymentMethods;
