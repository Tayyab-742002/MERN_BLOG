import React, { useState } from "react";
import "./Login.css";
import Logo from "../../assets/Logo.png";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { CiLock, CiMail } from "react-icons/ci";
import Input from "../common/Input";
import Button from "../common/Button";
import authService from "../../auth/auth";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [errorField, setErrorField] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validateEmail = (email) =>
    /^([0-9a-zA-Z].*?@([0-9a-zA-Z].*\.\w{2,4}))$/.test(email);
  const loginUser = async (data) => {
    if (!validateEmail(data.credential)) {
      data.username = data.credential;
    } else {
      data.email = data.credential;
    }
    delete data.credential;
    try {
      const userData = await authService.loginUser(data);
      if (userData) {
        const userData = await authService.getCurrentUser();

        if (userData && userData?.data && userData.data?.success) {
          dispatch(login(userData.data));
          toast.success("Login Successfully");
          navigate("/");
          reset();
        }
      } else {
        toast.error("Login Failed !!");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  //Handling errors
  const onError = (errors) => {
    if (errors.credential) {
      setErrorField("credential");
    } else if (errors.password) {
      setErrorField("password");
    }
  };
  return (
    <div className="login-container">
      <figure className="login-logo-wrap">
        <img className="login-logo" src={Logo} alt="website Logo" />
      </figure>
      <h2 className="login-welcome">Welcome Back</h2>
      <div className="login-already">
        <p>Don't have an account yet? </p>
        <Link to="/signup" className="signup-link">Sign up</Link>
      </div>
      <form onSubmit={handleSubmit(loginUser, onError)}>
        <div className="input-fields">
          <Input
            type="text"
            placeholder="email or username"
            Icon={CiMail}
            {...register("credential", {
              required: "Username or Email is required",
            })}
          />

          <Input
            type="password"
            placeholder="password"
            Icon={CiLock}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      <div className="login-or">
        <div></div>
        <span>~</span>
        <div></div>
      </div>
      <figure></figure>

      <ErrorMessage
        errors={errors}
        name={errorField}
        render={({ message }) => <p className="error">{message}</p>}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </div>
  );
}

export default Login;
