import { useState } from 'react';
import Modal from './Modal';
import { generateId, saveData, getParamsForTeam } from '../data/store';

const PARAM_TYPES = ['fixed text', 'number', 'task done Y/N', 'rule understanding Y/N', 'date', 'desired/expected'];

const emptyForm = { name: '', type: 'number' };

const groupColor = {
    common: 'bg-blue-100 text-blue-700',
    sunshine: 'bg-yellow-100 text-yellow-700',
    program: 'bg-green-100 text-green-700',
    backend: 'bg-purple-100 text-purple-700',
    support: 'bg-orange-100 text-orange-700',
};

export default function TeamView({ team, data, setData, onBack }) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const { global: scopedParams, individual: indParams } = getParamsForTeam(data, team);

    function openAdd() {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(p) {
        setEditing(p.id);
        setForm({ name: p.name, type: p.type });
        setShowModal(true);
    }

    function handleSave() {
        if (!form.name.trim()) return;
        const existing = data.teamParameters[team.id] || [];
        const updatedList = editing
            ? existing.map(p => p.id === editing ? { ...p, ...form } : p)
            : [...existing, { id: generateId(), ...form }];

        const updated = {
            ...data,
            teamParameters: { ...data.teamParameters, [team.id]: updatedList },
        };
        setData(updated);
        saveData(updated);
        setShowModal(false);
    }

    function handleDelete(id) {
        if (!confirm('Delete this parameter?')) return;
        const updated = {
            ...data,
            teamParameters: {
                ...data.teamParameters,
                [team.id]: (data.teamParameters[team.id] || []).filter(p => p.id !== id),
            },
        };
        setData(updated);
        saveData(updated);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
            {/* Back button */}
            <button
                onClick={onBack}
                className="text-sm text-blue-600 hover:underline mb-5 flex items-center gap-1"
            >
                ← Back to teams
            </button>

            {/* Team header */}
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{team.type}</span>
                <span className="text-sm text-gray-400">{team.domain}</span>
            </div>

            <div className="space-y-6">
                {/* Scoped global params */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Scoped parameters
                            <span className="ml-2 font-normal text-gray-400 text-xs">common + {team.type} group</span>
                        </h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="text-gray-400 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Type</th>
                            <th className="text-left px-4 py-2">Group</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scopedParams.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center text-gray-400 py-5 text-xs">No scoped parameters</td>
                            </tr>
                        )}
                        {scopedParams.map(p => (
                            <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-2.5 font-medium text-gray-800">{p.name}</td>
                                <td className="px-4 py-2.5">
                                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">{p.type}</span>
                                </td>
                                <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${groupColor[p.group] || 'bg-gray-100 text-gray-600'}`}>
                      {p.group}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Individual params */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Individual parameters
                            <span className="ml-2 font-normal text-gray-400 text-xs">only for {team.name}</span>
                        </h2>
                        <button
                            onClick={openAdd}
                            className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                        >
                            + Add parameter
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="text-gray-400 text-xs uppercase tracking-wide">
                        <tr>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Type</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {indParams.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center text-gray-400 py-5 text-xs">No individual parameters yet</td>
                            </tr>
                        )}
                        {indParams.map(p => (
                            <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-2.5 font-medium text-gray-800">{p.name}</td>
                                <td className="px-4 py-2.5">
                                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">{p.type}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-600 mr-2 text-xs">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <Modal
                    title={editing ? 'Edit parameter' : `Add parameter for ${team.name}`}
                    onClose={() => setShowModal(false)}
                >
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Parameter name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                {PARAM_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setShowModal(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}