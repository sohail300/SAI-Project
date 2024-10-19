import TryCatch from "../middleware/TryCatch.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "../models/Request.js"; // Ensure this import is present
import { v2 as cloudinary } from 'cloudinary';

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: "User already Exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ _id: newUser._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.status(200).json({
    message: "User Registered",
    token,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify)
    return res.status(400).json({
      message: "Otp expired",
    });

  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong Otp",
    });

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({
    message: "User registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user with this email",
    });

  const mathPassword = await bcrypt.compare(password, user.password);
  if (!mathPassword)
    return res.status(400).json({
      message: "Wrong Password",
    });

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const createRequest = TryCatch(async (req, res) => {
  const { userId, fileType } = req.body; // Get user ID and file type from the request body


  console.log(userId)

  // Check if a file has been uploaded
  if (!req.file) {
    return res.status(400).json({ message: "File upload is required" });
  }

  // SEND FILE TO CLOUDINARY
  cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
  })

  const path = req.file.path
  console.log(path)

  const uniqueFilename = new Date().toISOString();
  console.log(uniqueFilename)

  cloudinary.uploader.upload(
      path,
      { public_id: `files/${uniqueFilename}` },
      async function (err, file) {
          if (err) return res.send('file format is wrong! Only image file supported')
          console.log('file uploaded to Cloudinary')

 // Get the uploaded file link
 const fileUrl = file.secure_url;
 console.log('Uploaded file URL:', fileUrl);


               // Create a new request with the uploaded file
    const newRequest = new Request({
      userId,
      fileUrl: fileUrl, // Path to the uploaded file
      fileType,
      status: "pending", // Set the initial status of the request to 'pending'
    });
  
    // Save the new request to the database
    await newRequest.save();
  
    // Return a success message with the newly created request details
    res.status(201).json({
      message: "Request created successfully",
      request: newRequest,
    });
      }
  )
})

export const getMyRequests = TryCatch(async (req, res) => {
  //Getting user id from the authenticated user's data
  const userId = req.user._id;

  //Find all requests made by this user
  const requests = await Request.find({ userId });

  //Check if user has made any requests
  if (!requests || requests.length == 0) {
    return res.status(400).json({
      message: "No requests found for this user",
    });
  }

  //Send the found requests as a response

  res.status(200).json({
    message: "Request retrieved successfully",
    requests,
  });
});
