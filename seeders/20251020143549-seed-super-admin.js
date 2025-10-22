"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashed = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id_ref: null,
          role: "super_admin",
          email: "admin@talkup.id",
          password: hashed,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { role: "super_admin" }, {});
  },
};
