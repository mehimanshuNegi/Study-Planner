const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    content: {
        type: String,
        required: [true, 'Note content is required'],
        trim: true
    },
    color: {
        type: String,
        enum: ['', 'sage', 'pink'],
        default: ''
    }
}, {
    timestamps: true
});

noteSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('Note', noteSchema);
