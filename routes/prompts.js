const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const router = express.Router();
const dbname = "prompthub";

const mongoUri = process.env.MONGO_URI;

// const promptsService = require("../services/promptsService");
async function connect(uri, dbname) {
    let client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    return _db;
}

router.get("/", async function (req, res) {
    const db = await connect(mongoUri, dbname);

    try {
        // Destructuring query parameters
        let { prompt, result, dateCreated } = req.query;

        // Building the criteria for MongoDB search
        let criteria = {};

        if (prompt) {
            criteria["prompt"] = { "$regex": prompt, "$options": "i" }
        }

        if (result) {
            criteria["result"] = { "$regex": result, "$options": "i" }
        }

        // Date created should be compared for equality or within a range
        if (dateCreated) {
            criteria["dateCreated"] = new Date(dateCreated);
        }

        // Fetching the data with MongoDB
        let prompts = await db.collection("Prompts").find(criteria)
            .project({
                "prompt": 1,
                "result": 1,
                "dateCreated": 1
            }).toArray();

        res.json({ 'prompts': prompts });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async function (req, res) {
    try {
        // Destructure the data sent in the request body
        const { prompt, result, dateCreated } = req.body;

        // Validate required fields
        if (!prompt || !result) {
            return res.status(400).json({ error: "Prompt and result are required." });
        }

        // Build the new document
        const newPrompt = {
            prompt: prompt,
            result: result,
            dateCreated: dateCreated ? new Date(dateCreated) : new Date() // Use provided date or current date
        };

        // Insert the new document into the database
        const inserted = await db.collection("Prompts").insertOne(newPrompt);

        // Respond with the inserted document's ID
        res.status(201).json({ message: "Prompt added successfully.", id: inserted.insertedId });
    } catch (error) {
        console.error("Error adding new prompt:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;