const MongoClient = require("mongodb").MongoClient;
const dbname = "prompthub";

const pool = MongoClient.createPool({
    MONGO_URI: process.env.MONGO_URI,
    dbname: dbname,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;