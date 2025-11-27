'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing discussions
    const discussions = await queryInterface.sequelize.query(
      `SELECT d.id_diskusi, d.id_pembuat 
       FROM diskusi d 
       ORDER BY d.tgl_post DESC`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Get users (both students and teachers)
    const users = await queryInterface.sequelize.query(
      `SELECT u.id, u.role, 
              COALESCE(g.nama, s.nama_lengkap) as name
       FROM users u
       LEFT JOIN guru_bks g ON u.role = 'guru_bk' AND u.id_ref = g.id
       LEFT JOIN siswas s ON u.role = 'siswa' AND u.id_ref = s.id
       WHERE u.role IN ('siswa', 'guru_bk')
       ORDER BY u.role, u.id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (discussions.length === 0 || users.length === 0) {
      console.log('No discussions or users found. Skipping diskusi_balasan seeder.');
      return;
    }

    const now = new Date();
    const replies = [
      // Replies to first discussion (Masalah Belajar)
      {
        id_diskusi: discussions[0].id_diskusi,
        id_user: users.find(u => u.role === 'siswa' && u.name === 'Nata')?.id || users[0].id,
        isi_balasan: 'Saya sering kesulitan untuk konsentrasi saat belajar. Apa ada tips dari BK untuk mengatasi masalah ini?',
        is_anonim: false,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour after post
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3600000)
      },
      {
        id_diskusi: discussions[0].id_diskusi,
        id_user: users.find(u => u.role === 'guru_bk' && u.name === 'Bu Sarah')?.id || users[1].id,
        isi_balasan: 'Untuk hafalan, coba gunakan teknik mind mapping atau buat singkatan yang mudah diingat. Jangan lupa untuk sering mengulang dan mengajarkan ke teman untuk memperkuat memori.',
        is_anonim: false,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 7200000), // 2 hours after post
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 7200000)
      },
      {
        id_diskusi: discussions[0].id_diskusi,
        id_user: users.find(u => u.role === 'siswa' && u.name === 'Lina Marlina')?.id || users[2].id,
        isi_balasan: 'Saya juga mengalami hal yang serupa. Musik klasik memang membantu saya fokus better!',
        is_anonim: true, // Anonymous reply
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 10800000), // 3 hours after post
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 10800000)
      },

      // Replies to second discussion (Manajemen Waktu)
      {
        id_diskusi: discussions[1].id_diskusi,
        id_user: users.find(u => u.role === 'guru_bk' && u.name === 'Bu Fara')?.id || users[1].id,
        isi_balasan: 'Coba buat jadwal harian dan prioritaskan tugas berdasarkan tenggat waktu. Jangan lupa sisihkan waktu untuk istirahat yang cukup ya!',
        is_anonim: false,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour after post
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000)
      },
      {
        id_diskusi: discussions[1].id_diskusi,
        id_user: users.find(u => u.role === 'siswa' && u.name === 'Andre Saputra')?.id || users[3].id,
        isi_balasan: 'Aku juga pakai aplikasi Todoist untuk mengatur jadwal. Sangat membantu untuk memprioritaskan tugas!',
        is_anonim: false,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 7200000), // 2 hours after post
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 7200000)
      },

      // Reply to third discussion (Prestasi Akademik)
      {
        id_diskusi: discussions[2].id_diskusi,
        id_user: users.find(u => u.role === 'siswa' && u.name === 'Rizky Pratama')?.id || users[4].id,
        isi_balasan: 'Saya ingin tahu lebih banyak tentang prestasi akademik yang bisa diraih. Ada saran untuk memotivasi diri?',
        is_anonim: false,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 3600000), // 1 hour after post
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 3600000)
      }
    ];

    // Filter out any replies with undefined user IDs
    const validReplies = replies.filter(reply => reply.id_user);
    
    if (validReplies.length > 0) {
      await queryInterface.bulkInsert('diskusi_balasan', validReplies, {});
    }

    // Update jumlah_balasan in diskusi table
    await queryInterface.sequelize.query(
      `UPDATE diskusi 
       SET jumlah_balasan = (
         SELECT COUNT(*) 
         FROM diskusi_balasan 
         WHERE diskusi_balasan.id_diskusi = diskusi.id_diskusi
       )`
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diskusi_balasan', null, {});
  }
};
