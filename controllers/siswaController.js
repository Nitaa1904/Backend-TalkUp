const { siswa, guru_bk, users } = require("../models");

const getAllSiswa = async (req, res) => {
  try {
    const data = await siswa.findAll({
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
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      message: "Berhasil menampilkan semua data siswa",
      data,
    });
  } catch (error) {
    console.error("Error getAllSiswa:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menampilkan data siswa",
      error: error.message,
    });
  }
};

const getSiswaById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await siswa.findByPk(id, {
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
        status: "error",
        message: "Siswa tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil menampilkan detail siswa",
      data,
    });
  } catch (error) {
    console.error("Error getSiswaById:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menampilkan detail siswa",
      error: error.message,
    });
  }
};

const updateSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { email_sekolah, nama_lengkap, kelas, guruBkId } = req.body;

    const data = await siswa.findByPk(id);
    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Siswa tidak ditemukan",
      });
    }

    await data.update({
      email_sekolah,
      nama_lengkap,
      kelas,
      guruBkId,
    });

    res.status(200).json({
      status: "success",
      message: "Data siswa berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error("Error updateSiswa:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui data siswa",
      error: error.message,
    });
  }
};

const deleteSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await siswa.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Siswa tidak ditemukan",
      });
    }

    await data.destroy();

    res.status(200).json({
      status: "success",
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleteSiswa:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus data siswa",
      error: error.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "siswa") {
      return res.status(403).json({
        message: "Akses ditolak. Hanya siswa yang bisa melihat profil ini.",
      });
    }

    const siswaId = req.user.id_ref;
    const data = await siswa.findByPk(siswaId, {
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
        message: "Data siswa tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil menampilkan profil siswa",
      data,
    });
  } catch (error) {
    console.error("Error getMyProfile:", error);
    res.status(500).json({
      message: "Gagal menampilkan profil siswa",
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "siswa") {
      return res.status(403).json({
        message: "Akses ditolak. Hanya siswa yang bisa memperbarui profil ini.",
      });
    }

    const siswaId = req.user.id_ref;
    const { nama_lengkap, kelas, email_sekolah } = req.body;

    const data = await siswa.findByPk(siswaId);
    if (!data) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    await data.update({
      nama_lengkap: nama_lengkap || data.nama_lengkap,
      kelas: kelas || data.kelas,
      email_sekolah: email_sekolah || data.email_sekolah,
    });

    res.status(200).json({
      message: "Profil siswa berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error("Error updateMyProfile:", error);
    res.status(500).json({
      message: "Gagal memperbarui profil siswa",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSiswa,
  getSiswaById,
  updateSiswa,
  deleteSiswa,
  getMyProfile,
  updateMyProfile,
};
