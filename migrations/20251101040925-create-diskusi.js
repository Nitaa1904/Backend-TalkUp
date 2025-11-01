'use strict';

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
        onDelete: 'SET NULL'
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
        allowNull: false,
        defaultValue: false
      },
      tgl_post: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      jumlah_balasan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
      ,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('diskusi');
  }
};