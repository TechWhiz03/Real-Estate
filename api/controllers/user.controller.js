import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';


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
  const createdUser = await User.findById(user._id).select(
    "-password"
  );
  if (!createdUser) {
    return next(errorHandler(500, "Something went wrong while signing up user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "SignUp Successful"));
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

  const signedInUser = await User.findOne(user._id).select(
    "-password"
  );

  return res
    .status(200)
    .cookie(
      "accessToken",
      accessToken,
      { httpOnly: true, }
    )
    .json(
      new ApiResponse(
        200,
        {
          user: signedInUser
        },
        "User signed in successfully"
      )
    );
});

// Google OAuth
const googleAuth = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

      const signedInUser = await User.findOne(user._id).select(
        "-password"
      );

      return res
        .status(200)
        .cookie(
          "accessToken",
          accessToken,
          { httpOnly: true, }
        )
        .json(
          new ApiResponse(
            200,
            {
              user: signedInUser
            },
            "User signed in successfully"
          )
        );
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
})


export {
  signUpUser,
  signInUser,
  googleAuth
}