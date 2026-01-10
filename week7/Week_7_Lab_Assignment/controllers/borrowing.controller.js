const BorrowingService = require('../services/borrowing.service');

class BorrowingController {
    static async borrow(req, res) {
        try {
            const result = await BorrowingService.borrowBook(req.body);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: result
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async returnBook(req, res) {
        try {
            const result = await BorrowingService.returnBook(req.params.id);
            res.status(200).json({
                success: true,
                message: "Book returned successfully",
                data: result
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = BorrowingController;