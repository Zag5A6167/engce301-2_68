const MemberDB = require('../database/members.db');

class MemberController {
    static async getAll(req, res) {
        try {
            const members = await MemberDB.findAll();
            res.json(members);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }

    static async getById(req, res) {
        try {
            const member = await MemberDB.findById(req.params.id);
            if (!member) return res.status(404).json({ error: "Member not found" });
            res.json(member);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }

    static async create(req, res) {
        try {
            const result = await MemberDB.create(req.body);
            res.status(201).json(result);
        } catch (err) { res.status(400).json({ error: err.message }); }
    }

    static async update(req, res) {
        try {
            await MemberDB.update(req.params.id, req.body);
            res.json({ message: "Member updated" });
        } catch (err) { res.status(400).json({ error: err.message }); }
    }
}
module.exports = MemberController;