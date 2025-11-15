const { siswa, guru_bk, Konseling, DetailKonseling } = require("../models");
const notificationService = require("../services/notificationService");

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

const getKonselingByGuruBk = async (req, res, next) => {
  try {
    const { id_guru_bk } = req.params;

    if (req.user.role === "guru_bk" && req.user.id_ref != id_guru_bk) {
      return res.status(403).json({
        message:
          "Akses ditolak. Anda hanya dapat melihat pengajuan dari siswa bimbingan Anda.",
      });
    }

    const konselingRequests = await Konseling.findAll({
      where: { id_guru_bk, status: "Menunggu" },
      include: [
        {
          model: siswa,
          as: "siswa",
          attributes: ["id", "nama_lengkap", "kelas", "email_sekolah"],
        },
        {
          model: DetailKonseling,
          as: "detail_konseling",
          required: false,
        },
      ],
      order: [["tgl_pengajuan", "DESC"]],
    });

    if (konselingRequests.length === 0) {
      return res.status(200).json({
        status: "Success",
        message: "Belum ada pengajuan konseling yang menunggu persetujuan.",
        isSuccess: true,
        data: [],
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Daftar pengajuan konseling berhasil diambil",
      isSuccess: true,
      data: konselingRequests,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusKonseling = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status,
      tgl_sesi,
      jam_sesi,
      link_atau_ruang,
      balasan_untuk_siswa,
      catatan_guru_bk,
    } = req.body;

    const konseling = await Konseling.findByPk(id, {
      include: [
        {
          model: siswa,
          as: "siswa",
        },
      ],
    });

    if (!konseling) {
      return res.status(404).json({
        message: "Data konseling tidak ditemukan.",
      });
    }

    if (
      req.user.role === "guru_bk" &&
      req.user.id_ref != konseling.id_guru_bk
    ) {
      return res.status(403).json({
        message:
          "Akses ditolak. Anda hanya dapat memproses pengajuan dari siswa bimbingan Anda.",
      });
    }

    konseling.status = status;
    await konseling.save();

    let detailKonseling = null;

    if (status === "Disetujui") {
      let detailKonseling = await DetailKonseling.findOne({
        where: { id_konseling: id },
      });

      if (!detailKonseling) {
        detailKonseling = await DetailKonseling.create({
          id_konseling: id,
          tgl_sesi,
          jam_sesi,
          link_atau_ruang,
          balasan_untuk_siswa,
          catatan_guru_bk,
        });
      } else {
        await detailKonseling.update({
          tgl_sesi,
          jam_sesi,
          link_atau_ruang,
          balasan_untuk_siswa,
          catatan_guru_bk,
        });
      }
    }

    const siswaEmail = konseling.siswa?.email_sekolah;
    const siswaNama = konseling.siswa?.nama_lengkap;
    const siswaId = konseling.siswa?.id;

    await notificationService.sendNotification(
      siswaEmail,
      `Halo ${siswaNama}, status pengajuan konseling kamu telah diperbarui menjadi "${status}".`,
      siswaId
    );

    const responseData = {
      id_konseling: konseling.id,
      status: konseling.status,
    };

    if (status === "Disetujui" && detailKonseling) {
      responseData.detail_konseling = {
        id_detail: detailKonseling.id_detail,
        id_konseling: detailKonseling.id_konseling,
        tgl_sesi: detailKonseling.tgl_sesi,
        jam_sesi: detailKonseling.jam_sesi,
        link_atau_ruang: detailKonseling.link_atau_ruang,
        balasan_untuk_siswa: detailKonseling.balasan_untuk_siswa,
        catatan_guru_bk: detailKonseling.catatan_guru_bk,
      };
    }

    res.status(200).json({
      status: "Success",
      message: `Status konseling berhasil diubah menjadi ${status}`,
      isSuccess: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
const markKonselingAsCompleted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hasil_konseling, catatan_guru_bk, catatan_siswa } = req.body;

    const konseling = await Konseling.findByPk(id, {
      include: [{ model: DetailKonseling, as: "detail_konseling" }],
    });
    

    if (!konseling) {
      return res.status(404).json({
        status: "Error",
        message: "Data konseling tidak ditemukan.",
        isSuccess: false,
      });
    }

    if (konseling.status !== "Disetujui") {
      return res.status(400).json({
        status: "Error",
        message: "Konseling hanya bisa diselesaikan jika status saat ini Disetujui.",
        isSuccess: false,
      });
    }
    if (req.user.role === "guru_bk" && req.user.id_ref != konseling.id_guru_bk) {
      return res.status(403).json({
        status: "Error",
        message: "Akses ditolak. Anda hanya bisa menyelesaikan konseling siswa bimbingan Anda.",
        isSuccess: false,
      });
    }

    konseling.status = "Selesai";
    await konseling.save();

    let detailKonseling = konseling.detail_konseling;

    if (!detailKonseling) {
      detailKonseling = await DetailKonseling.create({
        id_konseling: id,
        hasil_konseling,
        catatan_guru_bk,
        catatan_siswa,
        tgl_selesai: new Date(),
      });
    } else {
      await detailKonseling.update({
        hasil_konseling,
        catatan_guru_bk,
        catatan_siswa,
        tgl_selesai: new Date(),
      });
    }
    await detailKonseling.reload();

    res.status(200).json({
      status: "Success",
      message: "Sesi konseling berhasil diselesaikan",
      isSuccess: true,
      data: {
        id_konseling: konseling.id,
        status: konseling.status,
        detail_konseling: {
          hasil_konseling: detailKonseling.hasil_konseling,
          catatan_guru_bk: detailKonseling.catatan_guru_bk,
          catatan_siswa: detailKonseling.catatan_siswa,
          tgl_selesai: detailKonseling.tgl_selesai,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createKonseling,
  getKonselingByGuruBk,
  updateStatusKonseling,
  markKonselingAsCompleted
};
