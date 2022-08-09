const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {Pool} = require("pg");
const random = require('random-bigint')

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "speroteck-db",
  password: "qwerty123",
  port: 5432,
};

const pool = new Pool(credentials);

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Task 1
app.get('/', function (req, res) {
  const {name, surname, age} = req.body;

  if (age > 18) {
    res.send(`<h1>Hello, ${name} ${surname}</h1>`);
  } else {
    res.send("Access Denied. Try again later!");
  }
});

// Task 2
app.post('/user', (req, res) => {
  const {email, name, surname, age} = req.body;

  if (!email.includes("@") || name.trim().length === 0 || surname.trim().length === 0 || +age <= 0) {
    throw new Error("Invalid data received");
  }

  if (age < 18) {
    res.status(401).send("Invalid age. Please try again later...");
  }

  const id = random(16);

  if (+age > 18) {
    pool.query(`INSERT INTO users_table(id, email, name, surname, age)
                VALUES ($1, $2, $3, $4, $5)`, [id, email, name, surname, age],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send(`Done! User added with ID: ${id}`);
      })
  }
});

// Task 3
app.get('/email', (req, res) => {
  const {email} = req.body;

  if (!email.includes("@")) {
    res.status(401).send("Invalid email. Try again...");
  }

  pool.query(`SELECT name, surname FROM users_table WHERE email = $1`, [email], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(results.rows);
  });
});

app.listen(port, () => console.log(`Dolphin app listening on port ${port}!`));

