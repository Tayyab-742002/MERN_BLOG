import React from "react";
import Input from "./Input";

function Search({
  type = "text",
  placeholder = "Search",
  Icon,
  className = "",
}) {
  return (
    <div className={`search-container ${className}`}>
      <Input
        type={type}
        placeholder={placeholder}
        Icon={Icon}
        className="search-input"
      />
    </div>
  );
}

export default Search;
