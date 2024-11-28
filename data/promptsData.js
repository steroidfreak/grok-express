const pool = require('../database');

const mongoUri = process.env.MONGO_URI;

async function connect(uri, dbname) {
    let client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    return _db;
}

async function getAllPrompts() {

    const db = await connect(mongoUri, dbname);
    const [rows] = await pool.query(

        prompts = await db.collection("Prompts").find(criteria)
            .project({
                "prompt": 1,
                "result": 1,
                "dateCreated": 1
            }).toArray()

        // res.json({ 'prompts': prompts });

    );
    console.log(rows[0]);

};

module.exports = {

    getAllPrompts
};