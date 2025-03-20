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
        fgColor="#FFF"
        bgColor="#2A2A2A"
        width={"320px"}
        height={"320px"}
      />
    </div>
  );
};
