import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    meetingDate: { type: String, required: true },
    startTime: String,
    endTime: String,
    attendees: String,
    agenda: String,
    discussionPoints: String,
    actionItems: String,
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);