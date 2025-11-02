'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing siswa and guru_bk data
    const siswa = await queryInterface.sequelize.query(
      `SELECT s.id, s.nama_lengkap, s."guruBkId"
       FROM siswas s 
       ORDER BY s.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const guruBk = await queryInterface.sequelize.query(
      `SELECT g.id, g.nama 
       FROM guru_bks g 
       ORDER BY g.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (siswa.length === 0 || guruBk.length === 0) {
      console.log('No siswa or guru_bk found. Skipping konseling seeder.');
      return;
    }

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const konselingData = [
      // Konseling untuk Nata dengan Bu Fara (status: Selesai)
      {
        id_siswa: siswa[0].id, // Nata
        id_guru_bk: guruBk[0].id, // Bu Fara
        jenis_sesi: 'Offline',
        topik_konseling: 'Belajar',
        deskripsi_masalah: 'Saya kesulitan memahami materi pemrograman web, terutama konsep JavaScript yang asynchronous. Saya sering bingung dengan callback, promise, dan async/await.',
        status: 'Selesai',
        tgl_pengajuan: threeDaysAgo,
      },
      // Konseling untuk Wahyu Adi dengan Bu Fara (status: Disetujui)
      {
        id_siswa: siswa[1].id, // Wahyu Adi
        id_guru_bk: guruBk[0].id, // Bu Fara
        jenis_sesi: 'Online',
        topik_konseling: 'Karir',
        deskripsi_masalah: 'Saya bingung ingin melanjutkan kuliah jurusan apa setelah lulus dari SMK. Saya tertarik di bidang IT tapi tidak tahu pilihan yang tepat untuk karir saya.',
        status: 'Disetujui',
        tgl_pengajuan: twoDaysAgo
      },
      // Konseling untuk Lina Marlina dengan Bu Sarah (status: Menunggu)
      {
        id_siswa: siswa[2].id, // Lina Marlina
        id_guru_bk: guruBk[1].id, // Bu Sarah
        jenis_sesi: 'Online',
        topik_konseling: 'Pribadi',
        deskripsi_masalah: 'Saya merasa cemas dan tertekan dengan tugas-tugas sekolah yang menumpuk. Saya sulit mengatur waktu dan sering merasa overwhelmed.',
        status: 'Menunggu',
        tgl_pengajuan: yesterday
      },
      // Konseling untuk Andre Saputra dengan Bu Sarah (status: Menunggu)
      {
        id_siswa: siswa[3].id, // Andre Saputra
        id_guru_bk: guruBk[1].id, // Bu Sarah
        jenis_sesi: 'Offline',
        topik_konseling: 'Sosial',
        deskripsi_masalah: 'Saya kesulitan berinteraksi dengan teman-teman baru. Saya merasa canggung dan tidak percaya diri saat harus berbicara di depan banyak orang.',
        status: 'Menunggu',
        tgl_pengajuan: now
      },
      // Konseling untuk Ayu Rahmawati dengan Pak Dimas (status: Disetujui)
      {
        id_siswa: siswa[4].id, // Ayu Rahmawati
        id_guru_bk: guruBk[2].id, // Pak Dimas
        jenis_sesi: 'Offline',
        topik_konseling: 'Belajar',
        deskripsi_masalah: 'Saya mengalami kesulitan dalam mata pelajaran matematika, khususnya pada materi trigonometri. Saya tidak bisa memahami konsep sinus, cosinus, dan tangen.',
        status: 'Disetujui',
        tgl_pengajuan: yesterday
      },
      // Konseling untuk Rizky Pratama dengan Pak Dimas (status: Menunggu)
      {
        id_siswa: siswa[5].id, // Rizky Pratama
        id_guru_bk: guruBk[2].id, // Pak Dimas
        jenis_sesi: 'Online',
        topik_konseling: 'Karir',
        deskripsi_masalah: 'Saya ingin tahu lebih banyak tentang peluang kerja di bidang multimedia. Apa saja skill yang perlu saya kuasai untuk bisa bersaing di industri kreatif?',
        status: 'Menunggu',
        tgl_pengajuan: now
      }
    ];

    await queryInterface.bulkInsert('konseling', konselingData);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('konseling', null, {});
  }
};