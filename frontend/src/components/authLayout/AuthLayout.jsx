import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function AuthLayout({ children, authentication = true }) {
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.status);

  const navigate = useNavigate();
  useEffect(() => {
    if (authentication && authStatus != authentication) {
      navigate("/login");
    } else if (!authentication && authStatus != authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [setLoader, navigate, authStatus]);
  return loader ? <div>Loading...</div> : <>{children}</>;
}

export default AuthLayout;
