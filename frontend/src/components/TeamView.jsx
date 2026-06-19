import { useState, useEffect } from 'react';
import MeetingForm from './MeetingForm';
import MeetingsList from './MeetingsList';
import { getMeetingsForTeam } from '../api/client';

export default function TeamView({ team, onBack, onOpenParameters }) {
    const [meetings, setMeetings] = useState([]);

    async function loadMeetings() {
        const data = await getMeetingsForTeam(team._id);
        setMeetings(data);
    }

    useEffect(() => {
        loadMeetings();
    }, [team._id]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline mb-5 flex items-center gap-1">
                ← Back to teams
            </button>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{team.domain}</span>
                </div>
                <button
                    onClick={onOpenParameters}
                    className="text-sm bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition flex items-center gap-1.5"
                >
                    ⚙ Parameters
                </button>
            </div>

            <div className="space-y-6">
                <MeetingForm team={team} onMeetingSaved={loadMeetings} />
                <MeetingsList meetings={meetings} onMeetingDeleted={loadMeetings} />
            </div>
        </div>
    );
}