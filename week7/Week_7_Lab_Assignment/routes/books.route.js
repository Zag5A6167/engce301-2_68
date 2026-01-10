const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');

// ตรวจสอบชื่อฟังก์ชันหลัง Controller. ให้ตรงกับในไฟล์ controller
router.get('/', BookController.getAll);           // บรรทัดที่ 5 ที่มักจะ Error
router.get('/search', BookController.search);
router.get('/:id', BookController.getById);
router.post('/', BookController.create);
router.put('/:id', BookController.update);

module.exports = router;