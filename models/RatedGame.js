import mongoose from "mongoose";

const RatedGameSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slug: String,
  graphics: Number,
  gameplay: Number,
  sound: Number,
  storyLine: Number,
});

const RatedGame = mongoose.model("RatedGame", RatedGameSchema);
export default RatedGame;
