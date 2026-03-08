// src/index.ts
import express from 'express';
import * as dotenv from 'dotenv';
const app = express();
const port = 3000;
import cors from "cors";
import db from './DB/mysql.js';
import SignUp from "./auth/signup.js"
import Signin from "./auth/signin.js"

dotenv.config();
app.use(express.json());
app.use(cors());

// connect mysql database
async function connectDB() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected");
    connection.release();
  } catch (err) {
    console.log("DB connection error");
  }
}

connectDB();


// all route

app.get('/', (req, res) => {
  res.send('Hello TypeScript + Node.js!');
});

app.use('/api/v1/auth',SignUp) // registration api
app.use('/api/v1/auth',Signin) // login api


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});