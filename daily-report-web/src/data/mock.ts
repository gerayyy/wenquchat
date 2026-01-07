export interface Client {
    id: string;
    name: string;
    shortName: string;
    status: 'active' | 'inactive';
    submitter: string;
    lastUpdate: string;
}

export interface Report {
    id: string;
    clientId: string;
    content: string;
    date: string;
    submitter: string;
}

export interface HistoryEvent {
    id: string;
    clientId: string;
    date: string;
    action: string;
    details: string;
}

export const MOCK_CLIENTS: Client[] = [
    { id: '1', name: 'TechCorp Industries', shortName: 'TechCorp', status: 'active', submitter: 'Alice', lastUpdate: '2023-10-26' },
    { id: '2', name: 'Global Solutions Ltd', shortName: 'GlobalSol', status: 'active', submitter: 'Bob', lastUpdate: '2023-10-25' },
    { id: '3', name: 'InnovateX', shortName: 'InnovateX', status: 'inactive', submitter: 'Alice', lastUpdate: '2023-10-20' },
    { id: '4', name: 'Alpha Stream', shortName: 'Alpha', status: 'active', submitter: 'Charlie', lastUpdate: '2023-10-27' },
    { id: '5', name: 'Beta Works', shortName: 'Beta', status: 'active', submitter: 'Alice', lastUpdate: '2023-10-27' },
    { id: '6', name: 'Gamma Ray', shortName: 'Gamma', status: 'active', submitter: 'Bob', lastUpdate: '2023-10-24' },
    { id: '7', name: 'Delta Force', shortName: 'Delta', status: 'active', submitter: 'Charlie', lastUpdate: '2023-10-23' },
];

export const MOCK_REPORTS: Report[] = [
    { id: 'r1', clientId: '1', content: 'Discussed Q4 roadmap. Client is happy with progress.', date: '2023-10-26', submitter: 'Alice' },
    { id: 'r2', clientId: '2', content: 'Renewed contract for 2024.', date: '2023-10-25', submitter: 'Bob' },
    { id: 'r3', clientId: '4', content: 'Initial meeting regarding new project scope.', date: '2023-10-27', submitter: 'Charlie' },
];

export const MOCK_HISTORY: HistoryEvent[] = [
    { id: 'h1', clientId: '1', date: '2023-10-26 14:00', action: 'Report Submitted', details: 'Discussed Q4 roadmap.' },
    { id: 'h2', clientId: '1', date: '2023-10-20 09:00', action: 'Info Updated', details: 'Changed contact person.' },
    { id: 'h3', clientId: '1', date: '2023-09-15 10:00', action: 'Created', details: 'New client added.' },
    { id: 'h4', clientId: '2', date: '2023-10-25 11:30', action: 'Report Submitted', details: 'Renewed contract.' },
];
