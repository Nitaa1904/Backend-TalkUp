const { Op } = require("sequelize");
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

const getRiwayatKonseling = async (req, res, next) => {
  try {
    const { role, id_ref } = req.user;
    const { month, year, topik, page = 1, limit = 10 } = req.query;

    const whereCondition = { status: "Selesai" };

    if (role === "siswa") {
      whereCondition.id_siswa = id_ref;
    } else if (role === "guru_bk") {
      whereCondition.id_guru_bk = id_ref;
    } else {
      return res.status(403).json({
        status: "Forbidden",
        message: "Peran tidak diizinkan mengakses riwayat konseling.",
      });
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      whereCondition["$detail_konseling.tgl_sesi$"] = {
        [Op.between]: [startDate, endDate],
      };
    }

    if (topik) {
      whereCondition.topik_konseling = topik;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const perPage = parseInt(limit);

    const riwayat = await Konseling.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: siswa,
          as: "siswa",
          attributes: ["nama_lengkap", "kelas"],
        },
        {
          model: guru_bk,
          as: "guru_bk",
          attributes: ["nama"],
        },
        {
          model: DetailKonseling,
          as: "detail_konseling",
          attributes: [
            "tgl_sesi",
            "jam_sesi",
            "balasan_untuk_siswa",
            "catatan_guru_bk",
          ],
        },
      ],
      order: [
        [
          { model: DetailKonseling, as: "detail_konseling" },
          "tgl_sesi",
          "DESC",
        ],
      ],
      limit: perPage,
      offset: offset,
    });

    const data = riwayat.rows.map((item) => {
      const detail = item.detail_konseling || {};
      const baseData = {
        id_konseling: item.id,
        topik_konseling: item.topik_konseling,
        jenis_sesi: item.jenis_sesi,
        status: item.status,
        tgl_pengajuan: item.tgl_pengajuan,
        tgl_selesai: detail.tgl_sesi,
        siswa: item.siswa,
        guru_bk: item.guru_bk,
        hasil_konseling: detail.balasan_untuk_siswa,
      };

      if (role === "guru_bk") {
        baseData.catatan_guru_bk = detail.catatan_guru_bk;
      }

      return baseData;
    });

    if (riwayat.count === 0) {
      return res.status(200).json({
        status: "Success",
        message: "Belum ada riwayat konseling yang selesai.",
        isSuccess: true,
        data: [],
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Riwayat konseling berhasil diambil",
      isSuccess: true,
      totalData: riwayat.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(riwayat.count / perPage),
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKonseling = async (req, res, next) => {
  try {
    const { id_konseling } = req.params;

    const konseling = await Konseling.findOne({
      where: { id: id_konseling },
      include: [
        {
          model: siswa,
          as: "siswa",
          attributes: ["id", "nama_lengkap", "kelas"],
        },
        {
          model: guru_bk,
          as: "guru_bk",
          attributes: ["id", "nama"],
        },
        {
          model: DetailKonseling,
          as: "detail_konseling",
          required: false,
        },
      ],
    });

    if (!konseling) {
      return res.status(404).json({
        status: "Error",
        message: "Data konseling tidak ditemukan",
      });
    }

    // Access validation
    if (req.user.role === "siswa" && req.user.id_ref !== konseling.id_siswa) {
      return res.status(403).json({
        status: "Error",
        message:
          "Akses ditolak. Anda hanya dapat melihat pengajuan konseling milik Anda sendiri.",
      });
    }

    if (
      req.user.role === "guru_bk" &&
      req.user.id_ref !== konseling.id_guru_bk
    ) {
      return res.status(403).json({
        status: "Error",
        message:
          "Akses ditolak. Anda hanya dapat melihat pengajuan dari siswa bimbingan Anda.",
      });
    }

    // Format response data
    const responseData = {
      id_konseling: konseling.id,
      status: konseling.status,
      tgl_pengajuan: konseling.tgl_pengajuan,
      topik_konseling: konseling.topik_konseling,
      jenis_sesi_pengajuan: konseling.jenis_sesi,
      deskripsi_masalah: konseling.deskripsi_masalah,
      siswa: {
        nama: konseling.siswa?.nama_lengkap,
        kelas: konseling.siswa?.kelas,
      },
      guru_bk: {
        nama: konseling.guru_bk?.nama,
      },
    };

    // Add detail_konseling if status is "Disetujui" or "Selesai"
    if (konseling.status === "Disetujui" || konseling.status === "Selesai") {
      if (konseling.detail_konseling) {
        const detail = konseling.detail_konseling;

        // Parse jam_sesi to get waktu_mulai and waktu_selesai
        let waktu_mulai = null;
        let waktu_selesai = null;

        if (detail.jam_sesi) {
          const timeParts = detail.jam_sesi.split("-");
          waktu_mulai = timeParts[0] ? timeParts[0].trim() : null;
          waktu_selesai = timeParts[1] ? timeParts[1].trim() : null;
        }

        responseData.detail_konseling = {
          tgl_konseling: detail.tgl_sesi,
          waktu_mulai,
          waktu_selesai,
          jenis_sesi_final: detail.link_atau_ruang?.includes("http")
            ? "Online"
            : "Tatap Muka",
          link_sesi: detail.link_atau_ruang?.includes("http")
            ? detail.link_atau_ruang
            : null,
          deskripsi_jadwal: detail.balasan_untuk_siswa,
        };
      }
    }

    // Add hasil_konseling and catatan_guru_bk if status is "Selesai"
    if (konseling.status === "Selesai" && konseling.detail_konseling) {
      responseData.detail_konseling.hasil_konseling =
        konseling.detail_konseling.hasil_konseling;
      responseData.detail_konseling.catatan_guru_bk =
        konseling.detail_konseling.catatan_guru_bk;
    }

    res.status(200).json({
      status: "Success",
      message: "Detail pengajuan berhasil diambil",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const getJadwalKonseling = async (req, res, next) => {
  try {
    const jadwal = await Konseling.findAll({
      where: { status: "Disetujui" },
      include: [
        {
          model: DetailKonseling,
          as: "detail_konseling",
          where: {
            tgl_sesi: { [Op.gt]: new Date() }, // ✅ pakai nama field yang benar
          },
          attributes: [
            "tgl_sesi",
            "jam_sesi",
            "link_atau_ruang",
            "balasan_untuk_siswa",
            "catatan_guru_bk",
          ],
        },
        {
          model: siswa,
          as: "siswa",
          attributes: ["nama_lengkap", "kelas"],
        },
      ],
      order: [
        [{ model: DetailKonseling, as: "detail_konseling" }, "tgl_sesi", "ASC"],
      ],
    });

    if (!jadwal.length) {
      return res.status(404).json({
        status: "Not Found",
        message: "Tidak ada jadwal konseling mendatang yang ditemukan",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Daftar jadwal konseling mendatang berhasil diambil",
      data: jadwal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKonseling,
  getKonselingByGuruBk,
  updateStatusKonseling,
  getRiwayatKonseling,
  getDetailKonseling,
  getJadwalKonseling,
};
