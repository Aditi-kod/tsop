const STORAGE_KEY = 'teams_app_data';

const defaultData = {
    teams: [
        { id: '1', name: 'Echo1', type: 'Backend', domain: 'tech' },
    ],
    // Global parameters (common / type-scoped)
    globalParameters: [
        { id: 'gp1', name: 'No. of members', type: 'number', group: 'common' },
    ],
    // Per-team individual parameters
    teamParameters: {
        '1': [],
    },
};

export function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultData;
    } catch {
        return defaultData;
    }
}

export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Returns all parameters visible to a team:
// global common + type-matched + team-specific
export function getParamsForTeam(data, team) {
    const global = data.globalParameters.filter(
        p => p.group === 'common' || p.group.toLowerCase() === team.type.toLowerCase()
    );
    const individual = data.teamParameters[team.id] || [];
    return { global, individual };
}