import { useState } from 'react';
import { createMeeting } from '../api/client';

const emptyForm = {
    meetingDate: '',
    startTime: '',
    endTime: '',
    attendees: '',
    agenda: '',
    discussionPoints: '',
    actionItems: '',
};

export default function MeetingForm({ team, onMeetingSaved }) {
    const [form, setForm] = useState(emptyForm);

    function handleChange(field, value) {
        setForm({ ...form, [field]: value });
    }

    async function handleSubmit() {
        if (!form.meetingDate.trim()) return;
        await createMeeting({ ...form, team: team._id });
        setForm(emptyForm);
        onMeetingSaved();
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Log a meeting</h2>
            </div>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Meeting date</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={form.meetingDate}
                            onChange={e => handleChange('meetingDate', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">From</label>
                            <input
                                type="time"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={form.startTime}
                                onChange={e => handleChange('startTime', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">To</label>
                            <input
                                type="time"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={form.endTime}
                                onChange={e => handleChange('endTime', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Attendees</label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Names, comma separated"
                        value={form.attendees}
                        onChange={e => handleChange('attendees', e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Agenda</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        rows={2}
                        value={form.agenda}
                        onChange={e => handleChange('agenda', e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Key discussion points</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        rows={2}
                        value={form.discussionPoints}
                        onChange={e => handleChange('discussionPoints', e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Action items</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        rows={2}
                        value={form.actionItems}
                        onChange={e => handleChange('actionItems', e.target.value)}
                    />
                </div>

                <div className="flex justify-end pt-1">
                    <button onClick={handleSubmit} className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                        Save meeting
                    </button>
                </div>
            </div>
        </div>
    );
}