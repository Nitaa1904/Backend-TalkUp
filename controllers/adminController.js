const { users, guru_bk, siswa, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

const addGuruBk = async (req, res, next) => {
  try {
    const { nama, email, jabatan, password } = req.body;

    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email sudah terdaftar");
      error.status = 400;
      throw error;
    }

    const newGuruBk = await guru_bk.create({ nama, jabatan });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.create({
      id_ref: newGuruBk.id,
      role: "guru_bk",
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Guru BK berhasil ditambahkan",
      guru_bk: newGuruBk,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const addSiswa = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { email_sekolah, nama_lengkap, kelas, email, password, guruBkId } =
      req.body;

    if (
      !email_sekolah ||
      !nama_lengkap ||
      !kelas ||
      !email ||
      !password ||
      !guruBkId
    ) {
      return res.status(400).json({
        status: "Failed",
        message: "Semua field wajib diisi",
      });
    }

    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email sudah terdaftar");
      error.status = 400;
      throw error;
    }

    const guruBkExist = await guru_bk.findByPk(guruBkId);
    if (!guruBkExist) {
      const error = new Error("Guru BK dengan ID tersebut tidak ditemukan");
      error.status = 404;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSiswa = await siswa.create(
      { email_sekolah, nama_lengkap, kelas, guruBkId },
      { transaction: t }
    );

    const newUser = await users.create(
      {
        id_ref: newSiswa.id,
        email,
        password: hashedPassword,
        role: "siswa",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      status: "Success",
      message: "Siswa berhasil ditambahkan oleh Super Admin",
      data: {
        siswa: newSiswa,
        akun: {
          id_user: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const data = await users.findAll();
    res.json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGuruBk,
  addSiswa,
  getAllUsers,
};
