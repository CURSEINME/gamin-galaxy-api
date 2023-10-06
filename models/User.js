import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    ratedGames: [{ type: Schema.Types.ObjectId, ref: "RatedGame" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
