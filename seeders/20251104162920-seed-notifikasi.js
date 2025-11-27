"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("notifikasi", [
      {
        id_siswa: 1,
        pesan: "Halo! Pengajuan konseling kamu telah disetujui oleh Guru BK.",
        status: "belum_dibaca",
        waktu: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_siswa: 2,
        pesan: "Sesi konseling kamu dijadwalkan besok pukul 09.00.",
        status: "belum_dibaca",
        waktu: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
