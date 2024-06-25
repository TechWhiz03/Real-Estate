import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// SignUp
const signUpUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  // console.log(req.body);

  // validation for not empty
  if (
    [ username, email, password ].some((field) => field?.trim() === "")
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  // valdiates email
  if (!validator.isEmail(email)) {
    return next(errorHandler(400, "Invalid Email !"));
  }

  // check for existing user
  const existedUser = await User.findOne({
    $or: [ { username }, { email } ],
  });
  // console.log(existedUser);
  if (existedUser) {
    return next(errorHandler(409, "User with username or email already exists !"));
  }

  const user = await User.create({
    username: username.toLowerCase(), // stores username in lowercase
    email,
    password,
  });

  // check user creation & response
  const createdUser = await User.findById(user._id)
  if (!createdUser) {
    return next(errorHandler(500, "Something went wrong while signing up user"));
  }
  const { password: pass, ...rest } = createdUser._doc;

  return res
    .status(201)
    .json(new ApiResponse(201, rest, "SignUp Successful"));
});

// Sign In
const signInUser = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(errorHandler(404, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(errorHandler(401, "Invalid user credentials"));
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

  const { password: pass, ...rest } = user._doc;

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, })
    .json(new ApiResponse(200, rest, "User signed in successfully"))
});

// Google OAuth
const googleAuth = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

      const { password: pass, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, })
        .json(new ApiResponse(200, rest, "User signed in successfully"));
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const user = await User.create({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      // check user creation & response
      const createdUser = await User.findById(user._id)
      const { password: pass, ...rest } = createdUser._doc;

      if (!createdUser) {
        return next(errorHandler(500, "Something went wrong while signing up user"));
      }

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

      return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, })
        .json(new ApiResponse(200, rest, "User signed in successfully"));
    }
  } catch (error) {
    next(error);
  }
})

// Update User Details
const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    return res
      .status(200)
      .json(new ApiResponse(200, rest, "Account details updated successfully"));
  } catch (error) {
    next(error);
  }
})

// Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);

    return res
      .clearCookie('accessToken')
      .status(200)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
})

// SignOut User
const signOutUser = asyncHandler(async (req, res, next) => {
  try {
    res
      .clearCookie('accessToken')
      .status(200)
      .json('User has been logged out!');
  } catch (error) {
    next(error);
  }
})

// Get User Listing
export const getUserListings = asyncHandler(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
});

export {
  signUpUser,
  signInUser,
  googleAuth,
  updateUser,
  deleteUser,
  signOutUser,
  getUserListings
}