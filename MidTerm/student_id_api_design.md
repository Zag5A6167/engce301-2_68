HTTP Method,Endpoint,Description,Request Body,Response,Status
GET,/api/rooms,ดึงรายการห้องทั้งหมด,-,"[{room_id, name, ...}]",200
GET,/api/rooms/:id,ดึงข้อมูลห้องเดียว,-,"{room_id, name, ...}",200
POST,/api/rooms,สร้างห้องใหม่ (เจ้าหน้าที่),"{name, capacity, ...}","{message: ""created""}",201
PUT,/api/rooms/:id,แก้ไขข้อมูลห้อง (เจ้าหน้าที่),"{name, capacity, ...}","{message: ""updated""}",200
DELETE,/api/rooms/:id,ลบห้อง (เจ้าหน้าที่),-,"{message: ""deleted""}",200
GET,/api/bookings,ดึงการจองทั้งหมด,-,"[{booking_id, ...}]",200
GET,/api/bookings/my,ดึงการจองของตัวเอง,-,"[{booking_id, ...}]",200
POST,/api/bookings,สร้างการจองใหม่,"{room_id, date, ...}","{id: 123, status: ""pending""}",201
DELETE,/api/bookings/:id,ยกเลิกการจอง,-,"{message: ""cancelled""}",200
PATCH,/api/bookings/:id/approve,อนุมัติการจอง (เจ้าหน้าที่),"{status: ""approved""}","{status: ""approved""}",200
POST,/api/auth/login,เข้าสู่ระบบ,"{username, password}","{token: ""jwt_token...""}",200