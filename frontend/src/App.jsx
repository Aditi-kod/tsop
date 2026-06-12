import { useState } from 'react';
import { loadData } from './data/store';
import TeamsPanel from './components/TeamsPanel';
import ParametersPanel from './components/ParametersPanel';
import TeamView from './components/TeamView';

export default function App() {
    const [data, setData] = useState(loadData);
    const [selectedTeam, setSelectedTeam] = useState(null);

    if (selectedTeam) {
        return (
            <TeamView
                team={selectedTeam}
                data={data}
                setData={setData}
                onBack={() => setSelectedTeam(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Manager</h1>
            <div className="flex gap-6 items-start">
                <div className="w-1/2">
                    <TeamsPanel
                        data={data}
                        setData={setData}
                        onSelectTeam={setSelectedTeam}
                    />
                </div>
                <div className="w-1/2">
                    <ParametersPanel
                        data={data}
                        setData={setData}
                        selectedTeam={null}
                    />
                </div>
            </div>
        </div>
    );
}