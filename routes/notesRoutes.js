const express = require('express');
const router = express.Router();
const {getNotes, addNote, getNote, delNote, updateNote} = require('../controllers/notesController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route("/").get(getNotes).post(addNote);
router.route("/:id").put(updateNote).get(getNote).delete(delNote);

module.exports = router;