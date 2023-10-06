import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

/* REGISTER USER */

export const register = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const {
      name,
      email,
      password
    } = req.body;

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    
    const newUser = new User({
      name,
      email,
      passwordHash: hash
    })

    const savedUser = await newUser.save()

    const token = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET)
    delete savedUser._doc.passwordHash

    res.status(201).json({savedUser, token})
  } catch(err) {
    res.status(501).json({err: err})
  }
}

/* LOGIN USER */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({email: email})
    if (!user) return res.status(400).json({message: "User does not exist"})
    
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(400).json({message: "Invalid credentials"})

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    delete user._doc.passwordHash
    
    return res.status(200).json({user, token})
  } catch(err) {
    return res.status(500).json({err: err})
  }
}
