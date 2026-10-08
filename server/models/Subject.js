const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true,
        maxlength: [100, 'Subject name cannot exceed 100 characters']
    },
    progress: {
        type: Number,
        min: [0, 'Progress cannot be less than 0'],
        max: [100, 'Progress cannot exceed 100'],
        default: 0
    },
    targetProgress: {
        type: Number,
        min: [0, 'Target progress cannot be less than 0'],
        max: [100, 'Target progress cannot exceed 100'],
        default: 100
    },
    category: {
        type: String,
        trim: true,
        default: 'webtech'
    },
    dailyHours: {
        type: Number,
        min: 0,
        default: 2
    },
    targetMarks: {
        type: Number,
        min: 0,
        max: 100,
        default: 85
    }
}, {
    timestamps: true
});

subjectSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('Subject', subjectSchema);
