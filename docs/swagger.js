const swaggerAutogen = require("swagger-autogen")({ autoHeaders: false });

const doc = {
  info: {
    title: "TalkUp API Documentation",
    description:
      "Dokumentasi otomatis API TalkUp (Super Admin, Guru BK, dan Siswa).",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  basePath: "/api/v1",
  swagger: "2.0",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Masukkan token JWT (format: Bearer <token>)",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Endpoint untuk autentikasi pengguna (login).",
    },
    {
      name: "Diskusi",
      description: "Fitur forum diskusi",
    },
    {
      name: "Diskusi Balasan",
      description: "Fitur balasan diskusi",
    },
    {
      name: "Guru BK",
      description: "Fitur untuk Guru BK (lihat siswa bimbingan).",
    },
    {
      name: "Konseling",
      description: "Fitur permintaan konseling oleh siswa",
    },
    {
      name: "Public",
      description: "Endpoint publik yang tidak membutuhkan autentikasi.",
    },
    {
      name: "Siswa",
      description: "Fitur untuk Siswa (lihat dan ubah profil sendiri).",
    },
    {
      name: "Super Admin",
      description: "Manajemen data Guru BK & Siswa oleh Super Admin.",
    }
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/index.js"];

swaggerAutogen(outputFile, routes, doc);
