import express from 'express';
const router = express.Router();
import db from '../DB/mysql.js';
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "../lib/Authorization.js"

// post vehicles
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

// get vehicles
router.get("/", async (req, res) => {
    try {
        const [result]: any = await db.execute('SELECT * FROM Vehicles');
        // Send the results as JSON
        res.status(200).json({
            "success": true,
            "message": "Vehicles retrieved successfully",
            "data": result
        });
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

// get vehicles by id
router.get("/:Id", async (req, res) => {
    const Id = req.params.Id
    try {
        const [result]: any = await db.execute('SELECT * FROM Vehicles WHERE id = ?',[Id]);
        // Send the results as JSON
        res.status(200).json({
            "success": true,
            "message": "Vehicles retrieved successfully",
            "data": result
        });
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

// update Vehicles
router.put("/:Id", authenticateToken, async (req, res) => {
    const Id = req.params.Id;
    const {  vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
    try {
        const query = 'UPDATE Vehicles SET vehicle_name = ?, type = ?, registration_number = ?, daily_rent_price = ?,availability_status = ? WHERE id = ?';
        const values = [ vehicle_name, type, registration_number, daily_rent_price, availability_status, Id];
        const [result]: any = await db.execute(query, values);

        console.log(result);

        res.status(200).json({
            "success": true,
            "message": "Vehicle updated successfully",
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

// delete user
router.delete("/:Id", authenticateToken, async (req, res) => {
    const Id = req.params.Id;
    
    try {
        const sql = 'DELETE FROM Vehicles WHERE id = ?'; // sql query
        const [result]: any = await db.execute(sql, [Id]); // run sql

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `User with ID ${Id} not found` });
        }

        // send success message
        res.status(200).json({
            "success": true,
            "message": "Vehicle deleted successfully"
        })
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})


export default router