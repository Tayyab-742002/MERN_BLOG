import React from "react";

function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button type={type} className={`button-primary ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
