const { diskusi: DiskusiModel, users: UsersModel } = require('../models');

const createDiskusi = async (req, res, next) => {
  try {
    const { judul, konten, is_anonim } = req.body;
    
    const ref_id = req.user?.id_ref;
    if (!ref_id) {
      return res.status(401).json({
        status: "Failed",
        message: "Token tidak valid",
        isSuccess: false,
        data: null
      });
    }
    // Get user ID from users table based on id_ref
    const user = await UsersModel.findOne({
      where: { id_ref: ref_id }
    });
    
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "Failed",
        message: "user ID tidak ditemukan",
        isSuccess: false,
        data: null
      });
    }

    const newDiskusi = await DiskusiModel.create({
      id_pembuat: userId,
      judul: judul,
      konten: konten,
      is_anonim: !!is_anonim
    });

    return res.status(201).json({
      status: "Success",
      message: "Diskusi berhasil dibuat",
      isSuccess: true,
      data: newDiskusi
    });
  } catch (err) {
    next(err);
  }
};

const getAllDiskusi = async (req, res, next) => {
  try {
    // Get pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);  // Pastikan page minimal 1
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 25));  // Batasi max 50 item per halaman
    const offset = (page - 1) * limit;

    // Get total count of all records and calculate total pages
    const totalData = await DiskusiModel.count();
    const totalPages = Math.max(1, Math.ceil(totalData / limit));  // Minimal 1 halaman

    const { count, rows: list } = await DiskusiModel.findAndCountAll({
      offset,
      limit,
      order: [['id_diskusi', 'ASC']],
      include: [
        {
          model: UsersModel,
          as: 'pembuat',
          attributes: ['id', 'id_ref', 'role', 'email'],
          include: [
            { model: require('../models').siswa, as: 'siswa', attributes: ['id', 'nama_lengkap'] },
            { model: require('../models').guru_bk, as: 'guru_bk', attributes: ['id', 'nama', 'jabatan'] }
          ]
        }
      ]
    });

    // transform anonim view dan detail siswa/guru
    const data = list.map((d) => {
      const obj = d.toJSON();
      if (obj.pembuat) {
        // prepare minimal pembuat object (id, id_ref, role, email)
        obj.pembuat = {
          id_user: obj.pembuat.id_user || obj.pembuat.id || null,
          id_ref: obj.pembuat.id_ref || null,
          role: obj.pembuat.role || null,
          email: obj.pembuat.email || null
        };

        // attach pembuat_detail based on role
        if (d.pembuat && d.pembuat.role === 'siswa' && d.pembuat.siswa) {
          obj.pembuat_detail = {
            id: d.pembuat.siswa.id || d.pembuat.siswa.ID || null,
            nama: d.pembuat.siswa.nama_lengkap || null,
            jabatan: null
          };
        } else if (d.pembuat && d.pembuat.role === 'guru_bk' && d.pembuat.guru_bk) {
          obj.pembuat_detail = {
            id: d.pembuat.guru_bk.id || d.pembuat.guru_bk.ID || null,
            nama: d.pembuat.guru_bk.nama || null,
            jabatan: d.pembuat.guru_bk.jabatan || null
          };
        } else {
          obj.pembuat_detail = null;
        }
      }
      if (obj.is_anonim && obj.pembuat) {
        obj.pembuat = 'Pembuat anonim';
        obj.pembuat_detail = 'Pembuat anonim';
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

const getDiskusiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await DiskusiModel.findOne({
      where: { id_diskusi: id },
      order: [['id_diskusi', 'ASC']],
      include: [{
        model: UsersModel,
        as: 'pembuat',
  attributes: ['id', 'id_ref', 'role', 'email'],
        include: [
          { model: require('../models').siswa, as: 'siswa', attributes: ['id', 'nama_lengkap'] },
          { model: require('../models').guru_bk, as: 'guru_bk', attributes: ['id', 'nama', 'jabatan'] }
        ]
      }]
    });
    if (!found) return res.status(404).json({ message: 'Diskusi tidak ditemukan' });

    const obj = found.toJSON();
    if (obj.pembuat) {
      // keep only requested pembuat fields
      obj.pembuat = {
        id_user: obj.pembuat.id_user || obj.pembuat.id || null,
        id_ref: obj.pembuat.id_ref || null,
        role: obj.pembuat.role || null,
        email: obj.pembuat.email || null
      };

      if (found.pembuat && found.pembuat.role === 'siswa' && found.pembuat.siswa) {
        obj.pembuat_detail = {
          id: found.pembuat.siswa.id || null,
          nama: found.pembuat.siswa.nama_lengkap || null,
          jabatan: null
        };
      } else if (found.pembuat && found.pembuat.role === 'guru_bk' && found.pembuat.guru_bk) {
        obj.pembuat_detail = {
          id: found.pembuat.guru_bk.id || null,
          nama: found.pembuat.guru_bk.nama || null,
          jabatan: found.pembuat.guru_bk.jabatan || null
        };
      } else {
        obj.pembuat_detail = null;
      }
    }
    if (obj.is_anonim && obj.pembuat) {
      obj.pembuat = 'Pembuat anonim';
      obj.pembuat_detail = 'Pembuat anonim';
    }

    return res.status(200).json(obj);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDiskusi,
  getAllDiskusi,
  getDiskusiById
};