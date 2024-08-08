import React, { useId } from "react";
import "./styles.css";
function Input({ label, type = "", className = "", Icon, ...props }, ref) {
  const id = useId();
  return (
    <div className="input-wrapper">
      {label && (
        <label className="" htmlFor={id}>
          {label}
        </label>
      )}
      {Icon && <Icon />}
      <input
        type={type}
        className={`input-field ${className}`}
        {...props}
        id={id}
        ref={ref}
      />
    </div>
  );
}

export default React.forwardRef(Input);
