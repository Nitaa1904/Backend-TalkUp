'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Get existing konseling data
    const konseling = await queryInterface.sequelize.query(
      `SELECT k.id, k.status, k.jenis_sesi,
              s.nama_lengkap as siswa_nama,
              g.nama as guru_bk_nama
       FROM konseling k
       JOIN siswas s ON k.id_siswa = s.id
       JOIN guru_bks g ON k.id_guru_bk = g.id
       ORDER BY k.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (konseling.length === 0) {
      console.log('No konseling found. Skipping detail_konseling seeder.');
      return;
    }

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const detailKonselingData = [
      // Detail untuk konseling pertama (status: Selesai)
      {
        id_konseling: konseling[0].id, // Nata dengan Bu Fara
        tgl_sesi: new Date(threeDaysAgo.getTime() + 4 * 60 * 60 * 1000), // 4 hours after submission
        jam_sesi: '10.00-11.00',
        link_atau_ruang: 'Ruang BK Lantai 2',
        balasan_untuk_siswa: 'Hai Nata, terima kasih sudah mengajukan konseling. Untuk masalah pemrograman JavaScript, kita akan bahas konsep asynchronous secara bertahap. Siapkan laptop dan contoh kode yang sudah kamu coba ya.',
        catatan_guru_bk: 'Siswa menunjukkan kesulitan dalam memahami konsep asynchronous programming. Perlu diberikan penjelasan konseptual dan praktik langsung dengan contoh sederhana. Follow up diperlukan untuk memastikan pemahaman.',
        createdAt: new Date(threeDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        updatedAt: new Date(threeDaysAgo.getTime() + 4 * 60 * 60 * 1000)
      },
      // Detail untuk konseling kedua (status: Disetujui)
      {
        id_konseling: konseling[1].id, // Wahyu Adi dengan Bu Fara
        tgl_sesi: tomorrow,
        jam_sesi: '13.00-14.00',
        link_atau_ruang: 'https://meet.google.com/abc-defg-hij',
        balasan_untuk_siswa: 'Hai Wahyu, konseling karir kamu sudah disetujui. Kita akan bahas pilihan jurusan kuliah di bidang IT dan prospek karirnya. Siapkan pertanyaan yang ingin kamu tanyakan ya.',
        catatan_guru_bk: 'Siswa perlu dibantu untuk eksplorasi minat dan bakat di bidang IT. Perlu dipersiapkan informasi tentang berbagai jurusan dan prospek kerja.',
        createdAt: new Date(twoDaysAgo.getTime() + 3 * 60 * 60 * 1000),
        updatedAt: new Date(twoDaysAgo.getTime() + 3 * 60 * 60 * 1000)
      },
      // Detail untuk konseling ketiga (status: Menunggu - belum ada detail)
      // Tidak ada data detail karena status masih Menunggu
      
      // Detail untuk konseling keempat (status: Menunggu - belum ada detail)
      // Tidak ada data detail karena status masih Menunggu
      
      // Detail untuk konseling kelima (status: Disetujui)
      {
        id_konseling: konseling[4].id, // Ayu Rahmawati dengan Pak Dimas
        tgl_sesi: dayAfterTomorrow,
        jam_sesi: '09.00-10.00',
        link_atau_ruang: 'Ruang BK Lantai 1',
        balasan_untuk_siswa: 'Hai Ayu, konseling untuk masalah matematika sudah disetujui. Kita akan fokus pada materi trigonometri. Bawa buku matematika dan soal-soal yang sulit kamu pahami ya.',
        catatan_guru_bk: 'Siswa mengalami kesulitan konsep dasar trigonometri. Perlu pendekatan visual dan praktik soal bertahap. Siapkan modul dan alat bantu pembelajaran.',
        createdAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000),
        updatedAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000)
      },
      // Detail untuk konseling keenam (status: Menunggu - belum ada detail)
      // Tidak ada data detail karena status masih Menunggu
    ];

    // Filter out entries with no data (for Menunggu status)
    const validDetailKonseling = detailKonselingData.filter(detail => detail.id_konseling);
    
    if (validDetailKonseling.length > 0) {
      await queryInterface.bulkInsert('detail_konseling', validDetailKonseling);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('detail_konseling', null, {});
  }
};