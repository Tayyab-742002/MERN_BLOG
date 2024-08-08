import React from "react";

function GridLayout({ children }, className = "") {
  return (
    <section className={`grid-container ${className} `}>{children}</section>
  );
}

export default GridLayout;
