const express = require("express");

const {Item} = require("../models/itemModel");

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
    response.status(400).json("Include the picture and the text");
    return;
  }

  const item = new Item({text: text, claimed: claimed, claimedBy: claimedBy, picture: picture});

  const savedItem = await item.save();
  
  console.log("Succesfully added item");
  response.status(200).json(savedItem);
});

//Update claimed status
router.put("/claimed", async (request, response) => {
  const claimed = request.body.claimed;
  const id = request.body.id;
  let claimedBy = request.body.claimedBy;

  console.log("Updating claimed status to: ", claimed, " for item with ID: ", id);

  if(claimed === undefined){
    console.log("Please include claimed status");
    return response.status(400).json("Include claimed status");
  }

  if(!id){
    console.log("Please include item ID");
    return response.status(400).json("Include item ID");
  }

  if(!claimedBy){
    console.log("Please include claimedBy username");
    return response.status(400).json("Include claimedBy username");
  }

  if(!claimed){
    claimedBy = "No one";
  }

  console.log((await Item.findByIdAndUpdate(id, {claimed: claimed, claimedBy: claimedBy}).exec()).claimed);

  return response.status(200).json("Updated claimed status");
});

router.get("/", async (request,response) => {

  console.log("I got a request for items!");

  const items = await Item.find({}).exec();

  console.log(items);

  return response.status(200).json(items);
});

router.delete("/", async (request, response) => {
  const id = request.body.id;

  if(!id){
    console.log("Please include item ID");
    return response.status(400).json("Include item ID");
  }

  console.log("Deleting item with ID: ", id);

  const item = Item.findByIdAndDelete(id).exec();

  return response.status(200).json("Deleted item");
});

module.exports = router;