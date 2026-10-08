const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
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
        required: [true, 'Session/Topic title is required'],
        trim: true
    },
    dayOfWeek: {
        type: String,
        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        required: [true, 'Day of week is required']
    },
    startTime: {
        type: String,
        default: '09:00'
    },
    endTime: {
        type: String,
        default: '10:00'
    },
    timeRange: {
        type: String,
        default: '09:00 – 10:00'
    },
    category: {
        type: String,
        default: 'dsa'
    },
    tag: {
        type: String,
        default: 'Coding Practice'
    },
    type: {
        type: String,
        default: 'regular'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    target: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

studyPlanSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
