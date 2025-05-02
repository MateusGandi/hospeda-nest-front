import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "../../Modal";

const BetaInfoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 100,
          left: -53,
          zIndex: 1300,
          rotate: "-90deg",
        }}
      >
        <Button
          variant="text"
          color="secondary"
          size="small"
          sx={{
            p: "5px 10px",
            borderRadius: "0 0 10px 10px !important",
          }}
          onClick={() => setOpen(true)}
        >
          Versão Beta 1.0.1
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        titulo="Versão Beta"
        component="modal"
        maxWidth="xs"
        sx={{ p: 2 }}
      >
        <Typography variant="body1">
          💻 Você está utilizando uma <strong>versão beta</strong> do sistema,
          que está em fase de testes. Algumas funcionalidades podem mudar ou não
          estarem disponíveis, apresentar instabilidade ou ainda estar sendo
          aprimoradas. Seu feedback é muito importante para nós!
        </Typography>
      </Modal>
    </>
  );
};

export default BetaInfoButton;
