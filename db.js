import mongoDb from "mongodb";

const conn_str = "mongodb://localhost:27017";

const client = new mongoDb.MongoClient(conn_str);
let conn;

try {
    conn = await client.connect();
} catch (error) {
    console.error(error);
}

let db = conn.db("dbLog");

export default db;
