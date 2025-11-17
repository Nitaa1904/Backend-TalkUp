const express = require("express");
const router = express.Router();
const konselingController = require("../controllers/konselingController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");

router.post(
  "/",
  verifyToken,
  verifyRole("siswa"),
  [
    check("jenis_sesi")
      .notEmpty()
      .withMessage("Jenis sesi wajib diisi")
      .isIn(["Online", "Offline"])
      .withMessage("Jenis sesi hanya boleh 'Online' atau 'Offline'"),
    check("topik_konseling")
      .notEmpty()
      .withMessage("Topik konseling wajib diisi")
      .isIn(["Pribadi", "Sosial", "Belajar", "Karir"])
      .withMessage("Topik tidak valid"),
    check("deskripsi_masalah")
      .notEmpty()
      .withMessage("Deskripsi masalah wajib diisi"),
  ],
  validationMiddleware,
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Siswa Buat permintaan konseling'
  #swagger.description = 'Endpoint untuk siswa membuat permintaan konseling.'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
          jenis_sesi: "Online",
          topik_konseling: "Belajar",
          deskripsi_masalah: "Saya kesulitan fokus belajar di rumah."
      },
      description: 'Masukkan detail permintaan konseling. Field id_guru_bk tidak perlu dikirim (otomatis).'
  }
  */
  konselingController.createKonseling
);

router.get(
  "/jadwal",
  verifyToken,
  verifyRole("guru_bk"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Daftar Jadwal Konseling Mendatang (Guru BK)'
  #swagger.description = `
    Endpoint ini digunakan oleh Guru BK untuk melihat daftar lengkap jadwal konseling
    yang telah disetujui dan memiliki tanggal sesi di masa depan (tgl_konseling > NOW).
    Data ini digunakan pada halaman "Jadwal Konseling" di frontend Guru BK.
  `
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.responses[200] = {
      description: 'Daftar jadwal konseling mendatang berhasil diambil.',
      schema: {
        status: "Success",
        message: "Daftar jadwal konseling mendatang berhasil diambil",
        data: [
          {
            id: 12,
            topik_konseling: "Kedisiplinan",
            status: "Disetujui",
            id_siswa: 5,
            siswa: {
              nama_lengkap: "Rafi Pratama",
              kelas: "XI RPL 2"
            },
            detail_konseling: {
              tgl_konseling: "2025-11-12",
              jam_sesi: "09:00",
              jenis_sesi_final: "Offline",
              link_atau_ruang: "Ruang BK Lt.2"
            }
          }
        ]
      }
  }
  #swagger.responses[404] = {
      description: 'Tidak ada jadwal konseling mendatang yang ditemukan.'
  }
  */
  konselingController.getJadwalKonseling
);

router.get(
  "/riwayat",
  verifyToken,
  verifyRole("siswa", "guru_bk"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Riwayat Konseling'
  #swagger.description = `
    Mengambil seluruh konseling berstatus <b>Selesai</b>.<br>
    • Siswa: hanya melihat riwayat miliknya.<br>
    • Guru BK: hanya melihat riwayat bimbingan.<br><br>
    Dapat difilter berdasarkan bulan, tahun, dan topik.
  `
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['month'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['year'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['topik'] = { in: 'query', required: false, type: 'string' }
  #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', required: false, type: 'integer' }
  #swagger.responses[200] = { description: 'Data riwayat berhasil diambil' }
  */
  konselingController.getRiwayatKonseling
);

router.get(
  "/guru/:id_guru_bk",
  verifyToken,
  verifyRole("guru_bk"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Daftar Pengajuan Konseling Siswa'
  #swagger.description = `
    Endpoint ini digunakan oleh Guru BK untuk melihat daftar pengajuan konseling 
    dari siswa bimbingannya yang masih berstatus "Menunggu".
    Setiap data mencakup informasi siswa dan deskripsi masalah yang diajukan.
  `
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id_guru_bk'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID Guru BK yang ingin melihat daftar pengajuan konseling'
  }
  #swagger.responses[200] = {
      description: 'Berhasil menampilkan daftar pengajuan konseling siswa dengan status "Menunggu".',
      schema: {
        success: true,
        message: "Daftar pengajuan konseling ditemukan",
        data: [
          {
            id: 1,
            id_siswa: 5,
            nama_siswa: "Nita Fitrotul Mar’ah",
            kelas: "XII RPL 2",
            tanggal_pengajuan: "2025-11-10T08:30:00.000Z",
            deskripsi_masalah: "Merasa stres menjelang ujian akhir.",
            status: "Menunggu"
          },
          {
            id: 2,
            id_siswa: 6,
            nama_siswa: "Wahyu Ramadhan",
            kelas: "XI TKJ 1",
            tanggal_pengajuan: "2025-11-09T14:00:00.000Z",
            deskripsi_masalah: "Kesulitan beradaptasi di lingkungan sekolah.",
            status: "Menunggu"
          }
        ]
      }
  }
  #swagger.responses[404] = {
      description: 'Tidak ada pengajuan konseling yang ditemukan untuk Guru BK ini.'
  }
  */
  konselingController.getKonselingByGuruBk
);

router.put(
  "/:id",
  verifyToken,
  verifyRole("guru_bk"),
  [
    check("status")
      .notEmpty()
      .withMessage("Status wajib diisi")
      .isIn(["Disetujui", "Ditolak"])
      .withMessage("Status tidak sesuai"),
    check("tgl_sesi")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Format tanggal tidak valid (YYYY-MM-DD)"),
    check("jam_sesi")
      .optional({ checkFalsy: true })
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Format jam tidak valid (HH:mm)"),
    check("link_atau_ruang")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Link atau ruang harus berupa teks"),
    check("balasan_untuk_siswa")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Balasan untuk siswa harus berupa teks"),
    check("catatan_guru_bk")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Catatan guru BK harus berupa teks"),
  ],
  validationMiddleware,
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Update status konseling oleh Guru BK'
  #swagger.description = 'Endpoint untuk Guru BK mengubah persetujuan pengajuan konseling. Jika disetujui, akan otomatis membuat entry di tabel detail_konseling.'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID Konseling'
  }
  #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
          "status": "Disetujui",
              "tgl_sesi": "2025-11-10",
              "jam_sesi": "09:30",
              "link_atau_ruang": "Ruang BK Lt.2",
              "balasan_untuk_siswa": "Silakan hadir tepat waktu ya!",
              "catatan_guru_bk": "Perhatikan masalah kedisiplinan siswa."
      },
      description: 'Status pengajuan konseling'
  }
  */
  konselingController.updateStatusKonseling
);

router.get(
  "/:id_konseling",
  verifyToken,
  verifyRole(["siswa", "guru_bk"]),
  validationMiddleware,
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Detail Pengajuan Konseling'
  #swagger.description = 'Endpoint untuk mengambil detail lengkap satu pengajuan konseling berdasarkan id_konseling. Endpoint ini digunakan baik oleh siswa maupun guru BK, dengan data dan akses yang menyesuaikan peran pengguna.'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id_konseling'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID Konseling'
  }
  #swagger.responses[200] = {
      description: 'Berhasil menampilkan detail pengajuan konseling',
      schema: {
        status: "Success",
        message: "Detail pengajuan berhasil diambil",
        data: {
          id_konseling: 10,
          status: "Disetujui",
          tgl_pengajuan: "2025-10-15T07:00:00.000Z",
          topik_konseling: "Karir",
          jenis_sesi_pengajuan: "Online",
          deskripsi_masalah: "Lorem ipsum dolor sit amet...",
          siswa: {
            nama: "Nadia Putri Rahmaniar",
            kelas: "XI TKJ 4"
          },
          guru_bk: {
            nama: "Guru BK SMK Telkom"
          },
          detail_konseling: {
            tgl_konseling: "2025-10-20T09:00:00.000Z",
            waktu_mulai: "10:00",
            waktu_selesai: "11:00",
            jenis_sesi_final: "Online",
            link_sesi: "https://meet.google.com/xyz",
            deskripsi_jadwal: "Silakan hadir tepat waktu.",
            hasil_konseling: null,
            catatan_guru_bk: null
          }
        }
      }
  }
  #swagger.responses[403] = {
      description: 'Akses ditolak'
  }
  #swagger.responses[404] = {
      description: 'Data konseling tidak ditemukan'
  }
  */
  konselingController.getDetailKonseling
);

router.put(
  "/:id/selesai",
  verifyToken,
  verifyRole("guru_bk"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Guru BK Menyelesaikan Sesi Konseling'
  #swagger.description = `
    Endpoint ini digunakan oleh Guru BK untuk menandai sesi konseling sebagai "Selesai".<br>
    Hanya konseling yang sudah berstatus <b>Disetujui</b> yang dapat diselesaikan.<br><br>
    Endpoint ini juga menyimpan hasil konseling, catatan guru BK, catatan siswa,
    dan otomatis menambahkan tanggal selesai.
  `
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID Konseling yang akan ditandai selesai'
  }
  #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
          hasil_konseling: "Siswa memahami strategi manajemen stres.",
          catatan_guru_bk: "Siswa perlu mempraktikkan teknik relaksasi setiap hari.",
          catatan_siswa: "Saya merasa lebih tenang setelah sesi."
      },
      description: 'Data akhir sesi konseling'
  }
  #swagger.responses[200] = {
      description: 'Sesi konseling berhasil diselesaikan.',
      schema: {
          status: "Success",
          message: "Sesi konseling berhasil diselesaikan",
          isSuccess: true,
          data: {
            id_konseling: 10,
            status: "Selesai",
            detail_konseling: {
              hasil_konseling: "Siswa memahami strategi manajemen stres.",
              catatan_guru_bk: "Lanjutkan pemantauan perkembangan siswa.",
              catatan_siswa: "Saya merasa lebih terbantu.",
              tgl_selesai: "2025-11-15T10:00:00.000Z"
            }
          }
      }
  }
  #swagger.responses[400] = {
      description: 'Konseling belum disetujui sehingga tidak bisa diselesaikan.'
  }
  #swagger.responses[403] = {
      description: 'Guru BK tidak memiliki akses untuk menyelesaikan konseling ini.'
  }
  #swagger.responses[404] = {
      description: 'Data konseling tidak ditemukan.'
  }
  */
  konselingController.markKonselingAsCompleted
);

router.get(
  "/riwayat",
  verifyToken,
  verifyRole("siswa", "guru_bk"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Riwayat Konseling'
  #swagger.description = `
    Mengambil seluruh konseling berstatus <b>Selesai</b>.<br>
    • Siswa: hanya melihat riwayat miliknya.<br>
    • Guru BK: hanya melihat riwayat bimbingan.<br><br>
    Dapat difilter berdasarkan bulan, tahun, dan topik.
  `
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['month'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['year'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['topik'] = { in: 'query', required: false, type: 'string' }
  #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', required: false, type: 'integer' }
  #swagger.responses[200] = { description: 'Data riwayat berhasil diambil' }
  */
  konselingController.getRiwayatKonseling
);

module.exports = router;
