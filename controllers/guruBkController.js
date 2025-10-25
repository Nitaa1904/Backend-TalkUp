const { siswa, guru_bk, users } = require("../models");
const bcrypt = require("bcryptjs");

const getAllGuruBk = async (req, res) => {
  try {
    const guru = await guru_bk.findAll({
      include: [
        {
          model: users,
          as: "akun",
          attributes: ["email", "role"],
        },
      ],
    });

    res.status(200).json({
      message: "Berhasil menampilkan semua data guru BK",
      total: guru.length,
      data: guru,
    });
  } catch (error) {
    console.error("Error getAllGuruBk:", error);
    res.status(500).json({
      message: "Gagal menampilkan data guru BK",
      error: error.message,
    });
  }
};

const getGuruBkById = async (req, res) => {
  try {
    const { id } = req.params;
    const guru = await guru_bk.findByPk(id, {
      include: [
        {
          model: users,
          as: "akun",
          attributes: ["email", "role"],
        },
      ],
    });

    if (!guru) {
      return res.status(404).json({ message: "Guru BK tidak ditemukan" });
    }

    res.status(200).json({
      message: "Berhasil menampilkan detail guru BK",
      data: guru,
    });
  } catch (error) {
    console.error("Error getGuruBkById:", error);
    res.status(500).json({
      message: "Gagal menampilkan detail guru BK",
      error: error.message,
    });
  }
};

const updateGuruBk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, jabatan, password } = req.body;

    const guru = await guru_bk.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru BK tidak ditemukan" });
    }

    await guru.update({ nama, email, jabatan });

    const user = await users.findOne({
      where: { id_ref: id, role: "guru_bk" },
    });

    if (user) {
      const updateData = {};
      if (email) updateData.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      await user.update(updateData);
    }

    res.status(200).json({
      message: "Data Guru BK berhasil diperbarui",
      data: { guru, user },
    });
  } catch (error) {
    console.error("Error updateGuruBk:", error);
    res.status(500).json({
      message: "Gagal memperbarui data guru BK",
      error: error.message,
    });
  }
};

const deleteGuruBk = async (req, res) => {
  try {
    const { id } = req.params;

    const guru = await guru_bk.findByPk(id);
    if (!guru) {
      return res.status(404).json({ message: "Guru BK tidak ditemukan" });
    }

    await users.destroy({ where: { id_ref: id, role: "guru_bk" } });

    await guru.destroy();

    res.status(200).json({
      message: "Data Guru BK dan akun pengguna berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleteGuruBk:", error);
    res.status(500).json({
      message: "Gagal menghapus data guru BK",
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
    console.error("Error getSiswaBimbingan:", error);
    res.status(500).json({
      message: "Gagal mengambil siswa bimbingan",
      error: error.message,
    });
  }
};
const getSiswaBimbinganById = async (req, res) => {
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

    const { id } = req.params;

    const data = await siswa.findOne({
      where: {
        id,
        guruBkId,
      },
      include: [
        {
          model: guru_bk,
          as: "guru_bk",
          attributes: ["id", "nama", "jabatan"],
        },
        {
          model: users,
          as: "user",
          attributes: ["id", "email", "role"],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan atau bukan bimbingan Anda.",
      });
    }

    res.status(200).json({
      message: "Berhasil mengambil detail siswa bimbingan",
      data,
    });
  } catch (error) {
    console.error("Error getSiswaBimbinganById:", error);
    res.status(500).json({
      message: "Gagal mengambil detail siswa bimbingan",
      error: error.message,
    });
  }
};

module.exports = {
  getAllGuruBk,
  getGuruBkById,
  updateGuruBk,
  deleteGuruBk,
  getSiswaBimbingan,
  getSiswaBimbinganById,
};
