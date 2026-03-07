// src/index.ts
import express from 'express';
import * as dotenv from 'dotenv';
const app = express();
const port = 3000;
import db from './DB/mysql.js';

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello TypeScript + Node.js!');
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("DB connection error");
  } else {
    console.log("Database connected");
    connection.release();
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});