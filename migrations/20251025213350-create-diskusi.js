'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diskusi', {
      id_diskusi: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_pembuat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      judul: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      konten: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_anonim: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tgl_post: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      jumlah_balasan: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await queryInterface.addIndex('diskusi', ['id_pembuat']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('diskusi');
  }
};
