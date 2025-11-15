const argon2 = require("argon2");
const express = require("express");
const { User } = require("../models/userModel");

const router = express.Router();

//Post new user (signup)
router.post("/", async (request, response) => {
  console.log("Adding new user!");

  const data = request.body;

  const username = data.username;
  const password = data.password;

  let hash;

  if (!username || !password) {
    return response.status(400).json("Username and password are required");
  }

  //Checking if username already exists
  const existingUser = await User.find({ username: username });
  if (existingUser.length > 0) {
    return response.status(400).json("Username already exists");
  }

  try {
    hash = await argon2.hash(password);
  } catch (error) {
    console.log(error);
    return response.status(500).json("Error hashing password");
  }

  const newData = {
    username: username,
    password: hash,
    admin: false
  };

  const user = new User(newData);
  const savedUser = await user.save();

  console.log("Succesfully added user");
  response.status(200).json(savedUser);
});

//Get all users
router.get("/", async (request, response) => {
  console.log("I got a request for users!");

  try{
    const users = await User.find({});
    return response.status(200).json(users);
  } catch(error){
    console.log("Error fetching users:", error);
    return response.status(500).json("Error fetching users");
  }

  
});

//Authenticate user (login)
router.post("/authenticate", async (request, response) => {
  console.log("Authenticating user!");

  const { username, password } = request.body;

  console.log(username);
  console.log(password);

  // Validate username and password
  if (!username || !password) {
    return response.status(400).json("Username and password are required");
  }
  try{
    const user = await User.findOne({ username: username });

    if (!user) {
      return response.status(400).json("Invalid username");
    }

    try {
      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        return response.status(400).json("Invalid username or password");
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json("Error verifying password");
    }

    console.log(user._id);

    response.status(200).json(user);

  } catch (error) {
    console.log(error);
    return response.status(500).json("Error finding user:", error);
  }
});

router.delete("/", async (request, response) => {
  console.log("Deleting user!");

  const id = request.body?.id;

  if (!id) {
    return response.status(400).json("User ID is required");
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return response.status(404).json("User not found");
    }

    console.log("Successfully deleted user");
    response.status(200).json("Deleted user");
  } catch (error) {
    console.log("Error deleting user:", error);
    return response.status(500).json("Error deleting user");
  }
})

module.exports = router;
