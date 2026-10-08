const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Goal title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        trim: true,
        default: 'dsa'
    },
    target: {
        type: String,
        required: [true, 'Target description is required'],
        trim: true
    },
    currentProgress: {
        type: String,
        trim: true,
        default: ''
    },
    progressPercent: {
        type: Number,
        min: [0, 'Progress percent cannot be less than 0'],
        max: [100, 'Progress percent cannot exceed 100'],
        default: 0
    },
    deadline: {
        type: String,
        trim: true,
        default: 'End of semester'
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'upcoming'],
        default: 'active'
    }
}, {
    timestamps: true
});

goalSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('Goal', goalSchema);
