import User from "../models/User.js";

/* GET ME */

export const getMe = async (req, res) => {
  try {
    let token = req.header("Authorization");
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    delete user._doc.passwordHash;
    return res.status(201).json({ user: user, token });
  } catch (err) {
    return res.status(500).json({ message: "Нет доступа" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { _id } = req.query;

    const user = await User.findOne({ _id: _id });

    res.status(201).json({user})

  } catch (err) {
    res.status(501).json({err: err})
  }
};
