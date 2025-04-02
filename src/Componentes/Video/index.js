import React, { useRef, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Box,
  DialogContent,
  DialogTitle,
  Grid2,
  Typography,
} from "@mui/material";
import { isMobile } from "../Funcoes"; // Função que detecta dispositivos móveis

const VideoPlayer = ({ open, onClose, videoList = [], maxWidth }) => {
  const videoRefs = useRef([]); // Ref para os vídeos
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Índice do vídeo atual
  const [playing, setPlaying] = useState(true); // Estado de reprodução do vídeo
  const [touchStartY, setTouchStartY] = useState(null);

  useEffect(() => {
    if (open) {
      playVideo(currentIndex);
    }
  }, [open, currentIndex]);

  const playVideo = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          video.currentTime = 0; // Reseta o tempo do vídeo
          video.play(); // Reproduz o vídeo atual
        } else {
          video.pause(); // Pausa todos os vídeos que não são o atual
        }
      }
    });
  };

  const togglePlay = () => {
    const video = videoRefs.current[currentIndex];
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleScroll = (event) => {
    if (!containerRef.current) return;
    const deltaY = event.deltaY;
    if (deltaY > 50 && currentIndex < videoList.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Avança para o próximo vídeo
    } else if (deltaY < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // Volta para o vídeo anterior
    }
  };

  const handleTouchStart = (event) => {
    setTouchStartY(event.touches[0].clientY);
  };

  const handleTouchEnd = (event) => {
    if (touchStartY === null) return;
    const touchEndY = event.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (diff > 50 && currentIndex < videoList.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Avança para o próximo vídeo
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // Volta para o vídeo anterior
    }

    setTouchStartY(null);
  };

  const handleNext = () => {
    if (currentIndex < videoList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: { xs: 0, md: "10px" },
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 999,
          alignItems: "start",
        }}
      >
        <Typography variant="h6">
          {videoList[currentIndex]?.title || "Vídeo"}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        ref={containerRef}
        sx={{
          position: "relative",
          width: { xs: "100%", md: "calc(100vh * 0.5)" },
          height: "100vh",
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onWheel={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {videoList.map((video, index) => (
          <video
            key={index}
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.src}
            style={{
              width: "100%",
              height: "100vh", // Mantém o tamanho do vídeo
              objectFit: "cover",
              position: "absolute",
              top: 0,
              transition: isMobile ? "transform 0.5s ease-in-out" : "none", // Efeito de transição só no celular
              transform: `translateY(${(index - currentIndex) * 100}%)`,
            }}
            onPlay={() => setPlaying(true)}
            autoPlay={index === currentIndex}
            muted={false} // Assegura que o som não estará mudo
          />
        ))}

        <Box
          onClick={togglePlay}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 888,
          }}
        />

        <IconButton
          onClick={togglePlay}
          sx={{ position: "absolute", bottom: 24, right: 24, color: "#fff" }}
        >
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        {/* Setas para navegação no PC */}
        {!isMobile && videoList.length > 1 && (
          <Grid2
            container
            spacing={2}
            sx={{
              position: "absolute",
              right: 5,
              height: "40%",
              transform: "translateX(-50%)",
              top: "30%",
              zIndex: 999,
              color: "#fff",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <IconButton onClick={handlePrev}>
              <ArrowUpwardIcon />
            </IconButton>

            <IconButton onClick={handleNext}>
              <ArrowDownwardIcon />
            </IconButton>
          </Grid2>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
