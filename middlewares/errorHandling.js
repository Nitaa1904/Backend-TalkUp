const errorHandling = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  console.error(`
[❌ ERROR LOG]
Time     : ${timestamp}
Method   : ${method}
Endpoint : ${url}
Name     : ${err.name}
Message  : ${err.message}
-------------------------------
`);

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  } else if (err.name === "SequelizeDatabaseError") {
    statusCode = 400;
    message = "Database error occurred";
  } else if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Duplicate data detected";
  } else if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Foreign key constraint failed";
  }

  res.status(statusCode).json({
    status: "Failed",
    message,
    isSuccess: false,
    data: null,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // tampilkan stack trace hanya di mode dev
  });
};

module.exports = errorHandling;
