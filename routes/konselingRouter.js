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
  "/",
  verifyToken,
  verifyRole("siswa"),
  /*
  #swagger.tags = ['Konseling']
  #swagger.summary = 'Tampilkan riwayat konseling siswa'
  #swagger.description = 'Endpoint untuk siswa melihat riwayat pengajuan konseling miliknya sendiri.'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Nomor halaman (default: 1)'
  }
  #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'Jumlah data per halaman (default: 5)'
  }
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

module.exports = router;
