import { useState, useEffect } from 'react';
import { getTeams, getParameters } from './api/client';
import TeamsPanel from './components/TeamsPanel';
import ParametersPanel from './components/ParametersPanel';
import TeamView from './components/TeamView';
import TeamParametersView from './components/TeamParametersView';

export default function App() {
    const [teams, setTeams] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [viewingParams, setViewingParams] = useState(false);
    const [loading, setLoading] = useState(true);

    async function refreshAll() {
        const [t, p] = await Promise.all([getTeams(), getParameters()]);
        setTeams(t);
        setParameters(p);
    }

    useEffect(() => {
        refreshAll().finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-400 text-sm">Loading...</div>;
    }

    if (selectedTeam && viewingParams) {
        return (
            <TeamParametersView
                team={selectedTeam}
                parameters={parameters}
                refreshAll={refreshAll}
                onBack={() => setViewingParams(false)}
            />
        );
    }

    if (selectedTeam) {
        return (
            <TeamView
                team={selectedTeam}
                onBack={() => setSelectedTeam(null)}
                onOpenParameters={() => setViewingParams(true)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Manager</h1>
            <div className="flex gap-6 items-start">
                <div className="w-1/2">
                    <TeamsPanel teams={teams} refreshAll={refreshAll} onSelectTeam={setSelectedTeam} />
                </div>
                <div className="w-1/2">
                    <ParametersPanel parameters={parameters} refreshAll={refreshAll} />
                </div>
            </div>
        </div>
    );
}