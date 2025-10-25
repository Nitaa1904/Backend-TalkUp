const { diskusi_balasan: DiskusiBalasanModel, users: UsersModel, diskusi: DiskusiModel } = require('../models');

const createBalasan = async (req, res, next) => {
  try {
    const { id_diskusi, isi_balasan, is_anonim } = req.body;
    
    if (!id_diskusi || !isi_balasan) {
      return res.status(400).json({ message: 'id_diskusi dan isi_balasan wajib diisi' });
    }

    // Check if the discussion exists
    const diskusi = await DiskusiModel.findOne({ where: { id_diskusi } });
    if (!diskusi) {
      return res.status(404).json({ message: 'Diskusi tidak ditemukan' });
    }

    const userId = req.user.id_user;
    const newBalasan = await DiskusiBalasanModel.create({
      id_diskusi,
      id_user: userId,
      isi_balasan,
      is_anonim: !!is_anonim
    });

    // Update the reply count in the diskusi table
    await DiskusiModel.increment('jumlah_balasan', {
      where: { id_diskusi }
    });

    // Get the created reply with user details
    const createdBalasan = await DiskusiBalasanModel.findOne({ where: { id_balasan: newBalasan.id_balasan } }, {
      include: [
        {
          model: UsersModel,
          as: 'user',
          attributes: ['id_user', 'id_ref', 'role', 'email'],
          include: [
            { model: require('../models').siswa, as: 'siswa', attributes: ['id', 'nama_lengkap'] },
            { model: require('../models').guru_bk, as: 'guru_bk', attributes: ['id', 'nama', 'jabatan'] }
          ]
        }
      ]
    });

    // Transform the response to handle anonymity
    const response = createdBalasan.toJSON();
    if (response.user) {
      // Prepare user object
      response.user = {
        id_user: response.user.id_user || response.user.id || null,
        id_ref: response.user.id_ref || null,
        role: response.user.role || null,
        email: response.user.email || null
      };

      // Attach user details based on role
      if (createdBalasan.user.role === 'siswa' && createdBalasan.user.siswa) {
        response.user_detail = {
          id: createdBalasan.user.siswa.id || null,
          nama: createdBalasan.user.siswa.nama_lengkap || null,
          jabatan: null
        };
      } else if (createdBalasan.user.role === 'guru_bk' && createdBalasan.user.guru_bk) {
        response.user_detail = {
          id: createdBalasan.user.guru_bk.id || null,
          nama: createdBalasan.user.guru_bk.nama || null,
          jabatan: createdBalasan.user.guru_bk.jabatan || null
        };
      } else {
        response.user_detail = null;
      }
    }

    // Handle anonymity
    if (response.is_anonim) {
      response.user = 'Pengguna anonim';
      response.user_detail = 'Pengguna anonim';
    }

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

const getBalasanByDiskusiId = async (req, res, next) => {
  try {
    const { diskusiId: id_diskusi } = req.params;
    
    // Check if the discussion exists
    const diskusi = await DiskusiModel.findOne({ where: { id_diskusi } });
    if (!diskusi) {
      return res.status(404).json({ message: 'Diskusi tidak ditemukan' });
    }

    // Get pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 25));
    const offset = (page - 1) * limit;

    // Get total count of replies for this discussion
    const totalData = await DiskusiBalasanModel.count({
      where: { id_diskusi }
    });
    const totalPages = Math.max(1, Math.ceil(totalData / limit));

    const { count, rows: list } = await DiskusiBalasanModel.findAndCountAll({
      where: { id_diskusi },
      offset,
      limit,
      order: [['created_at', 'ASC']],
      include: [
        {
          model: UsersModel,
          as: 'user',
          attributes: ['id', 'id_ref', 'role', 'email'],
          include: [
            { model: require('../models').siswa, as: 'siswa', attributes: ['id', 'nama_lengkap'] },
            { model: require('../models').guru_bk, as: 'guru_bk', attributes: ['id', 'nama', 'jabatan'] }
          ]
        }
      ]
    });

    // Transform the response to handle anonymity
    const data = list.map((balasan) => {
      const obj = balasan.toJSON();
      
      if (obj.user) {
        // Prepare user object
        obj.user = {
          id: obj.user.id || null,
          id_ref: obj.user.id_ref || null,
          role: obj.user.role || null,
          email: obj.user.email || null
        };

        // Attach user details based on role
        if (balasan.user.role === 'siswa' && balasan.user.siswa) {
          obj.user_detail = {
            id: balasan.user.siswa.id || null,
            nama: balasan.user.siswa.nama_lengkap || null,
            jabatan: null
          };
        } else if (balasan.user.role === 'guru_bk' && balasan.user.guru_bk) {
          obj.user_detail = {
            id: balasan.user.guru_bk.id || null,
            nama: balasan.user.guru_bk.nama || null,
            jabatan: balasan.user.guru_bk.jabatan || null
          };
        } else {
          obj.user_detail = null;
        }
      }

      // Handle anonymity
      if (obj.is_anonim) {
        obj.user = 'Pengguna anonim';
        obj.user_detail = 'Pengguna anonim';
      }

      return obj;
    });

    return res.status(200).json({
      data,
      page,
      limit,
      totalData,
      totalPages
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBalasan,
  getBalasanByDiskusiId
};
