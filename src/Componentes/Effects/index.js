import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export const TypingEffectText = () => {
  const words = [
    "tem acesso a vários produtos de diferentes seguimentos!",
    "ganha eventuais descontos no seu corte de cabelo!",
    "agenda de qualquer lugar que estiver!",
    "agenda a hora que precisar!",
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [cursorColor, setCursorColor] = useState("#fff"); // Cor inicial fixa

  const typingSpeed = 50; // Velocidade ao digitar
  const eraseSpeed = 30; // Velocidade ao apagar
  const delayBeforeDeleting = 5000; // Tempo antes de apagar
  const idleBlinkSpeed = 500; // Velocidade da animação quando ocioso

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        setCursorColor("#fff"); // Mantém branco ao escrever
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        setIsIdle(true);
        timeout = setTimeout(() => {
          setIsDeleting(true);
          setIsIdle(false);
        }, delayBeforeDeleting);
      }
    } else {
      if (displayedText.length > 0) {
        setCursorColor("#fff"); // Mantém branco ao apagar
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

  // Efeito para piscar o cursor quando o texto estiver ocioso
  useEffect(() => {
    let cursorInterval;
    if (isIdle) {
      cursorInterval = setInterval(() => {
        setCursorColor((prev) => (prev === "#fff" ? "transparent" : "#fff"));
      }, idleBlinkSpeed);
    } else {
      setCursorColor("#fff"); // Mantém branco ao digitar ou apagar
    }

    return () => clearInterval(cursorInterval);
  }, [isIdle]);

  return (
    <Typography
      component="p"
      sx={{
        fontSize: { xs: "	1.5rem", md: "3.7rem" },
        width: "96%",
        minHeight: { xs: "135px", md: "210px" },
        textAlign: "left",
      }}
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
