// src/index.ts
import express from 'express';
import * as dotenv from 'dotenv';
const app = express();
const port = 3000;
import db from './DB/mysql.js';
import SingUp from "./auth/signup.js"

dotenv.config();
app.use(express.json());

// connect mysql database
db.getConnection((err, connection) => {
  if (err) {
    console.log("DB connection error");
  } else {
    console.log("Database connected");
    connection.release();
  }
});

// all route

app.get('/', (req, res) => {
  res.send('Hello TypeScript + Node.js!');
});

app.use('/api/v1/auth',SingUp) // registration api


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});