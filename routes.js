import express from "express";
const router = express.Router();
import fs from "fs";
import cacheDb from "./database/cache-db.js";
import path from "path";

router.post("/file-upload", (req, res) => {
    const { file } = req.files;
    const fileId = Date.now();
    fs.writeFile(`./files/${fileId}.txt`, file.data, async (err) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        await cacheDb.set({ key: fileId, data: { fileName: file.name, fileId: fileId, uploadDate: new Date (fileId) }})
        res.status(200).send({ fileId });
    })
});

router.get("/:id/file-upload/:operation", async (req, res) => {
    const { id, operation = "" } = req.params;
    const filePath = path.join("./files", `./${id}.txt`);
    const file = await fs.promises.readFile(filePath, 'utf8');

    if (!file) res.status(404).send("File Not Found");

    const taskId = Date.now();
    const result = { taskId, operation };

    if (operation === "countWords") {
        const wordMatches = file.match(/\b\w+\b/g);
        const wordsCount = wordMatches ? wordMatches.length : 0;
        result.wordsCount = wordsCount
    }

    if (operation === "countUniqueWords") {
        const wordMatches = file.match(/\b\w+\b/g);
        const uniqueWordsSet = new Set(wordMatches);
        result.uniqueWords = uniqueWordsSet.size;
    }

    if (operation.includes("findTop")) {
        const match = operation.match(/\d+/);
        const k = parseInt(match?.[0]);
        const words = file.match(/\b\w+\b/g) || []; 
        const wordFrequency = words.reduce((freq, word) => {
            freq[word] = (freq[word] || 0) + 1;
            return freq;
        }, {});
        const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);
        const topKWords = sortedWords.slice(0, k);
        result.topKWords = topKWords;
    }

    await cacheDb.set({ key: taskId, data: result });
    res.status(200).send(result);
});

router.get("/task/:id", async (req, res) => {
    const { id } = req.params;
    const result = await cacheDb.get(id);
    res.status(200).send(result);
});


export default router;
