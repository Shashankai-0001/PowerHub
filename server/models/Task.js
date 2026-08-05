// Mongoose Schema Model for User Tasks
// Schema for daily fitness tasks
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
