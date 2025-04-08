import React from "react";
import { Twemoji } from "react-emoji-render"; // Usando Twemoji

const Icon = ({ children }) => {
  return <Twemoji text={children} />;
};

export default Icon;
