const { Op } = require("sequelize");
const { siswa, guru_bk, Konseling, DetailKonseling } = require("../models");
const notificationService = require("../services/notificationService");

const createKonseling = async (req, res, next) => {
  try {
    const { topik_konseling, deskripsi_masalah, jenis_sesi, id_guru_bk } =
      req.body;

    const siswaId = req.user.id_ref;

    // cek siswa login
    const siswaLogin = await siswa.findOne({ where: { id: siswaId } });
    if (!siswaLogin) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan.",
      });
    }

    // tentukan guru BK yang dipakai
    let guruBkDipakai = id_guru_bk || siswaLogin.guruBkId;

    // jika siswa tidak punya guru default & tidak memilih guru sama sekali
    if (!guruBkDipakai) {
      return res.status(400).json({
        message:
          "Guru BK tidak ditemukan. Siswa belum memiliki guru BK default dan tidak memilih guru lain.",
      });
    }

    // validasi guru BK ada di database
    const guruCheck = await guru_bk.findOne({
      where: { id: guruBkDipakai },
    });

    if (!guruCheck) {
      return res.status(404).json({
        message: "Guru BK yang dipilih tidak terdaftar.",
      });
    }

    // buat konseling
    const newKonseling = await siswa.sequelize.models.Konseling.create({
      id_siswa: siswaId,
      id_guru_bk: guruBkDipakai,
      jenis_sesi,
      topik_konseling,
      deskripsi_masalah,
    });

    res.status(201).json({
      status: "Success",
      message: "Pengajuan konseling berhasil dibuat",
      isSuccess: true,
      data: {
        id_konseling: newKonseling.id,
        id_guru_bk: guruBkDipakai,
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
        message:
          "Konseling hanya bisa diselesaikan jika status saat ini Disetujui.",
        isSuccess: false,
      });
    }
    if (
      req.user.role === "guru_bk" &&
      req.user.id_ref != konseling.id_guru_bk
    ) {
      return res.status(403).json({
        status: "Error",
        message:
          "Akses ditolak. Anda hanya bisa menyelesaikan konseling siswa bimbingan Anda.",
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

const getRiwayatKonseling = async (req, res, next) => {
  try {
    const { role, id_ref } = req.user;
    const { month, year, topik, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {
      status: "Selesai",
    };

    // Validasi akses berdasarkan role
    if (role === "siswa") {
      whereClause.id_siswa = id_ref;
    } else if (role === "guru_bk") {
      whereClause.id_guru_bk = id_ref;
    }

    // Filter berdasarkan bulan & tahun tgl_selesai
    if (month || year) {
      whereClause["$detail_konseling.tgl_selesai$"] = {};
      if (month)
        whereClause["$detail_konseling.tgl_selesai$"][Op.and] = [
          Sequelize.where(
            Sequelize.fn(
              "MONTH",
              Sequelize.col("detail_konseling.tgl_selesai")
            ),
            month
          ),
        ];
      if (year)
        whereClause["$detail_konseling.tgl_selesai$"][Op.and] = [
          ...(whereClause["$detail_konseling.tgl_selesai$"][Op.and] || []),
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("detail_konseling.tgl_selesai")),
            year
          ),
        ];
    }

    // Filter berdasarkan topik
    if (topik) {
      whereClause.topik_konseling = { [Op.like]: `%${topik}%` };
    }

    const { rows, count } = await Konseling.findAndCountAll({
      where: whereClause,
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
            "hasil_konseling",
            "catatan_guru_bk",
            "catatan_siswa",
            "tgl_selesai",
          ],
        },
      ],
      order: [
        [
          { model: DetailKonseling, as: "detail_konseling" },
          "tgl_selesai",
          "DESC",
        ],
      ],
      limit: parseInt(limit),
      offset,
    });

    // Format response sesuai role
    const formatted = rows.map((item) => ({
      id_konseling: item.id,
      topik_konseling: item.topik_konseling,
      jenis_sesi: item.jenis_sesi,
      status: item.status,
      tgl_pengajuan: item.tgl_pengajuan,
      tgl_selesai: item.detail_konseling?.tgl_selesai,
      siswa: {
        nama_lengkap: item.siswa?.nama_lengkap,
        kelas: item.siswa?.kelas,
      },
      guru_bk: {
        nama: item.guru_bk?.nama,
      },
      hasil_konseling: item.detail_konseling?.hasil_konseling,
      catatan_guru_bk:
        role === "guru_bk" ? item.detail_konseling?.catatan_guru_bk : undefined, // siswa tidak boleh lihat catatan guru
      catatan_siswa: item.detail_konseling?.catatan_siswa,
    }));

    res.status(200).json({
      status: "Success",
      message: "Riwayat konseling berhasil diambil",
      isSuccess: true,
      pagination: {
        total_data: count,
        current_page: parseInt(page),
        limit: parseInt(limit),
        total_page: Math.ceil(count / limit),
      },
      data: formatted,
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

const getRiwayatKonselingSiswa = async (req, res, next) => {
  try {
    const { id_ref, role } = req.user;

    if (role !== "siswa") {
      return res.status(403).json({
        status: "Error",
        message: "Akses ditolak. Endpoint ini hanya untuk siswa.",
      });
    }

    const riwayat = await Konseling.findAll({
      where: { id_siswa: id_ref },
      include: [
        {
          model: guru_bk,
          as: "guru_bk",
          attributes: ["id", "nama"],
        },
        {
          model: DetailKonseling,
          as: "detail_konseling",
          required: false,
          attributes: [
            "tgl_sesi",
            "jam_sesi",
            "link_atau_ruang",
            "balasan_untuk_siswa",
            "hasil_konseling",
            "catatan_guru_bk",
            "catatan_siswa",
            "tgl_selesai",
          ],
        },
      ],
      order: [["tgl_pengajuan", "DESC"]],
    });

    const formatted = riwayat.map((k) => ({
      id_konseling: k.id,
      topik_konseling: k.topik_konseling,
      jenis_sesi: k.jenis_sesi,
      status: k.status,
      tgl_pengajuan: k.tgl_pengajuan,
      guru_bk: {
        id: k.guru_bk?.id,
        nama: k.guru_bk?.nama,
      },
      detail_konseling: k.detail_konseling
        ? {
            tgl_sesi: k.detail_konseling.tgl_sesi,
            jam_sesi: k.detail_konseling.jam_sesi,
            link_atau_ruang: k.detail_konseling.link_atau_ruang,
            balasan_untuk_siswa: k.detail_konseling.balasan_untuk_siswa,
            hasil_konseling: k.detail_konseling.hasil_konseling,
            catatan_siswa: k.detail_konseling.catatan_siswa,
            tgl_selesai: k.detail_konseling.tgl_selesai,
          }
        : null,
    }));

    res.status(200).json({
      status: "Success",
      message: "Riwayat semua pengajuan konseling berhasil diambil",
      isSuccess: true,
      data: formatted,
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
  markKonselingAsCompleted,
  getRiwayatKonselingSiswa,
};
