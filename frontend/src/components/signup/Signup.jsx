import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import { CiLock, CiMail, CiUser, CiExport } from "react-icons/ci";
import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
import "./Signup.css";
import { useDispatch } from "react-redux";
import authService from "../../auth/auth";
import { login } from "../../features/authSlice";
import { ErrorMessage } from "@hookform/error-message";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const password = watch("password", "");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [errorField, setErrorField] = useState("");
  const dispatch = useDispatch();
  const onError = (errors) => {
    if (errors.fullname) {
      setErrorField("fullname");
    } else if (errors.username) {
      setErrorField("username");
    } else if (errors.email) {
      setErrorField("email");
    } else if (errors.password) {
      setErrorField("password");
    } else if (errors.confirmPassword) {
      setErrorField("confirmPassword");
    } else if (errors.profileImage) {
      setErrorField("profileImage");
    }
  };
  const registerUser = async (data) => {
    // console.log(data);
    setError("");
    try {
      const userData = await authService.createUser(data);
      if (userData) {
        // console.log(userData);
        const userData = await authService.getCurrentUser();
        if (userData && userData?.data && userData.data?.success) {
          dispatch(login(userData));
          toast.success("User Registered Succefully");
          reset();
          navigate("/");
        } else {
          toast.error("User Register Failed");
        }
      } else {
        toast.error("User Register Failed");
      }
    } catch (error) {
      setError(error);
    }
  };
  return (
    <div className="signup-container">
      <figure className="signup-logo-wrap">
        <img className="signup-logo" src={Logo} alt="website Logo" />
      </figure>
      <h2 className="signup-welcome">Create Account</h2>
      <div className="signup-already">
        <p>Already have an account? </p>
        <Link to="/login" className="login-link">
          Login
        </Link>
      </div>
      <form onSubmit={handleSubmit(registerUser, onError)}>
        <div className="signup-input-fields">
          <Input
            type="text"
            placeholder="Full name"
            Icon={CiUser}
            {...register("fullname", {
              required: "Fullname is Required",
            })}
          />
          <Input
            type="text"
            placeholder="Username"
            Icon={CiUser}
            {...register("username", {
              required: "Username is required",
            })}
          />
          <Input
            type="email"
            placeholder="Email"
            Icon={CiMail}
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^([0-9a-zA-Z].*?@([0-9a-zA-Z].*\.\w{2,4}))$/.test(value) ||
                  "Email address must be a valid address",
              },
            })}
          />
          <Input
            type="password"
            placeholder="password"
            Icon={CiLock}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password should be 6 character long",
              },
            })}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            Icon={CiLock}
            {...register("confirmPassword", {
              required: true,
              validate: {
                matchPassword: (value) =>
                  value === password || "The passwords do not match",
              },
            })}
          />
          <Input
            type="file"
            placeholder="Profile image"
            Icon={CiExport}
            className="profile-imgage-upload"
            {...register("profileImage", {
              required: "Avatar is required",
            })}
          />
        </div>

        <Button type="submit">Signup</Button>
      </form>
      <div className="signup-or">
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

export default Signup;
