const Note = require('../models/Note');

// @route GET /api/notes
exports.getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });
    } catch (err) {
        next(err);
    }
};

// @route POST /api/notes
exports.createNote = async (req, res, next) => {
    try {
        const { title, content, text, color } = req.body;
        const noteContent = (content || text || '').trim();

        if (!noteContent) {
            return res.status(400).json({
                success: false,
                message: 'Note content cannot be empty.'
            });
        }

        const note = await Note.create({
            userId: req.userId,
            title: title ? title.trim() : '',
            content: noteContent,
            color: color || ''
        });

        res.status(201).json({
            success: true,
            note
        });
    } catch (err) {
        next(err);
    }
};

// @route PUT /api/notes/:id
exports.updateNote = async (req, res, next) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found or access denied.'
            });
        }

        const { title, content, text, color } = req.body;
        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content.trim();
        if (text !== undefined) note.content = text.trim();
        if (color !== undefined) note.color = color;

        await note.save();

        res.status(200).json({
            success: true,
            note
        });
    } catch (err) {
        next(err);
    }
};

// @route DELETE /api/notes/:id
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found or access denied.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
