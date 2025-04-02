import React from "react";
import { Rows } from "../Lista/Rows";

const PaymentMethods = ({ value, onChange, itens }) => {
  return (
    <Rows
      disableGap={true}
      unSelectMode={true}
      styleSelect={{ background: "#012FE5" }}
      selectedItems={itens.find((item) => item.value === value)}
      onSelect={(e) => onChange(e)}
      items={itens}
    />
  );
};

export default PaymentMethods;
