const { Notifikasi } = require("../models");

module.exports = {
  sendNotification: async (recipientEmail, message, idSiswa) => {
    console.log(`
==========================
📢 NOTIFIKASI KONSELING
==========================
Kepada : ${recipientEmail}
Pesan  : ${message}
Waktu  : ${new Date().toLocaleString("id-ID")}
==========================
    `);

    await Notifikasi.create({
      id_siswa: idSiswa,
      pesan: message,
    });
  },
};
