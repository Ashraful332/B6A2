import express from 'express';
const router = express.Router();
import db from '../DB/mysql.js';
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "../lib/Authorization.js"


router.post("/", authenticateToken, async (req, res) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const sql = 'INSERT INTO Vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES (?,?,?,?,?)'
        const values = [vehicle_name, type, registration_number, daily_rent_price, availability_status]

        // execute the query
        const [result]: any = await db.execute(sql, values)
        console.log(result);
        
        res.status(201).json({
            "success": true,
            "message": "Vehicle created successfully",
            "data": {
                "id": result.insertId,
                "vehicle_name": vehicle_name,
                "type": type,
                "registration_number": registration_number,
                "daily_rent_price": daily_rent_price,
                "availability_status": availability_status
            }
        })
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

export default router