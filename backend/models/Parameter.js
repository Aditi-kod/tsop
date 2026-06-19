import mongoose from 'mongoose';

const parameterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['fixed text', 'number', 'task done Y/N', 'rule understanding Y/N', 'date', 'desired/expected'],
    },
    group: {
        type: String,
        required: true,
        enum: ['common', 'sunshine', 'hr', 'gm', 'tech', 'gd', 'smm'],
    },
}, { timestamps: true });

export default mongoose.model('Parameter', parameterSchema);