import express from 'express';
const router = express.Router();
import db from '../DB/mysql.js';
import * as dotenv from 'dotenv';
dotenv.config();
import authenticateToken from "../lib/Authorization.js"

// create booking
router.post("/", authenticateToken, async (req, res) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    try {
        const [vehicle]: any = await db.execute('SELECT * FROM Vehicles WHERE id = ?', [vehicle_id]);
        const vehicle_name = vehicle[0].vehicle_name;
        const price = vehicle[0].daily_rent_price;
        const vStatus = vehicle[0].availability_status;

        //  Calculate the Number of Days
        function calculateDays(startDate: string, endDate: string) {
            let start: any = new Date(startDate);
            let end: any = new Date(endDate);
            let timeDifference = end - start;
            let daysDifference = timeDifference / (1000 * 3600 * 24);
            return daysDifference;
        }
        // calculate rent price
        const date = calculateDays(rent_start_date, rent_end_date);
        const tPrice = price * date;

        // send rent data into database
        const sql = 'INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price,status) VALUES (?,?,?,?,?,?)'
        const values = [customer_id, vehicle_id, rent_start_date, rent_end_date, tPrice, vStatus];

        // Execute the query using the connection pool
        const [result]: any = await db.execute(sql, values);

        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
            "data": {
                "id": result.insertId,
                "customer_id": customer_id,
                "vehicle_id": vehicle_id,
                "rent_start_date": rent_start_date,
                "rent_end_date": rent_end_date,
                "total_price": tPrice,
                "status": vStatus,
                "vehicle": {
                    "vehicle_name": vehicle_name,
                    "daily_rent_price": price
                }
            }
        })
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

// get all booking
router.get("/", authenticateToken, async (req, res) => {
    try {
        const [Booking]: any = await db.execute('SELECT * FROM Bookings '); // get all bookings

        // get user data
        async function getUserData(userId: number) {
            const [Customer]: any = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);

            return {
                name: Customer[0].name,
                email: Customer[0].email
            };
        }
        // get vehicle data
        async function getVehicleData(vehicleId: number) {
            const [Vehicle]: any = await db.execute("SELECT * FROM Vehicles WHERE id = ?", [vehicleId]);

            return {
                vehicle_name: Vehicle[0].vehicle_name,
                registration_number: Vehicle[0].registration_number
            };
        }

        const data = await Promise.all(
            Booking.map(async (booking: any) => ({
                id: booking.id,
                customer_id: booking.customer_id,
                vehicle_id: booking.vehicle_id,
                rent_start_date: booking.rent_start_date,
                rent_end_date: booking.rent_end_date,
                total_price: booking.total_price,
                status: booking.status,
                customer: await getUserData(booking.customer_id),
                vehicle: await getVehicleData(booking.vehicle_id)
            }))
        );

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: data
        });
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})

// update bookings
router.put("/:bookingId", authenticateToken, async (req, res) => {
    const bookingId = req.params.bookingId;
    const { status } = req.body;
    try {
        const query = 'UPDATE Bookings SET status = ? WHERE id = ?';
        const values = [status, bookingId];
        const [result]: any = await db.execute(query, values);

        const [Booking]: any = await db.execute('SELECT * FROM Bookings WHERE id = ? ', [bookingId]); // get all bookings

        console.log(result);


        res.status(200).json({
            "success": true,
            "message": "Booking cancelled successfully",
            "data": {
                "id": bookingId,
                "customer_id": Booking[0].customer_id,
                "vehicle_id": Booking[0].vehicle_id,
                "rent_start_date": Booking[0].rent_start_date,
                "rent_end_date": Booking[0].rent_end_date,
                "total_price": Booking[0].total_price,
                "status": status
            }
        })
    } catch (error: any) {
        console.log("error is coming : ", error);
        res.status(500).json({ message: "Error is coming", error: error.message })
    }
})


export default router