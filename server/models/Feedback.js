const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },
        type: {
            type: String,
            required: [true, 'Feedback type is required'],
            enum: {
                values: ['Suggestion', 'Bug / Issue', 'Feature Request', 'General Feedback'],
                message: '{VALUE} is not a valid feedback type'
            }
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters']
        },
        message: {
            type: String,
            required: [true, 'Feedback message is required'],
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters']
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
            default: null
        },
        status: {
            type: String,
            enum: ['submitted', 'reviewed', 'resolved'],
            default: 'submitted'
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
