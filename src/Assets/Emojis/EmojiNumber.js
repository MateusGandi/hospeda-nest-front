import React from "react";

const EmojiNumber = ({ num, size = 50 }) => {
  return (
    <span
      className="emoji-number"
      style={{
        width: "20px",
        height: "20px",
        fontSize: size * 0.3,
      }}
    >
      {num}
    </span>
  );
};

export default EmojiNumber;
