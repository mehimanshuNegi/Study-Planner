const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
    rollNo: {
        type: String,
        default: '',
        trim: true
    },
    branch: {
        type: String,
        default: '',
        trim: true
    },
    semester: {
        type: String,
        default: '',
        trim: true
    },
    studyGoal: {
        type: String,
        default: '20',
        trim: true
    },
    notes: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('passwordHash')) return;
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Password verification helper
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Safe JSON representation
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.passwordHash;
    obj.id = obj._id;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
