import React from "react";
import { Box, keyframes, styled } from "@mui/system";
import ImageIcon from "@mui/icons-material/Image"; // ou use uma imagem sua

const pulse = keyframes`
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const AnimatedImage = styled("div")(({ theme }) => ({
  animation: `${pulse} 1.2s ease-in-out infinite`,
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
}));

const LoadingImagePulse = ({ src, size = 60 }) => {
  return (
    <AnimatedImage>
      {src ? (
        <img
          src={src}
          alt="loading"
          width={size}
          height={size}
          style={{ borderRadius: "8px" }}
        />
      ) : (
        <ImageIcon sx={{ fontSize: size }} />
      )}
    </AnimatedImage>
  );
};

export default LoadingImagePulse;
