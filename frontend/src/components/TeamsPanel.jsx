import { useState } from 'react';
import Modal from './Modal';
import { generateId, saveData } from '../data/store';

const TEAM_TYPES = ['Sunshine', 'Program', 'Backend', 'Support'];
const empty = { name: '', type: 'Backend', domain: '' };

export default function TeamsPanel({ data, setData, onSelectTeam }) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);

    function openAdd() {
        setEditing(null);
        setForm(empty);
        setShowModal(true);
    }

    function openEdit(e, team) {
        e.stopPropagation();
        setEditing(team.id);
        setForm({ name: team.name, type: team.type, domain: team.domain });
        setShowModal(true);
    }

    function handleSave() {
        if (!form.name.trim()) return;
        let updated;
        if (editing) {
            updated = {
                ...data,
                teams: data.teams.map(t => t.id === editing ? { ...t, ...form } : t),
            };
        } else {
            const newTeam = { id: generateId(), ...form };
            updated = {
                ...data,
                teams: [...data.teams, newTeam],
                teamParameters: { ...data.teamParameters, [newTeam.id]: [] },
            };
        }
        setData(updated);
        saveData(updated);
        setShowModal(false);
    }

    function handleDelete(e, id) {
        e.stopPropagation();
        if (!confirm('Delete this team?')) return;
        const { [id]: _, ...rest } = data.teamParameters;
        const updated = {
            ...data,
            teams: data.teams.filter(t => t.id !== id),
            teamParameters: rest,
        };
        setData(updated);
        saveData(updated);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Teams</h2>
                <button
                    onClick={openAdd}
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add team
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Domain</th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {data.teams.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center text-gray-400 py-6">No teams yet</td>
                    </tr>
                )}
                {data.teams.map(team => (
                    <tr
                        key={team.id}
                        onClick={() => onSelectTeam(team)}
                        className="border-t border-gray-100 cursor-pointer hover:bg-blue-50 transition"
                    >
                        <td className="px-4 py-3 font-medium text-blue-700">{team.name}</td>
                        <td className="px-4 py-3">
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                  {team.type}
                </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{team.domain}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={e => openEdit(e, team)} className="text-gray-400 hover:text-blue-600 mr-2 text-xs">Edit</button>
                            <button onClick={e => handleDelete(e, team.id)} className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <Modal title={editing ? 'Edit team' : 'Add team'} onClose={() => setShowModal(false)}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Team name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                {TEAM_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Domain</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="e.g. tech, finance"
                                value={form.domain}
                                onChange={e => setForm({ ...form, domain: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setShowModal(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}