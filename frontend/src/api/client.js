const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
    }
    return res.json();
}

// Teams
export const getTeams = () => request('/teams');
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) });
export const updateTeam = (id, data) => request(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTeam = (id) => request(`/teams/${id}`, { method: 'DELETE' });

// Parameters
export const getParameters = () => request('/parameters');
export const createParameter = (data) => request('/parameters', { method: 'POST', body: JSON.stringify(data) });
export const updateParameter = (id, data) => request(`/parameters/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteParameter = (id) => request(`/parameters/${id}`, { method: 'DELETE' });

// Meetings
export const getMeetingsForTeam = (teamId) => request(`/meetings/team/${teamId}`);
export const createMeeting = (data) => request('/meetings', { method: 'POST', body: JSON.stringify(data) });
export const deleteMeeting = (id) => request(`/meetings/${id}`, { method: 'DELETE' });