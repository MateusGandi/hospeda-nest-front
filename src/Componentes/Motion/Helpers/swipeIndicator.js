import React, { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import SwipeIcon from "@mui/icons-material/Swipe";
import { isMobile } from "../../Funcoes";

const SwipeIndicator = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const timer = useRef(null);

  const resetTimer = () => {
    if (isMobile) {
      if (timer.current) clearTimeout(timer.current);
      setVisible(false);
      timer.current = setTimeout(() => {
        setVisible(true);
      }, 15000);
    }
  };

  useEffect(() => {
    const handleUserActivity = () => resetTimer();

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  return (
    <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
      <Box sx={{ width: "100%" }}>{children}</Box>
      {visible && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 80,
            height: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{
              x: [0, -20, 20, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            style={{ position: "absolute" }}
          >
            <SwipeIcon sx={{ fontSize: 60, color: "rgba(256,256,256,0.8)" }} />
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default SwipeIndicator;
