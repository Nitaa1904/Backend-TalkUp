'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('konseling', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_siswa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'siswas', // Nama tabel referensi
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_guru_bk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'guru_bks', // Nama tabel referensi
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jenis_sesi: {
        type: Sequelize.ENUM('Online', 'Offline'),
        allowNull: false
      },
      topik_konseling: {
        type: Sequelize.ENUM('Pribadi', 'Sosial', 'Belajar', 'Karir'),
        allowNull: false
      },
      deskripsi_masalah: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Menunggu', 'Disetujui', 'Selesai'),
        allowNull: false,
        defaultValue: 'Menunggu'
      },
      tgl_pengajuan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('konseling');
  }
};
