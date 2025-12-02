import { Box, Button, Container, Typography } from "@mui/material";
import { LoadingBox } from "../Custom";
const View = ({
  titulo,
  children,
  buttons = [],
  maxWidth = "md",
  loading = false,
  sx = {},
}) => {
  if (loading) return <LoadingBox />;

  return (
    <Container maxWidth={maxWidth} sx={{ py: 2, height: "100%" }}>
      {" "}
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 60px)",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          ...sx,
        }}
      >
        {" "}
        <Box
          sx={{ p: 2, display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          {" "}
          <Typography variant="h6">{titulo}</Typography>{" "}
        </Box>{" "}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}> {children} </Box>{" "}
        {buttons.length > 0 && (
          <>
            {" "}
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                flexShrink: 0,
              }}
            >
              {" "}
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "outlined"}
                  color={button.color || "primary"}
                  disabled={button.disabled}
                  onClick={button.action}
                  sx={button.sx}
                >
                  {" "}
                  {button.titulo}{" "}
                </Button>
              ))}{" "}
            </Box>{" "}
          </>
        )}{" "}
      </Box>{" "}
    </Container>
  );
};
export default View;
