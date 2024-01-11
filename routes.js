import express from "express";
const router = express.Router();
import fs from "fs";
import cacheDb from "./database/cache-db.js";

router.post("/file-upload", (req, res) => {
    const { file } = req.files;
    const fileId = Date.now();
    fs.writeFile(`./files/${fileId}.txt`, file.data, async (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Internal Server Error');
        }
        await cacheDb.set({ key: fileId, value: { fileName: file.name, fileId: fileId, uploadDate: new Date (fileId) }})
        res.status(200).send({ fileId });
    })
});

export default router;
