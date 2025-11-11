const { Konseling, DetailKonseling, siswa, Sequelize } = require("../models");

const getDashboardGuru = async (req, res, next) => {
  try {
    // Validate that the user is a guru_bk
    if (req.user.role !== "guru_bk") {
      const err = new Error("Akses ditolak. Hanya guru BK yang dapat mengakses dashboard ini.");
      err.statusCode = 403;
      throw err;
    }

    const guruBkId = req.user.id_ref;
    if (!guruBkId) {
      const err = new Error("Token tidak valid, id_ref guru BK tidak ditemukan");
      err.statusCode = 400;
      throw err;
    }

    // Use Promise.all to run both queries in parallel for better performance
    const [jadwalMendatang, pengajuanMenunggu] = await Promise.all([
      // Query for upcoming schedules (approved counseling with future dates)
      Konseling.findAll({
        where: {
          id_guru_bk: guruBkId,
          status: "Disetujui",
        },
        include: [
          {
            model: siswa,
            as: "siswa",
            attributes: ["nama_lengkap", "kelas"],
          },
          {
            model: DetailKonseling,
            as: "detail_konseling",
            where: {
              tgl_sesi: {
                [Sequelize.Op.gte]: new Date(), // Changed from gt to gte (greater than or equal)
              },
            },
            attributes: ["tgl_sesi", "link_atau_ruang"],
            required: true, // This ensures we only get records with detail_konseling
          },
        ],
        attributes: ["id", "topik_konseling"],
        limit: 5,
        order: [
          [{ model: DetailKonseling, as: "detail_konseling" }, "tgl_sesi", "ASC"],
        ],
      }),

      // Query for pending applications
      Konseling.findAll({
        where: {
          id_guru_bk: guruBkId,
          status: "Menunggu",
        },
        include: [
          {
            model: siswa,
            as: "siswa",
            attributes: ["nama_lengkap", "kelas"],
          },
        ],
        attributes: ["id", "tgl_pengajuan", "topik_konseling", "status"],
        limit: 5,
        order: [["id", "DESC"]],
      }),
    ]);

    // Format the response data for jadwal_mendatang
    const formattedJadwalMendatang = jadwalMendatang.map((item) => ({
      id: item.id,
      tgl_konseling: item.detail_konseling.tgl_sesi,
      topik_konseling: item.topik_konseling,
      siswa: {
        nama_lengkap: item.siswa.nama_lengkap,
      },
      detail_konseling: {
        jenis_sesi_final: item.detail_konseling.link_atau_ruang?.includes("http")
          ? "Online"
          : "Offline",
      },
    }));

    // Format the response data for pengajuan_menunggu
    const formattedPengajuanMenunggu = pengajuanMenunggu.map((item) => ({
      id: item.id,
      tgl_pengajuan: item.tgl_pengajuan,
      topik_konseling: item.topik_konseling,
      status: item.status,
      siswa: {
        nama_lengkap: item.siswa.nama_lengkap,
      },
    }));

    res.status(200).json({
      status: "Success",
      message: "Data dashboard berhasil diambil",
      data: {
        jadwal_mendatang: formattedJadwalMendatang,
        pengajuan_menunggu: formattedPengajuanMenunggu,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardGuru,
};