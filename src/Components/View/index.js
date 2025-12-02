import { Box, Button, Container, Typography } from "@mui/material";
import { LoadingBox } from "../Custom";

const View = ({
  titulo,
  children,
  buttons = [],
  maxWidth = "md",
  loading = false,
  leftAction = null,
  sx = {},
}) => {
  if (loading) return <LoadingBox />;

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        background: (theme) => theme.palette.background.paper,
        ...sx,
      }}
    >
      <Box
        sx={{
          p: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {leftAction}
          <Typography variant="h6">{titulo}</Typography>
        </Box>
      </Box>

      <Container
        maxWidth={maxWidth}
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 4,
        }}
      >
        {children}
      </Container>

      {buttons.length > 0 && (
        <Box
          sx={{
            p: 2,
            px: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            flexShrink: 0,
            background: (theme) => theme.palette.background.default,
          }}
        >
          {buttons.map((button, index) => (
            <Button
              disableElevation
              size="large"
              key={index}
              variant={button.variant || "outlined"}
              color={button.color || "primary"}
              disabled={button.disabled}
              onClick={button.action}
              sx={button.sx}
            >
              {button.titulo}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default View;
