import express from 'express';
const router = express.Router();
import db from '../DB/mysql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "../lib/Authorization.js"

// get all user
router.get("/", authenticateToken, async (req, res) => {
    try {
        // get all user
        const [result]: any = await db.execute('SELECT * FROM users');

        // Send the results as JSON
        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result
        });
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

// update user
router.put("/:userId", authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    const { name, email, phone, role } = req.body;
    try {
        const query = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?';
        const values = [name, email, phone, role, userId];
        const [result]: any = await db.execute(query, values);

        console.log(result);


        res.status(200).json({
            "success": true,
            "message": "User updated successfully",
            "data": {
                "id": userId,
                "name": name,
                "email": email,
                "phone": phone,
                "role": role
            }
        })
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})


export default router;
