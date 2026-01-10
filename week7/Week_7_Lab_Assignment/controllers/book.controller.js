const BookDB = require('../database/books.db');

class BookController {
    static async getAll(req, res) {
        try {
            const books = await BookDB.findAll();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const book = await BookDB.findById(req.params.id);
            if (!book) return res.status(404).json({ error: "Book not found" });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async search(req, res) {
        try {
            const { q } = req.query;
            const books = await BookDB.search(q);
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async create(req, res) {
        try {
            const result = await BookDB.create(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async update(req, res) {
        try {
            await BookDB.update(req.params.id, req.body);
            res.json({ message: "Book updated successfully" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

// ⚠️ สำคัญมาก: ต้อง Export Class ออกไปเสมอ
module.exports = BookController;