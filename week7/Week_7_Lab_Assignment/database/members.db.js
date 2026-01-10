const db = require('./connection');

class MemberDatabase {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM members ORDER BY id DESC', [], (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });
    }

    static create(memberData) {
        const { name, email, phone } = memberData;
        const sql = `INSERT INTO members (name, email, phone, status) VALUES (?, ?, ?, 'active')`;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...memberData });
            });
        });
    }

    static update(id, memberData) {
        const { name, email, phone, status } = memberData;
        const sql = `UPDATE members SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone, status, id], function(err) {
                if (err) reject(err); else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = MemberDatabase;