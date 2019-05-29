import React, { useState } from "react";

export default ({onClick}) => {
  const [touched, setTouched] = useState(false);

  return (
    <svg
      width="80"
      height="80"
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTouched(false)}
      onClick={onClick}
    >
      <polyline
        points="50 25 50 55 25 40 50 25"
        fill={touched ? "#777" : "black"}
        stroke={touched ? "#777" : "black"}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        points="23 25 23 55"
        fill="none"
        stroke={touched ? "#777" : "black"}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
