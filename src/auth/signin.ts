import express from "express"
const router = express.Router();
import db from '../DB/mysql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();



router.get('/signin', (req, res) => {
    res.status(404).send("only post method on signin")
})

// login user
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user
        const sql = `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
        const [result]: any = await db.execute(sql);

        // check user
        if (result.length === 0) {
            res.status(404).json({ message: "user is not found" })
        }
        console.log(result);

        // jwt token
        const secret:string = process.env.JWT_SECRET || " ";
        console.log(process.env.JWT_SECRET);
        
        const payload = { sub: result[0].id, role: result[0].role };

        const token = jwt.sign(payload, secret, {
            expiresIn: '15d'
        });

        // check password
        if (await bcrypt.compare(password, result[0].password)) {
            res.status(200).json(
                {
                    "success": true,
                    "message": "Login successful",
                    "data": {
                        "token": token,
                        "user": {
                            "id": result[0].id,
                            "name": result[0].name,
                            "email": result[0].email,
                            "phone": result[0].phone,
                            "role": result[0].role
                        }
                    }
                }
            )
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }


    } catch (error: any) {
        console.log("error is coming :", error);
        res.status(500).json({ message: "Error is coming", error: error.message })

    }
})

export default router