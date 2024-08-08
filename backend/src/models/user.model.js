import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required!"],
    },
    username: {
      type: String,
      required: [true, "username is required!"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is mandatory!"],
    },
    profileImage: {
      type: String, //cloudinary url
    },
    role: {
      type: String,
      required: [true, "role is required"],
    },
    socialLinks: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//lets handle the password field
//hashing password beofore saving to db

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassowrd = await bcrypt.hash(this.password, 10);
  this.password = hashedPassowrd;
  next();
});

//Generating Access Token
userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};
//Generating Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};

//comparing password

userSchema.methods.isPasswordCorrect = async function (password) {
  const passwordCorrect = await bcrypt.compare(password, this.password);
  return passwordCorrect;
};
export const User = mongoose.model("User", userSchema);
