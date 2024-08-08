import React, { useId } from "react";

function Select(
  { options = [], label, className = "", placeholder, Icon, ...props },
  ref
) {
  const id = useId();

  return (
    <div className="selector">
      {label && (
        <label className="" htmlFor={id}>
          {label}
        </label>
      )}
      {Icon && <Icon />}
      <select id={id} className={`${className}`} {...props} ref={ref}>
        {placeholder && (
          <option disabled hidden>
            {placeholder}
          </option>
        )}
        {options &&
          options.map((option) => {
            return (
              <option value={option} key={option}>
                {option}
              </option>
            );
          })}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
