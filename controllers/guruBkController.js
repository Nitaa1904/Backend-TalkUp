const { siswa, guru_bk, users } = require("../models");
const bcrypt = require("bcryptjs");

const createGuruBk = async (req, res) => {
  try {
    const { nama, email, jabatan, password } = req.body;

    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newGuru = await guru_bk.create({
      nama,
      email,
      jabatan,
    });

    const newUser = await users.create({
      id_ref: newGuru.id,
      role: "guru_bk",
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Guru BK berhasil ditambahkan",
      guru_bk: newGuru,
      user: newUser,
    });
  } catch (error) {
    console.error("Error createGuruBk:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan guru BK",
      error: error.message,
    });
  }
};

const getSiswaBimbingan = async (req, res) => {
  console.log("Dari token:", req.user);

  try {
    if (req.user.role !== "guru_bk") {
      return res.status(403).json({
        message: "Akses ditolak. Hanya guru BK yang bisa melihat data ini.",
      });
    }

    const guruBkId = req.user.id_ref;

    if (!guruBkId) {
      return res.status(400).json({
        message: "Token tidak valid, id_ref guru BK tidak ditemukan",
      });
    }

    const list = await siswa.findAll({
      where: { guruBkId },
      include: [
        {
          model: guru_bk,
          as: "guru_bk",
          attributes: ["nama", "jabatan"],
        },
      ],
    });

    res.status(200).json({
      message: "Berhasil mengambil data siswa bimbingan",
      total: list.length,
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil siswa bimbingan",
      error: error.message,
    });
  }
};

module.exports = {
  getSiswaBimbingan,
  createGuruBk,
};
