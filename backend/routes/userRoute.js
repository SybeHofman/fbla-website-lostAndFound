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
    return response.status(400).send("Username and password are required");
  }

  try {
    hash = await argon2.hash(password);
  } catch (error) {
    console.log(error);
    return response.status(500).send("Error hashing password");
  }

  const newData = {
    username: username,
    password: hash,
  };

  const user = new User(newData);
  const savedUser = await user.save();

  console.log("Succesfully added user");
  response.status(200).json(savedUser);
});

//Get all users
router.get("/", (request, response) => {
  console.log("I got a request for users!");
  User.find({}, (error, users) => {
    if (error) {
      console.log("Error retrieving users:", error);
      return response.status(500).send("Error retrieving users");
    }

    return response.status(200).json(users);
  });
});

//Authenticate user (login)
router.post("/authenticate", async (request, response) => {
  console.log("Authenticating user!");

  const { username, password } = request.body;

  console.log(username);
  console.log(password);

  // Validate username and password
  if (!username || !password) {
    return response.status(400).send("Username and password are required");
  }
  try{
    const user = await User.findOne({ username: username });

    if (!user) {
      return response.status(400).send("Invalid username");
    }

    try {
      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        return response.status(400).send("Invalid username or password");
      }
    } catch (error) {
      console.log(error);
      return response.status(500).send("Error verifying password");
    }

    console.log(user._id);

    response.status(200).json(user);

  } catch (error) {
    console.log(error);
    return response.status(500).send("Error finding user:", error);
  }
});

module.exports = router;
