const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member.controller');

router.get('/', MemberController.getAll);
router.get('/:id', MemberController.getById);
router.post('/', MemberController.create);
router.put('/:id', MemberController.update);

module.exports = router;