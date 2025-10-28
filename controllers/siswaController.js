const { siswa, guru_bk, users } = require("../models");

const getAllSiswa = async (req, res, next) => {
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
    next(error);
  }
};

const getSiswaById = async (req, res, next) => {
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
      const err = new Error("Siswa tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil menampilkan detail siswa",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateSiswa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email_sekolah, nama_lengkap, kelas, guruBkId } = req.body;

    const data = await siswa.findByPk(id);
    if (!data) {
      const err = new Error("Siswa tidak ditemukan");
      err.statusCode = 404;
      throw err;
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
    next(error);
  }
};

const deleteSiswa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await siswa.findByPk(id);

    if (!data) {
      const err = new Error("Siswa tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    await data.destroy();

    res.status(200).json({
      status: "success",
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "siswa") {
      const err = new Error(
        "Akses ditolak. Hanya siswa yang bisa melihat profil ini."
      );
      err.statusCode = 403;
      throw err;
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
      const err = new Error("Data siswa tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: "Berhasil menampilkan profil siswa",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "siswa") {
      const err = new Error(
        "Akses ditolak. Hanya siswa yang bisa melihat profil ini."
      );
      err.statusCode = 403;
      throw err;
    }

    const siswaId = req.user.id_ref;
    const { nama_lengkap, kelas, email_sekolah } = req.body;

    const data = await siswa.findByPk(siswaId);
    if (!data) {
      const err = new Error("Data siswa tidak ditemukan");
      err.statusCode = 404;
      throw err;
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
    next(error);
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
