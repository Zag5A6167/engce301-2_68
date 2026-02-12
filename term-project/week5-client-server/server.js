require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Import มาก่อน

const app = express();

// 2. ตั้งค่า CORS (วางไว้บนสุดของ Middleware)
const corsOptions = {
    origin: true, 
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); 

// 3. Middleware อื่นๆ
app.use(express.json());

// 4. Routes (ส่วนดึงข้อมูล)
// app.get('/api/tasks', ... )