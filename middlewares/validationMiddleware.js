const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Failed",
      message: "Validasi input gagal",
      isSuccess: false,
      errors: errors.array().map((err) => err.msg),
      data: null,
    });
  }
  next();
};

module.exports = validationMiddleware;
