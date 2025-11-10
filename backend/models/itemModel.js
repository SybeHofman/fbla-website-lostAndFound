const { text } = require("express");
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    text: { type: String, required: true },
    claimed: { type: Boolean, required: true },
    claimedBy: { type: String, required: true },
    picture: { type: String, required: true }
});

const Item = mongoose.model("Item", itemSchema);

module.exports = {itemSchema, Item};
