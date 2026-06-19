import { useState } from 'react';
import Modal from './Modal';
import { createTeam, updateTeam, deleteTeam } from '../api/client';

const TEAM_DOMAINS = ['Sunshine', 'HR', 'GM', 'Tech', 'GD', 'SMM'];
const empty = { name: '', domain: 'Tech' };

export default function TeamsPanel({ teams, refreshAll, onSelectTeam }) {
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
        setEditing(team._id);
        setForm({ name: team.name, domain: team.domain });
        setShowModal(true);
    }

    async function handleSave() {
        if (!form.name.trim()) return;
        if (editing) {
            await updateTeam(editing, form);
        } else {
            await createTeam(form);
        }
        await refreshAll();
        setShowModal(false);
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        if (!confirm('Delete this team?')) return;
        await deleteTeam(id);
        await refreshAll();
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Teams</h2>
                <button onClick={openAdd} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    + Add team
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Domain</th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {teams.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-gray-400 py-6">No teams yet</td></tr>
                )}
                {teams.map(team => (
                    <tr
                        key={team._id}
                        onClick={() => onSelectTeam(team)}
                        className="border-t border-gray-100 cursor-pointer hover:bg-blue-50 transition"
                    >
                        <td className="px-4 py-3 font-medium text-blue-700">{team.name}</td>
                        <td className="px-4 py-3">
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{team.domain}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={e => openEdit(e, team)} className="text-gray-400 hover:text-blue-600 mr-2 text-xs">Edit</button>
                            <button onClick={e => handleDelete(e, team._id)} className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
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
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Domain</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={form.domain}
                                onChange={e => setForm({ ...form, domain: e.target.value })}
                            >
                                {TEAM_DOMAINS.map(d => <option key={d}>{d}</option>)}
                            </select>
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