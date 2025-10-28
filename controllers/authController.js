const { users } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ where: { email } });
    if (!user) {
      const err = new Error("Email tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error("Password salah");
      err.statusCode = 401;
      throw err;
    }

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
    next(error);
  }
};

module.exports = {
  login,
};
