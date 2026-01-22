const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')
const app = express();


app.use(cors())
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database/tasks.db');

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ tasks: rows });
        }
    });
});

// POST create task

app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    const status = 'TODO'; 

    db.run(
        'INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)',
        [title, description, priority, status],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
               
                res.status(201).json({ 
                    task: { 
                        id: this.lastID, 
                        title, 
                        description, 
                        priority, 
                        status 
                    } 
                });
            }
        }
    );
});




// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    });
});


app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, priority } = req.body;
    const sql = `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;
    
    db.run(sql, [title, description, status, priority, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
            res.json({ success: true, data: row });
        });
    });
});


app.patch('/api/tasks/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
    [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true, message: "Status updated" });
    });
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    
});