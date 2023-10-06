import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  slug: {
    required: true,
    type: String,
  },
  graphics: {
    required: true,
    type: Number,
  },
  gameplay: {
    required: true,
    type: Number,
  },
  sound: {
    required: true,
    type: Number,
  },
  storyLine: {
    required: true,
    type: Number,
  },
  reviewCount: {
    type: Number,
  },
});

const Game = mongoose.model("Game", GameSchema);

export default Game;
