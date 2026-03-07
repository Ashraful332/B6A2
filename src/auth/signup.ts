import express from "express";
const router = express.Router();
import db from '../DB/mysql.js';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

router.get('/signup', (req, res) => {
    res.status(404).send("Only Post method on signup api");
})

// crete new user or admin
router.post('/signup', async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    // console.log(name, email, password, phone, role );

    try {
        const saltRounds: number = Number(process.env.SALTROUNDS); // import salt rounds as number
        const hashedPassword = await bcrypt.hash(password, saltRounds) // hash password 

        const sql = 'INSERT INTO users (name, email, hashedPassword, phone, role ) VALUES (?,?,?,?,?) '
        const values = [name, email, hashedPassword, phone, role];

        // Execute the query using the connection pool
        const [result]: any = await db.execute(sql, values);

        console.log('Record inserted:', result.insertId);
        res.status(2001).json({
            "success": true,
            "message": "User registered successfully",
            "data": {
                "id": result.insertId,
                "name": name,
                "email": email,
                "phone": phone,
                "role": role
            }
        })

    } catch (error: any) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Error inserting data', error: error.message });
    }

})

export default router