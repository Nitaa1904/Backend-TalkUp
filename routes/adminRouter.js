const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const guruBkController = require("../controllers/guruBkController");
const siswaController = require("../controllers/siswaController");

router.post(
  "/add-guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  /* #swagger.tags = ['Super Admin']
      #swagger.summary = 'Tambah data guru BK'
      #swagger.description = 'Endpoint untuk menambah data Guru BK (hanya Super Admin).'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              nama : "string",
              email: "string",
              password: "string",
              jabatan: "string"
            },
            example: {
            {
              nama : "Budi Santoso",
              email: "budi@guru.com",
              password: "guru123",
              jabatan: "Guru BK Kelas XII"
            }
          }
        }
     }
  */
  adminController.addGuruBk
);

router.get(
  "/guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Lihat semua data guru BK'
  #swagger.security = [{ "bearerAuth": [] }] 
  */
  guruBkController.getAllGuruBk
);

router.get(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Lihat data guru BK berdasarkan ID'
  #swagger.parameters['id'] = { description: 'ID Guru BK', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  */
  guruBkController.getGuruBkById
);

router.put(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Perbarui data guru BK'
  #swagger.parameters['id'] = { description: 'ID Guru BK', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              nama : "string",
              email: "string",
              password: "string",
              jabatan: "string"
            },
            example: {
            {
              nama : "Budi Santoso",
              email: "budi@guru.com",
              password: "guru123",
              jabatan: "Guru BK Kelas XII"
            }
          }
        }
     }
  */
  guruBkController.updateGuruBk
);

router.delete(
  "/guru-bk/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Hapus data guru BK'
  #swagger.parameters['id'] = { description: 'ID Guru BK', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  */
  guruBkController.deleteGuruBk
);

router.post(
  "/add-siswa",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Tambah data siswa'
  #swagger.description = 'Endpoint untuk menambah data siswa (hanya Super Admin).'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              email_sekolah: "string",
              nama_lengkap: "string",
              kelas: "string",
              email: "string",
              password: "string",
              guruBkId: "integer"
            },
            example: {
              email_sekolah: "nita@smktelkom.sch.id",
              nama_lengkap: "Nita Lestari",
              kelas: "X TKJ 1",
              email: "nita@smktelkom.id",
              password: "nita123",
              guruBkId: 29
            }
          }
        }
     }
  */
  adminController.addSiswa
);

router.get(
  "/siswa",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Lihat semua data siswa'
  #swagger.security = [{ "bearerAuth": [] }]
  */
  siswaController.getAllSiswa
);

router.get(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Lihat data siswa berdasarkan ID'
  #swagger.parameters['id'] = { description: 'ID Siswa', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  */
  siswaController.getSiswaById
);

router.put(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Perbarui data siswa'
  #swagger.parameters['id'] = { description: 'ID Siswa', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              email_sekolah: "string",
              nama_lengkap: "string",
              kelas: "string",
              email: "string",
              password: "string",
              guruBkId: "integer"
            },
            example: {
              email_sekolah: "nita@smktelkom.sch.id",
              nama_lengkap: "Nita Lestari",
              kelas: "X TKJ 1",
              email: "nita@smktelkom.id",
              password: "nita123",
              guruBkId: 29
            }
          }
        }
     }
  */
  siswaController.updateSiswa
);

router.delete(
  "/siswa/:id",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Hapus data siswa'
  #swagger.parameters['id'] = { description: 'ID Siswa', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  */
  siswaController.deleteSiswa
);

router.get(
  "/users",
  verifyToken,
  verifyRole("super_admin"),
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Lihat semua pengguna (Super Admin)'
  #swagger.description = 'Endpoint untuk melihat semua user yang terdaftar di sistem.'
  #swagger.security = [{ "bearerAuth": [] }]
  */
  adminController.getAllUsers
);

module.exports = router;
