"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("siswas", "guruBkId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "guru_bks",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("siswas", "guruBkId");
  },
};
