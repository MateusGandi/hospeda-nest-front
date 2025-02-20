import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { isMobile } from "../Funcoes";

const TypingEffectText = () => {
  const words = [
    "tem acesso a vários produtos de diferentes seguimentos",
    "ganha eventuais descontos no seu corte de cabelo",
    "agenda de qualquer lugar que estiver",
    "agenda a hora que precisar...",
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorColor, setCursorColor] = useState("#fff"); // Cor inicial do cursor

  const typingSpeed = 100; // Velocidade ao digitar
  const eraseSpeed = 30; // Velocidade ao apagar
  const delayBeforeDeleting = 3000; // Tempo antes de apagar

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), delayBeforeDeleting);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, eraseSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex]);

  // Efeito para piscar o cursor alterando a cor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorColor((prev) =>
        prev === "transparent" ? "#fff" : "transparent"
      ); // Alterna entre preto e cinza
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Typography
      variant={isMobile ? "h5" : "h2"}
      component="p"
      sx={{ minHeight: isMobile ? "105px" : "145px" }}
    >
      No <b>Tonsus</b> você {displayedText}
      <span
        style={{
          fontWeight: "bold",
          color: cursorColor,
        }}
      >
        |
      </span>
    </Typography>
  );
};

export default TypingEffectText;
