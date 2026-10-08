const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        default: null
    },
    title: {
        type: String,
        trim: true,
        default: 'Focus Session'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        required: [true, 'Duration in minutes is required'],
        min: 1,
        default: 25
    },
    status: {
        type: String,
        enum: ['completed', 'in_progress', 'cancelled'],
        default: 'completed'
    },
    mode: {
        type: String,
        enum: ['focus', 'short', 'long'],
        default: 'focus'
    }
}, {
    timestamps: true
});

studySessionSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('StudySession', studySessionSchema);
