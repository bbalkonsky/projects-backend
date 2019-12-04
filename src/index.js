const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let db = new sqlite3.Database('src/database.db', sqlite3, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.get("/project/:id", function(request, response){
    const sql = `SELECT * FROM projects WHERE id = ?`;
    const id = request.params["id"];

    db.serialize(() => {
        db.all(sql, id, (err, result) => {
            if (err) {
                console.error(err.message);
            }
            response.json(result);
        });
    });
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

app.post('/post', function (req, res) {
    const body = req.body;

    db.run(
        `INSERT INTO projects(id, title, description, prod_link, dev_link, git_link, other) VALUES (?,?,?,?,?,?,?)`,
        [
            body.id,
            body.title,
            body.description,
            body.prod_link,
            body.dev_link,
            body.git_link,
            body.other
        ],
        function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

    res.send('POST request to the homepage');
});



const conn = app.listen(4000, '0.0.0.0');

process.on('SIGINT', () => {
    db.close();
    conn.close();
});