import React from "react";
import BannerImage from "../../Assets/banner.jpeg";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function Sales() {
  return (
    <Box sx={{ p: 2, display: "flex" }}>
      <img src={BannerImage} style={{ width: "300px", borderRadius: "10px" }} />
      <Typography variant="h4" fontWeight={600} sx={{ ml: 2 }}>
        Tonsus.app
        <Typography variant="h6">
          Em linguística, a noção de texto é ampla e ainda aberta a uma
          definição mais precisa. Grosso modo, pode ser entendido como
          manifestação linguística das ideias de um autor, que serão
          interpretadas pelo leitor de acordo com seus conhecimentos
          linguísticos e culturais. Seu tamanho é variável.
        </Typography>
        <div style={{ width: "100%", textAlign: "right" }}>
          {" "}
          <Button
            variant="outlined"
            size="large"
            sx={{
              border: "1px solid #303030",
              color: "#FFFFFF",
              fontWeight: "bold",
              m: 1,
            }}
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Saiba mais
          </Button>
        </div>
      </Typography>
    </Box>
  );
}
