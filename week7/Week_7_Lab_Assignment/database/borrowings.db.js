const db = require('./connection');

class BorrowingDatabase {
    // ดึงข้อมูลแบบละเอียด (JOIN) เพื่อใช้แสดงผลใน Response
    static getDetailById(id) {
        const sql = `
            SELECT b.*, bk.title as book_title, m.name as member_name 
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            JOIN members m ON b.member_id = m.id
            WHERE b.id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    static countActiveByMemberId(memberId) {
        const sql = "SELECT COUNT(*) as count FROM borrowings WHERE member_id = ? AND status != 'returned'";
        return new Promise((resolve, reject) => {
            db.get(sql, [memberId], (err, row) => {
                if (err) reject(err); else resolve(row ? row.count : 0);
            });
        });
    }

    static create(data) {
        const { book_id, member_id, borrow_date, due_date } = data;
        const sql = `INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status) 
                     VALUES (?, ?, ?, ?, 'borrowed')`;
        return new Promise((resolve, reject) => {
            db.run(sql, [book_id, member_id, borrow_date, due_date], function(err) {
                if (err) reject(err); else resolve({ id: this.lastID });
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM borrowings WHERE id = ?', [id], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    static updateStatus(id, status, returnDate = null) {
        const sql = `UPDATE borrowings SET status = ?, return_date = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [status, returnDate, id], function(err) {
                if (err) reject(err); else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BorrowingDatabase;