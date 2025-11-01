'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diskusi_balasan', {
      id_balasan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_diskusi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'diskusi',
          key: 'id_diskusi'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isi_balasan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_anonim: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Add indexes
    await queryInterface.addIndex('diskusi_balasan', ['id_diskusi']);
    await queryInterface.addIndex('diskusi_balasan', ['id_user']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('diskusi_balasan');
  }
};