import express from "express";
const router = express.Router();

router.get("/file-upload", (req, res) => {
    res.send(200);
});

export default router;
