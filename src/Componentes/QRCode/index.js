import React from "react";
import { QRCodeSVG } from "qrcode.react";

export const QRCodeGenerator = ({ value }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <QRCodeSVG
        value={value}
        size={280}
        fgColor="#212121"
        width={"150px"}
        height={"150px"}
      />
    </div>
  );
};
