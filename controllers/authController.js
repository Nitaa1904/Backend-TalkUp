const { users, siswa } = require("../models");
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

const register = async (req, res, next) => {
  try {
    const { nama_lengkap, kelas, email, password } = req.body;

    // Check if email already exists
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error("Email sudah terdaftar");
      err.statusCode = 409;
      throw err;
    }

    // Hash password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create siswa record first
    const newSiswa = await siswa.create({
      nama_lengkap,
      kelas,
      email_sekolah: email, // Using email as email_sekolah
    });

    // Create user record with reference to siswa
    const newUser = await users.create({
      id_ref: newSiswa.id,
      role: "siswa",
      email,
      password: hashedPassword,
    });

    // Prepare response data (exclude password)
    const { password: _, ...userResponse } = newUser.toJSON();
    const siswaResponse = {
      id: newSiswa.id,
      nama_lengkap: newSiswa.nama_lengkap,
      kelas: newSiswa.kelas,
      email_sekolah: newSiswa.email_sekolah,
    };

    res.status(201).json({
      message: "Registrasi siswa berhasil",
      data: {
        user: userResponse,
        siswa: siswaResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
};
