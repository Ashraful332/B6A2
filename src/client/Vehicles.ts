import express from 'express';
const router = express.Router();
import db from '../DB/mysql.js';
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "../lib/Authorization.js"


router.post("/")

export default router