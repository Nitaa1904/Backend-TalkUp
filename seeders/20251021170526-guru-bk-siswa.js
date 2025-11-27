"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 🔹 Hash password default
    const hashPassword = async (plain) => await bcrypt.hash(plain, 10);

    // 1️⃣ Insert Guru BK
    const guruBks = await queryInterface.bulkInsert(
      "guru_bks",
      [
        {
          nama: "Bu Fara",
          jabatan: "Guru BK SMK Telkom",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Bu Sarah",
          jabatan: "Guru BK Kelas XI",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Pak Dimas",
          jabatan: "Guru BK Kelas X",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    // 2️⃣ Insert akun user untuk Guru BK
    const guruUsers = [
      {
        email: "fara@smktelkom.ac.id",
        password: await hashPassword("fara123"),
        role: "guru_bk",
        id_ref: guruBks[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "sarah@smktelkom.ac.id",
        password: await hashPassword("sarah123"),
        role: "guru_bk",
        id_ref: guruBks[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "dimas@smktelkom.ac.id",
        password: await hashPassword("dimas123"),
        role: "guru_bk",
        id_ref: guruBks[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("users", guruUsers);

    // 3️⃣ Insert siswa bimbingan
    const siswaData = await queryInterface.bulkInsert(
      "siswas",
      [
        // Bu Fitri
        {
          email_sekolah: "nata@smktelkom.sch.id",
          nama_lengkap: "Nata",
          kelas: "XII RPL 1",
          guruBkId: guruBks[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email_sekolah: "wahyu@smktelkom.sch.id",
          nama_lengkap: "Wahyu Adi",
          kelas: "XII RPL 1",
          guruBkId: guruBks[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Bu Siti
        {
          email_sekolah: "lina@smktelkom.sch.id",
          nama_lengkap: "Lina Marlina",
          kelas: "XI TKJ 2",
          guruBkId: guruBks[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email_sekolah: "andre@smktelkom.sch.id",
          nama_lengkap: "Andre Saputra",
          kelas: "XI TKJ 2",
          guruBkId: guruBks[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Pak Dimas
        {
          email_sekolah: "ayu@smktelkom.sch.id",
          nama_lengkap: "Ayu Rahmawati",
          kelas: "X MM 1",
          guruBkId: guruBks[2].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email_sekolah: "rizky@smktelkom.sch.id",
          nama_lengkap: "Rizky Pratama",
          kelas: "X MM 1",
          guruBkId: guruBks[2].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    // 4️⃣ Insert akun user untuk siswa
    const siswaUsers = [
      // Bu Fitri
      {
        email: "nita.siswa@talkup.id",
        password: await hashPassword("nita123"),
        role: "siswa",
        id_ref: siswaData[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "wahyu.siswa@talkup.id",
        password: await hashPassword("wahyu123"),
        role: "siswa",
        id_ref: siswaData[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Bu Siti
      {
        email: "lina.siswa@talkup.id",
        password: await hashPassword("lina123"),
        role: "siswa",
        id_ref: siswaData[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "andre.siswa@talkup.id",
        password: await hashPassword("andre123"),
        role: "siswa",
        id_ref: siswaData[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Pak Dimas
      {
        email: "ayu.siswa@talkup.id",
        password: await hashPassword("ayu123"),
        role: "siswa",
        id_ref: siswaData[4].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "rizky.siswa@talkup.id",
        password: await hashPassword("rizky123"),
        role: "siswa",
        id_ref: siswaData[5].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("users", siswaUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { role: "siswa" });
    await queryInterface.bulkDelete("users", { role: "guru_bk" });
    await queryInterface.bulkDelete("siswas", null, {});
    await queryInterface.bulkDelete("guru_bks", null, {});
  },
};
