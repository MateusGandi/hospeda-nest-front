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
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { isMobile } from "../Funcoes";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const VideoPlayer = ({
  open,
  setOpen,
  onClose,
  videoList = [],
  maxWidth,
  url,
}) => {
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [touchStartY, setTouchStartY] = useState(null);
  const navigate = useNavigate();
  const { subPath } = useParams();

  const isYouTube = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const sendYouTubeCommand = (iframe, command) => {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
          args: [],
        }),
        "*"
      );
    }
  };

  useEffect(() => {
    if (subPath && videoList.length > 0) {
      const index = videoList.findIndex((video) => video.id === subPath);

      if (index !== -1) {
        setCurrentIndex(index);
        setOpen(true);
      }
    }
  }, [subPath, videoList]);

  useEffect(() => {
    if (open) {
      navigate(`/${url}/${videoList[currentIndex]?.id}`);
      playVideo(currentIndex);
    }
  }, [currentIndex, open]);

  useEffect(() => {
    if (open && !subPath) {
      setOpen(false);
    }
  }, [subPath]);

  const playVideo = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          if (video.tagName === "VIDEO") {
            video.currentTime = 0;
            video.play();
          } else if (video.tagName === "IFRAME") {
            sendYouTubeCommand(video, "playVideo");
          }
          setPlaying(true);
        } else {
          if (video.tagName === "VIDEO") {
            video.pause();
          } else if (video.tagName === "IFRAME") {
            sendYouTubeCommand(video, "pauseVideo");
          }
        }
      }
    });
  };

  const togglePlay = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (video.tagName === "VIDEO") {
        if (video.paused) {
          video.play();
          setPlaying(true);
        } else {
          video.pause();
          setPlaying(false);
        }
      } else if (video.tagName === "IFRAME") {
        if (playing) {
          sendYouTubeCommand(video, "pauseVideo");
          setPlaying(false);
        } else {
          sendYouTubeCommand(video, "playVideo");
          setPlaying(true);
        }
      }
    }
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

  const handleScroll = (event) => {
    if (!containerRef.current) return;
    const deltaY = event.deltaY;
    if (deltaY > 50 && currentIndex < videoList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (deltaY < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTouchStartY(null);
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
          mt: "3px",
          alignItems: "center",
          background: videoList[currentIndex]?.title
            ? "linear-gradient(to bottom, rgba(0,0,0,1) 20%, transparent 100%)"
            : "transparent",
        }}
      >
        <Typography variant="h6">{videoList[currentIndex]?.title}</Typography>
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
        {videoList.map((video, index) => {
          if (isYouTube(video.src)) {
            const videoId = getYouTubeId(video.src);
            return (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  height: "100vh",
                  position: "absolute",
                  top: 0,
                  transition: { xs: "transform 0.5s ease-in-out", md: "none" },
                  transform: `translateY(${(index - currentIndex) * 100}%)`,
                }}
              >
                <iframe
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${
                    index === currentIndex ? 1 : 0
                  }&controls=0`}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    objectFit: "cover",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setPlaying(true)}
                />
              </Box>
            );
          } else {
            return (
              <video
                key={index}
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.src}
                style={{
                  width: "100%",
                  height: "100vh",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  transition: { xs: "transform 0.5s ease-in-out", md: "none" },
                  transform: `translateY(${(index - currentIndex) * 100}%)`,
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                autoPlay={index === currentIndex}
                muted={false}
              />
            );
          }
        })}

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

        {!isMobile && videoList.length > 1 && (
          <Grid
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
          </Grid>
        )}
        <Box
          sx={{
            display: {
              xs: currentIndex === videoList.length - 1 ? "none" : "block",
              md: "none",
            },
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pb: 1,
            textAlign: "center",
          }}
          component={Typography}
          variant="body2"
        >
          Arraste para baixo para ver mais
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
