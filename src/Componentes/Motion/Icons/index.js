import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box } from "@mui/material";

export default function AnimatedIcons() {
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowIcons(true), 300); // Delay para aparecer
  }, []);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* Calendário aparecendo suavemente */}
      {showIcons && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CalendarTodayIcon color="primary" fontSize="large" />
        </motion.div>
      )}

      {/* Joinha crescendo e diminuindo uma vez */}
      {showIcons && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.4, 1] }} // Cresce e volta ao normal
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <ThumbUpIcon color="success" fontSize="large" />
        </motion.div>
      )}
    </Box>
  );
}
