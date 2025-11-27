const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");
const adminController = require("../controllers/adminController");
const guruBkController = require("../controllers/guruBkController");
const siswaController = require("../controllers/siswaController");

router.post(
  "/add-guru-bk",
  verifyToken,
  verifyRole("super_admin"),
  [
    check("nama").notEmpty().withMessage("Nama wajib diisi"),
    check("email").isEmail().withMessage("Email tidak valid"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    check("jabatan").notEmpty().withMessage("Jabatan wajib diisi"),
  ],
  validationMiddleware,
  /* #swagger.tags = ['Super Admin']
      #swagger.summary = 'Tambah data guru BK'
      #swagger.description = 'Endpoint untuk menambah data Guru BK (hanya Super Admin).'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data guru BK yang akan ditambahkan',
        required: true,
        schema: {
            nama : "Budi Santoso",
              email: "budi@guru.com",
              password: "guru123",
              jabatan: "Guru BK Kelas XII"
        }
      }
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
  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data guru BK yang akan diperbaharui',
        required: true,
        schema: {
            nama : "Budi Santoso",
              email: "budi@guru.com",
              password: "guru123",
              jabatan: "Guru BK Kelas XII"
        }
      }
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
  [
    check("email_sekolah").isEmail().withMessage("Email sekolah tidak valid"),
    check("nama_lengkap").notEmpty().withMessage("Nama lengkap wajib diisi"),
    check("kelas").notEmpty().withMessage("Kelas wajib diisi"),
    check("email").isEmail().withMessage("Email tidak valid"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    check("guruBkId").isInt().withMessage("guruBkId harus berupa angka"),
  ],
  validationMiddleware,
  /* 
    #swagger.tags = ['Super Admin']
    #swagger.summary = 'Tambah data siswa'
    #swagger.description = 'Endpoint untuk menambahkan data siswa (hanya Super Admin).'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'Data siswa yang akan ditambahkan',
      schema: {
        email_sekolah: "jiso@smktelkom.sch.id",
        nama_lengkap: "jisoo yaa",
        kelas: "X TIK 1",
        email: "jisoo@smktelkom.id",
        password: "jisoo123",
        guruBkId: 33
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
  [
    check("email_sekolah")
      .optional()
      .isEmail()
      .withMessage("Email sekolah tidak valid"),
    check("nama_lengkap")
      .optional()
      .notEmpty()
      .withMessage("Nama lengkap wajib diisi"),
    check("kelas").optional().notEmpty().withMessage("Kelas wajib diisi"),
    check("email").optional().isEmail().withMessage("Email tidak valid"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  validationMiddleware,
  /* 
  #swagger.tags = ['Super Admin']
  #swagger.summary = 'Perbarui data siswa'
  #swagger.parameters['id'] = { description: 'ID Siswa', required: true }
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data siswa yang akan diperbaharui',
        required: true,
        schema: {
            email_sekolah: "nita@smktelkom.sch.id",
              nama_lengkap: "Nita Lestari",
              kelas: "X TKJ 1",
              email: "nita@smktelkom.id",
              password: "nita123",
              guruBkId: 29
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
