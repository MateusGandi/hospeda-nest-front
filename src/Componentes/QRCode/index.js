import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Box } from "@mui/material";

export const QRCodeGenerator = ({ value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        background: "#fff",
        justifyContent: "center",
        borderRadius: "10px",
        width: "300px",
        p: "10px",
      }}
    >
      <QRCodeSVG
        value={value}
        fgColor="#212121"
        bgColor="#fff"
        width={"300px"}
        height={"300px"}
      />
    </Box>
  );
};
