/* CONFIGURATION */
import mongoose from "mongoose"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { login, register } from "./controllers/auth.js";
import { addGameScores, getGameScores, getUserGames } from "./controllers/game.js";
import { getMe, getUser } from "./controllers/user.js";
import { verifyToken } from "./middleware/auth.js";
import { registerValidation } from "./validations/auth.js";

dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((err) => console.log(err))

app.post("/register", registerValidation, register)
app.post("/login", login)
app.get("/getMe", verifyToken, getMe)
app.get("/getGameScores", getGameScores)
app.get('/getUserGames', getUserGames)
app.get('/getUser', getUser)
app.post("/addGameScores", addGameScores)