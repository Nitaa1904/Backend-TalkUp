const { siswa } = require("../models");

const createKonseling = async (req, res, next) => {
  try {
    const { topik_konseling, deskripsi_masalah, jenis_sesi } = req.body;
    const siswaId = req.user.id_ref;
    const siswaLogin = await siswa.findOne({ where: { id: siswaId } });
    if (!siswaLogin) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan.",
      });
    }

    const id_guru_bk = req.body.id_guru_bk || siswaLogin.guruBkId;
    if (!id_guru_bk) {
      return res.status(400).json({
        message: "Siswa belum memiliki guru BK yang ditugaskan.",
      });
    }

    const newKonseling = await siswa.sequelize.models.Konseling.create({
      id_siswa: siswaId,
      id_guru_bk,
      jenis_sesi,
      topik_konseling,
      deskripsi_masalah,
    });

    const msgKonseling = {
      id_konseling: newKonseling.id,
      status: newKonseling.status,
    };

    res.status(201).json({
      status: "Success",
      message: "Pengajuan konseling berhasil dibuat",
      isSuccess: true,
      data: {
        id_konseling: newKonseling.id,
        status: newKonseling.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKonseling,
};
