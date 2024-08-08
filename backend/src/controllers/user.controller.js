import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessandRefreshToken = async (userId) => {
  console.log("I got invoked");
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "Unauthorized Request Token");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log("Access Token :", accessToken);
    console.log("Refesh Token :", refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating Tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  //get the details req.body
  //validation
  //handle profileImage
  //check user already exists
  //upload it to cloudinary
  //create db entry
  //remove password and refresh token field
  //check for user creation
  //retun response

  const { username, fullname, password, email } = req.body;
  // console.log(`username : ${username}`);
  // console.log(`fullname : ${fullname}`);
  // console.log(`email : ${email}`);

  if (
    [username, fullname, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(401, "All Fields are required!!");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(401, "User Already Exists!!");
  }

  const localProfileImagePath = req.file?.path;
  // console.log(req.file);
  if (!localProfileImagePath) {
    throw new ApiError(401, `Image file is required `);
  }

  const profileImage = await uploadOnCloudinary(localProfileImagePath);
  if (!profileImage) {
    throw new ApiError(501, "Error while uploading file");
  }

  //creating database entry
  const createdUser = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    profileImage: profileImage.url,
    role: "user",
    socialLinks: [],
    bio: "add something about you.....",
  });

  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(501, "Error while registering user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user registered successfullly"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get data
  //validate data
  //generate tokens
  const { username, email, password } = req.body;
  if (!username && !password) {
    throw new ApiError(401, "Email or username is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(401, "user does not exists");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(404, "Invalid Password");

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user?._id
  );
  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  if (!user) {
    throw new ApiError(501, "Error while logging out ");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LogoutSuccessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
 

    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      throw new ApiError(401, "Unauthorized Access ");
    }
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Token");
    }

    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }
    if (incomingToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Someting went wrong while refreshing the tokens");
  }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, username, bio, role, socialLinks } = req.body;
  if ([fullname, email, username, role].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "All fields are required");
  }

  console.log(`Username : ${username} \n Email : ${email}`);
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        username: username,
        email: email,
        bio: bio,
        role: role,
        socialLinks: socialLinks,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Detail update Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccountDetails,
  getCurrentUser,
};
