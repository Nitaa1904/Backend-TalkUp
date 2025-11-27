'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('detail_konseling', {
      id_detail: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_konseling: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'konseling',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tgl_sesi: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Tanggal dan waktu sesi disepakati (jika Status = Disetujui/Selesai)'
      },
      jam_sesi: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Waktu sesi disepakati (e.g., "10.00-11.00")'
      },
      link_atau_ruang: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Link meeting (Online) atau Ruang BK (Offline)'
      },
      catatan_siswa: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      balasan_untuk_siswa: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      catatan_guru_bk: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hasil_konseling: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tgl_selesai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_konseling');
  }
};