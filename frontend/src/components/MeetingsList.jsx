import { deleteMeeting } from '../api/client';

export default function MeetingsList({ meetings, onMeetingDeleted }) {
    async function handleDelete(id) {
        if (!confirm('Delete this meeting record?')) return;
        await deleteMeeting(id);
        onMeetingDeleted();
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">
                    Meeting history
                    <span className="ml-2 font-normal text-gray-400 text-xs">{meetings.length} logged</span>
                </h2>
            </div>

            {meetings.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">No meetings logged yet</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {meetings.map(m => (
                        <div key={m._id} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">
                  {m.meetingDate}
                    {(m.startTime || m.endTime) && (
                        <span className="text-gray-400 font-normal ml-2 text-xs">
                      {m.startTime || '?'} – {m.endTime || '?'}
                    </span>
                    )}
                </span>
                                <button onClick={() => handleDelete(m._id)} className="text-gray-400 hover:text-red-600 text-xs">
                                    Delete
                                </button>
                            </div>
                            <dl className="grid grid-cols-1 gap-2 text-sm">
                                {m.attendees && <div><dt className="text-xs text-gray-400">Attendees</dt><dd className="text-gray-700">{m.attendees}</dd></div>}
                                {m.agenda && <div><dt className="text-xs text-gray-400">Agenda</dt><dd className="text-gray-700">{m.agenda}</dd></div>}
                                {m.discussionPoints && <div><dt className="text-xs text-gray-400">Discussion points</dt><dd className="text-gray-700">{m.discussionPoints}</dd></div>}
                                {m.actionItems && <div><dt className="text-xs text-gray-400">Action items</dt><dd className="text-gray-700">{m.actionItems}</dd></div>}
                            </dl>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}