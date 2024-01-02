const asyncHandler = require('express-async-handler');
const Note = require('../models/notesModel');

// @desc get all note details
// @route GET /api/notes
// @access private
const getNotes = asyncHandler(async (req, res) => {
    console.log(req.user.user.id);
    const notes = await Note.find({ user_id: req.user.user.id });
    res.status(200).json(notes);
});

// @desc create new note
// @route POST /api/notes
// @access private
const addNote = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // console.log(req.user._id);
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    // console.log(req.user.id);
    const note = await Note.create({
        title,
        content,
        user_id: req.user.user.id,
    });
    console.log(`Note created ${note}`);
    res.status(200).json(note);
});

// @desc get the note details
// @route GET /api/notes/:id
// @access private
const getNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note === null) {
        res.status(404);
        throw new Error("Note not found!");
    }
    res.status(200).json(note);
});

// @desc delete the note details
// @route DELETE /api/notes/:id
// @access private
const delNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note === null) {
        res.status(404);
        throw new Error("Note not found!");
    }
    if(note.user_id.toString() !== req.user.id){
        res.status(401);
        throw new Error("Unauthorized update");
    }
    await note.deleteOne();
    res.status(200).json(note);
});

// @desc update the note details
// @route PUT /api/notes/:id
// @access private
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note === null) {
        res.status(404);
        throw new Error("Note not found!");
    }
    if (note.user_id.toString() !== req.user.id) {
        // Handle unauthorized update
        res.status(401);
        throw new Error("Unauthorized update");
    }
    const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedNote);
});

module.exports = { getNotes, addNote, getNote, delNote, updateNote };
