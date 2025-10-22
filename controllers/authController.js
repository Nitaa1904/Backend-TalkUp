const { users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        id_user: user.id_user,
        role: user.role,
        id_ref: user.id_ref,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { password: _, ...secureUserData } = user.toJSON();

    res.status(200).json({
      message: "Login berhasil",
      data: secureUserData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login Gagal",
      error: error.message,
    });
  }
};

module.exports = {
  login,
};
