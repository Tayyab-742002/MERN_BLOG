import { Outlet } from "react-router-dom";

import "./App.css";
// import { Home, LoginPage, SignupPage } from "./pages/index";
import { Layout } from "./components";
import { useEffect } from "react";
import authService from "./auth/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Try to get the current user
        authService
          .getCurrentUser()
          .then((response) => {
            dispatch(login(response.data));
          })
          .catch((error) => {
            dispatch(logout());
          });
      } catch (error) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, []);
  return (
    <div className="app-container">
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
}

export default App;
