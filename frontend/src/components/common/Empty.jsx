import React from "react";
import { ImFileEmpty } from "react-icons/im";
function Empty({ message = "Result Not Found", Icon = ImFileEmpty }) {
  return (
    <div className="empty">
      <Icon className="empty-icon" />
      <span> {message}</span>
    </div>
  );
}

export default Empty;
