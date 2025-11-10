const path = require("path");
const Datastore = require("nedb");
const express = require("express");

const {Item} = require("../models/itemModel");

const database = new Datastore({filename: path.resolve(__dirname, "../databases/items.db"), autoload: true});

const router = express.Router();

/**
 * Items consists of the following:
 * Picture
 * Text description
 * Claimed/Not claimed
 */

//Post new items
router.post("/", async (request, response) => {
  const data = request.body;

  const text = data.text;
  const claimed = false;
  const claimedBy = "No one";
  const picture = data.picture;

  console.log(text);

  if(!picture || !text){
    console.log("Please make sure to insert all required parts");
    response.status(400).send("Include the picture and the text");
    return;
  }

  const item = new Item({text: text, claimed: claimed, claimedBy: claimedBy, picture: picture});

  const savedItem = await item.save();
  
  console.log("Succesfully added item");
  response.status(200).send("Added item");
})

//Update claimed status
router.put("/claimed", async (request, response) => {
  const claimed = request.body.claimed;
  const id = request.body.id;

  console.log("Updating claimed status to: " + claimed + " for item with ID: " + id);

  if(claimed === undefined){
    console.log("Please include claimed status");
    return response.status(400).json("Include claimed status");
  }

  if(!id){
    console.log("Please include item ID");
    return response.status(400).json("Include item ID");
  }

  database.update({_id: id}, {$set: {claimed: claimed}}, {}, (error, numReplaced) => {
    if (error) {
      console.error("Error updating claimed status:", error);
      return response.status(500).json("Error updating claimed status");
    }
  });

  return response.status(200).json("Updated claimed status");
});

router.get("/", async (request,response) => {
  database.find({}, (error, data) => {
        if (error) {
          console.log("Error getting items: ", error);
          return response.status(500).json("Error getting items");
        }
        response.json(data);
    })

    console.log("I got a request for item!");
}) 

//Get s

module.exports = router;