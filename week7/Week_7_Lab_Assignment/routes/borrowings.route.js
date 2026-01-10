const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowing.controller');

router.post('/borrow', BorrowingController.borrow);
router.put('/:id/return', BorrowingController.returnBook);

module.exports = router;