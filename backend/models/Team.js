import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: {
        type: String,
        required: true,
        enum: ['Sunshine', 'HR', 'GM', 'Tech', 'GD', 'SMM'],
    },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);