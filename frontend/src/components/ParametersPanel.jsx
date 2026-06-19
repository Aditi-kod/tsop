import { useState } from 'react';
import Modal from './Modal';
import { createParameter, updateParameter, deleteParameter } from '../api/client';

const PARAM_TYPES = ['fixed text', 'number', 'task done Y/N', 'rule understanding Y/N', 'date', 'desired/expected'];
const GLOBAL_GROUPS = ['common', 'sunshine', 'hr', 'gm', 'tech', 'gd', 'smm'];
const emptyForm = { name: '', type: 'number', group: 'common' };

const groupColor = {
    common: 'bg-blue-100 text-blue-700',
    sunshine: 'bg-yellow-100 text-yellow-700',
    hr: 'bg-pink-100 text-pink-700',
    gm: 'bg-green-100 text-green-700',
    tech: 'bg-purple-100 text-purple-700',
    gd: 'bg-indigo-100 text-indigo-700',
    smm: 'bg-orange-100 text-orange-700',
};

export default function ParametersPanel({ parameters, refreshAll }) {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    function openAdd() {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(p) {
        setEditing(p._id);
        setForm({ name: p.name, type: p.type, group: p.group });
        setShowModal(true);
    }

    async function handleSave() {
        if (!form.name.trim()) return;
        if (editing) {
            await updateParameter(editing, form);
        } else {
            await createParameter(form);
        }
        await refreshAll();
        setShowModal(false);
    }

    async function handleDelete(id) {
        if (!confirm('Delete this parameter?')) return;
        await deleteParameter(id);
        await refreshAll();
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Global parameters</h2>
                <button onClick={openAdd} className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                    + Global param
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="text-gray-400 text-xs uppercase tracking-wide">
                <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Group</th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {parameters.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400 py-4 text-xs">None</td></tr>
                )}
                {parameters.map(p => (
                    <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-2.5">
                            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">{p.type}</span>
                        </td>
                        <td className="px-4 py-2.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${groupColor[p.group] || 'bg-gray-100 text-gray-600'}`}>{p.group}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right whitespace-nowrap">
                            <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-600 mr-2 text-xs">Edit</button>
                            <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <Modal title={editing ? 'Edit global parameter' : 'Add global parameter'} onClose={() => setShowModal(false)}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                {PARAM_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Group (scope)</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={form.group}
                                onChange={e => setForm({ ...form, group: e.target.value })}
                            >
                                {GLOBAL_GROUPS.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setShowModal(false)} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}