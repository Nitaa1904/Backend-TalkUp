'use strict';

module.exports = {
async up (queryInterface, Sequelize) {
        // Ambil data user dari database
        const users = await queryInterface.sequelize.query(
            `SELECT id, role FROM users WHERE role IN ('guru_bk', 'siswa') ORDER BY RANDOM() LIMIT 3`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (users.length === 0) {
            console.log('No users found for seeding diskusi');
            return;
        }

        const now = new Date();
        const seedData = [
            {
                id_pembuat: users[0].id,
                judul: 'Masalah Belajar',
                konten: 'Saya sering kesulitan untuk konsentrasi saat belajar. Apa ada tips dari BK untuk mengatasi masalah ini?',
                is_anonim: false,
                tgl_post: now,
                jumlah_balasan: 0
            },
            {
                id_pembuat: users[1] ? users[1].id : users[0].id,
                judul: 'Manajemen Waktu',
                konten: 'Bagaimana cara mengatur waktu dengan efektif ketika banyak tugas dari sekolah? Saya merasa kewalahan.',
                is_anonim: true,
                tgl_post: new Date(now.getTime() - 3600000), // 1 hour ago
                jumlah_balasan: 0
            },
            {
                id_pembuat: users[2] ? users[2].id : users[0].id,
                judul: 'Prestasi Akademik',
                konten: 'Apa saja prestasi akademik yang bisa saya raih di sekolah? Saya ingin memotivasi diri untuk lebih baik.',
                is_anonim: false,
                tgl_post: new Date(now.getTime() - 7200000), // 2 hours ago
                jumlah_balasan: 0
            }
        ];

        await queryInterface.bulkInsert('diskusi', seedData);
},

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diskusi', null, {});
  }
};