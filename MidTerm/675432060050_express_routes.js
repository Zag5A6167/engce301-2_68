/**
 * ส่วนที่ 5: Express Routes (Pseudo Code) 

 */

const express = require('express');
const app = express();

// ==========================================
// 1. ROUTER LAYER
// ==========================================
const router = express.Router();

router.get('/rooms', (req, res) => BookingController.getAllRooms(req, res));
router.post('/bookings', (req, res) => BookingController.createBooking(req, res));
router.delete('/bookings/:id', (req, res) => BookingController.cancelBooking(req, res));


// ==========================================
// 2. CONTROLLER LAYER
// ==========================================
class BookingController {
    static async getAllRooms(req, res) {
        const rooms = await BookingService.getAllRooms();
        res.status(200).json(rooms);
    }

    static async createBooking(req, res) {
        try {
            const result = await BookingService.createBooking(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async cancelBooking(req, res) {
        try {
            const { id } = req.params;
            await BookingService.cancelBooking(id);
            res.status(200).json({ message: "Cancelled successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}


// ==========================================
// 3. SERVICE LAYER (Business Logic)
// ==========================================
class BookingService {
    static async getAllRooms() {
        return await BookingDB.findAllRooms();
    }

    static async createBooking(data) {
        if (data.start_time >= data.end_time) {
            throw new Error("เวลาเริ่มต้นต้องก่อนเวลาสิ้นสุด");
        }

        const isAvailable = await BookingDB.checkOverlap(data.room_id, data.date, data.start_time, data.end_time);
        if (!isAvailable) {
            throw new Error("ห้องไม่ว่างในช่วงเวลาที่เลือก");
        }

        return await BookingDB.insert(data);
    }

    static async cancelBooking(id) {
        return await BookingDB.delete(id);
    }
}


// ==========================================
// 4. DATABASE LAYER (Data Access)
// ==========================================
class BookingDB {
    static async findAllRooms() {
        return [{ id: 1, name: "A301", capacity: 20 }, { id: 2, name: "B402", capacity: 30 }];
    }

    static async insert(data) {
        return { id: Math.floor(Date.now() / 1000), ...data, status: "pending" };
    }

    static async checkOverlap(room_id, date, start, end) {
        // Pseudo logic: ตรวจสอบใน Database จริง
        return true; 
    }

    static async delete(id) {
        return true;
    }
}

module.exports = router;