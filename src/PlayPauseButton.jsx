import React, { useState } from "react";

export default ({ onClick, playing }) => {
  const [touched, setTouched] = useState(false);

  return (
    <svg
      width="80"
      height="80"
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTouched(false)}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <circle cx="40" cy="40" r="40" fill="#aaa" />
      {playing ? (
        <g>
          <polyline
            points="30 25 30 55"
            fill="none"
            stroke="black"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="50 25 50 55"
            fill="none"
            stroke="black"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      ) : (
        <polyline
          points="30 25 30 55 55 40 30 25"
          fill="black"
          stroke="black"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      )}
    </svg>
  );
};
