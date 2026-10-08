const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [300, 'Title cannot exceed 300 characters']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    subject: {
        type: String,
        trim: true,
        default: 'General'
    },
    category: {
        type: String,
        trim: true,
        default: 'dsa'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

taskSchema.pre('save', function() {
    if (this.isModified('completed')) {
        this.status = this.completed ? 'completed' : 'pending';
        if (this.completed && !this.completedAt) {
            this.completedAt = new Date();
        } else if (!this.completed) {
            this.completedAt = null;
        }
    }
});

taskSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('Task', taskSchema);
