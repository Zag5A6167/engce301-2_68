const db = require('./connection');

class BookDatabase {
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ ค้นหาหนังสือจาก ID
    static findById(id) {
        const sql = 'SELECT * FROM books WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // ✅ ค้นหาหนังสือจากชื่อ (title) หรือผู้แต่ง (author)
    static search(keyword) {
        const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
        const param = `%${keyword}%`;
        return new Promise((resolve, reject) => {
            db.all(sql, [param, param], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ เพิ่มหนังสือใหม่
    static create(bookData) {
        const { title, author, isbn, category, total_copies } = bookData;
        const sql = `INSERT INTO books (title, author, isbn, category, total_copies, available_copies) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        // ตอนสร้างใหม่ total และ available จะเท่ากัน
        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, total_copies], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...bookData });
            });
        });
    }

    // ✅ แก้ไขข้อมูลหนังสือ
    static update(id, bookData) {
        const { title, author, isbn, category, total_copies, available_copies } = bookData;
        const sql = `UPDATE books 
                     SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?, available_copies = ?
                     WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, available_copies, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ✅ เพิ่มจำนวนหนังสือว่าง (ใช้เมื่อมีการคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies + 1
            WHERE id = ? AND available_copies < total_copies
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BookDatabase;