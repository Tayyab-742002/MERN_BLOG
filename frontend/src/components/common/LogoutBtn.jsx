import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../auth/auth";
import Button from "./Button";
import { logout } from "../../features/authSlice";
function LogoutBtn() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    authService
      .logoutUser()
      .then((response) => {
        console.log(response);

        dispatch(logout());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Button className="button-outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutBtn;
