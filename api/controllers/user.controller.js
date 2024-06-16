import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// SignUp
const signUpUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);
  
    // validation for not empty
    if (
      [username, email, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    // valdiates email
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid Email !");
    }
  
    // check for existing user
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    // console.log(existedUser);
    if (existedUser) {
      throw new ApiError(409, "User with username or email already exists !");
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
      throw new ApiError(500, "Something went wrong while signing up user");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "SignUp Successful"));
});
  
export {signUpUser}