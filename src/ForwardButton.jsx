import React, { useState } from "react";

export default ({ onClick }) => {
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
        points="30 25 30 55 55 40 30 25"
        fill={touched ? "#777" : "black"}
        stroke={touched ? "#777" : "black"}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        points="57 25 57 55"
        fill="none"
        stroke={touched ? "#777" : "black"}
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
