require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const swaggerFile = require("./docs/swagger-output.json");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const router = require("./routes");
const docsRouter = require("./routes/documentationRouter");
const errorHandling = require("./middlewares/errorHandling");

const { systemController } = require("./controllers");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Cek koneksi database
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.get("/api/v1/health-check", systemController.healtcheck);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/v1", router);

app.use("/api-docs", docsRouter);

app.use(errorHandling);

module.exports = app;
