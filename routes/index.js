const router = require("express").Router();

const Example = require("./exampleRouter");
const adminRouter = require("./adminRouter");
const guruBkRouter = require("./guruBkRouter");
const authRouter = require("./authRouter");
const publicRouter = require("./publicRouter");
const diskusiRouter = require("./diskusiRouter");

router.use("/example", Example);
router.use("/admin", adminRouter);
router.use("/guru-bk", guruBkRouter);
router.use("/auth", authRouter);
router.use("/public", publicRouter);
router.use("/diskusi", diskusiRouter);

module.exports = router;
