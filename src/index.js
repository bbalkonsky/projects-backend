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

app.put("/project/edit/:id", function(request, response){
    const sql = `SELECT * FROM projects WHERE id = ?`;
    const body = request.body;

    db.run(
        `UPDATE projects SET title = ?, description = ?, prod_url = ?, dev_url = ?, git_url = ? WHERE id = ?`,
        [
            body.title,
            body.description,
            body.prod_url,
            body.dev_url,
            body.git_url,
            body.id
        ],
        function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row with ${this.id} was update`);
        });

    response.send('PUT request to the homepage');
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

app.post('/post', function (request, response) {
    const body = request.body;

    db.run(
        `INSERT INTO projects(id, title, description, prod_url, dev_url, git_url) VALUES (?,?,?,?,?,?)`,
        [
            body.id,
            body.title,
            body.description,
            body.prod_url,
            body.dev_url,
            body.git_url
        ],
        function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

    response.send('POST request to the homepage');
});

app.delete("/delete/:id", function(request, response){
    const sql = `DELETE FROM projects WHERE id = ?`;
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



const conn = app.listen(4000, '0.0.0.0');

process.on('SIGINT', () => {
    db.close();
    conn.close();
});