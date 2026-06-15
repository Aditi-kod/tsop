import { useState } from 'react';
import Modal from './Modal';
import { generateId, saveData, getParamsForTeam } from '../data/store';

const PARAM_TYPES = ['fixed text', 'number', 'task done Y/N', 'rule understanding Y/N', 'date', 'desired/expected'];
const GLOBAL_GROUPS = ['common', 'sunshine', 'hr', 'gm', 'tech', 'gd', 'smm'];
const emptyGlobal = { name: '', type: 'number', group: 'common' };
const emptyIndividual = { name: '', type: 'number' };

export default function ParametersPanel({ data, setData, selectedTeam }) {
    const [modalType, setModalType] = useState(null); // 'global' | 'individual' | 'editGlobal' | 'editIndividual'
    const [editingId, setEditingId] = useState(null);
    const [globalForm, setGlobalForm] = useState(emptyGlobal);
    const [indForm, setIndForm] = useState(emptyIndividual);

    const { global: scopedParams, individual: indParams } = selectedTeam
        ? getParamsForTeam(data, selectedTeam)
        : { global: data.globalParameters, individual: [] };

    // ── Global param handlers ──────────────────────────────
    function openAddGlobal() {
        setGlobalForm(emptyGlobal);
        setEditingId(null);
        setModalType('global');
    }

    function openEditGlobal(p) {
        setGlobalForm({ name: p.name, type: p.type, group: p.group });
        setEditingId(p.id);
        setModalType('editGlobal');
    }

    function saveGlobal() {
        if (!globalForm.name.trim()) return;
        let updated;
        if (editingId) {
            updated = {
                ...data,
                globalParameters: data.globalParameters.map(p =>
                    p.id === editingId ? { ...p, ...globalForm } : p
                ),
            };
        } else {
            updated = {
                ...data,
                globalParameters: [...data.globalParameters, { id: generateId(), ...globalForm }],
            };
        }
        setData(updated);
        saveData(updated);
        setModalType(null);
    }

    function deleteGlobal(id) {
        if (!confirm('Delete this parameter?')) return;
        const updated = { ...data, globalParameters: data.globalParameters.filter(p => p.id !== id) };
        setData(updated);
        saveData(updated);
    }

    // ── Individual param handlers ──────────────────────────
    function openAddIndividual() {
        setIndForm(emptyIndividual);
        setEditingId(null);
        setModalType('individual');
    }

    function openEditIndividual(p) {
        setIndForm({ name: p.name, type: p.type });
        setEditingId(p.id);
        setModalType('editIndividual');
    }

    function saveIndividual() {
        if (!indForm.name.trim() || !selectedTeam) return;
        const existing = data.teamParameters[selectedTeam.id] || [];
        let updatedList;
        if (editingId) {
            updatedList = existing.map(p => p.id === editingId ? { ...p, ...indForm } : p);
        } else {
            updatedList = [...existing, { id: generateId(), ...indForm }];
        }
        const updated = {
            ...data,
            teamParameters: { ...data.teamParameters, [selectedTeam.id]: updatedList },
        };
        setData(updated);
        saveData(updated);
        setModalType(null);
    }

    function deleteIndividual(id) {
        if (!confirm('Delete this parameter?')) return;
        const updated = {
            ...data,
            teamParameters: {
                ...data.teamParameters,
                [selectedTeam.id]: (data.teamParameters[selectedTeam.id] || []).filter(p => p.id !== id),
            },
        };
        setData(updated);
        saveData(updated);
    }

    const groupColor = {
        common: 'bg-blue-100 text-blue-700',
        sunshine: 'bg-yellow-100 text-yellow-700',
        program: 'bg-green-100 text-green-700',
        backend: 'bg-purple-100 text-purple-700',
        support: 'bg-orange-100 text-orange-700',
    };

    const isModal = modalType !== null;
    const isGlobalModal = modalType === 'global' || modalType === 'editGlobal';
    const isIndModal = modalType === 'individual' || modalType === 'editIndividual';

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">
                    Parameters
                    {selectedTeam && (
                        <span className="ml-2 font-normal text-gray-400">— {selectedTeam.name}</span>
                    )}
                </h2>
                <button
                    onClick={openAddGlobal}
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                >
                    + Global param
                </button>
            </div>

            {/* Scoped / Global params */}
            <div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {selectedTeam ? `Scoped (common + ${selectedTeam.type})` : 'All global parameters'}
                    </p>
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
                    {scopedParams.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center text-gray-400 py-4 text-xs">None</td>
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
                            <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                <button onClick={() => openEditGlobal(p)} className="text-gray-400 hover:text-blue-600 mr-2 text-xs">Edit</button>
                                <button onClick={() => deleteGlobal(p.id)} className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Global param modal */}
            {isGlobalModal && (
                <Modal
                    title={editingId ? 'Edit global parameter' : 'Add global parameter'}
                    onClose={() => setModalType(null)}
                >
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Parameter name"
                                value={globalForm.name}
                                onChange={e => setGlobalForm({ ...globalForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={globalForm.type}
                                onChange={e => setGlobalForm({ ...globalForm, type: e.target.value })}
                            >
                                {PARAM_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Group (scope)</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={globalForm.group}
                                onChange={e => setGlobalForm({ ...globalForm, group: e.target.value })}
                            >
                                {GLOBAL_GROUPS.map(g => <option key={g}>{g}</option>)}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">
                                "common" → all teams · "backend" → all Backend teams · etc.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setModalType(null)} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={saveGlobal} className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Individual param modal */}
            {isIndModal && (
                <Modal
                    title={editingId ? 'Edit individual parameter' : `Add parameter for ${selectedTeam?.name}`}
                    onClose={() => setModalType(null)}
                >
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Parameter name"
                                value={indForm.name}
                                onChange={e => setIndForm({ ...indForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Type</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={indForm.type}
                                onChange={e => setIndForm({ ...indForm, type: e.target.value })}
                            >
                                {PARAM_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setModalType(null)} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={saveIndividual} className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}