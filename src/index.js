const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

app.use(cors());

let db = new sqlite3.Database('src/database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.get("/all", function(request, response){
    const sql = `SELECT * FROM projects`;

    db.serialize(() => {
        db.all(sql, (err, result) => {
            if (err) {
                console.error(err.message);
            }
            response.json(result);
        });
    });
});

const conn = app.listen(4000, '0.0.0.0');

process.on('SIGINT', () => {
    db.close();
    conn.close();
});