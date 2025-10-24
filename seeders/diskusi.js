'use strict';

module.exports = {
async up (queryInterface, Sequelize) {
        // Seed data sesuai dummy user
        const now = new Date();
        const seedData = [
            {
                id_pembuat: 2,
                topik: 'Masalah Belajar',
                isi_diskusi: 'tips dari BK',
                is_anonim: false,
                tgl_post: now,
                jumlah_balasan: 0
            },
            {
                id_pembuat: 8,
                topik: 'banyak tugas',
                isi_diskusi: 'bagaimana cara manage waktu',
                is_anonim: false,
                tgl_post: now,
                jumlah_balasan: 0
            },
            {
                id_pembuat: 3,
                topik: 'prestasi',
                isi_diskusi: 'apa prestasi yang dapat dicapai',
                is_anonim: false,
                tgl_post: now,
                jumlah_balasan: 0
            }
        ];

        await queryInterface.bulkInsert('diskusi', seedData);
},

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diskusi', null, {});
  }
};