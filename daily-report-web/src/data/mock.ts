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
    { id: '1', name: '科技公司', shortName: '科技', status: 'active', submitter: '爱丽丝', lastUpdate: '2023-10-26' },
    { id: '2', name: '全球解决方案有限公司', shortName: '全球', status: 'active', submitter: '鲍勃', lastUpdate: '2023-10-25' },
    { id: '3', name: '创新公司', shortName: '创新', status: 'inactive', submitter: '爱丽丝', lastUpdate: '2023-10-20' },
    { id: '4', name: '阿尔法公司', shortName: '阿尔法', status: 'active', submitter: '查理', lastUpdate: '2023-10-27' },
    { id: '5', name: '贝塔公司', shortName: '贝塔', status: 'active', submitter: '爱丽丝', lastUpdate: '2023-10-27' },
    { id: '6', name: '伽马公司', shortName: '伽马', status: 'active', submitter: '鲍勃', lastUpdate: '2023-10-24' },
    { id: '7', name: '德尔塔公司', shortName: '德尔塔', status: 'active', submitter: '查理', lastUpdate: '2023-10-23' },
];

export const MOCK_REPORTS: Report[] = [
    { id: 'r1', clientId: '1', content: '讨论了Q4路线图。客户对进展感到满意。', date: '2023-10-26', submitter: '爱丽丝' },
    { id: 'r2', clientId: '2', content: '续签了2024年合同。', date: '2023-10-25', submitter: '鲍勃' },
    { id: 'r3', clientId: '4', content: '关于新项目范围的初次会议。', date: '2023-10-27', submitter: '查理' },
];

export const MOCK_HISTORY: HistoryEvent[] = [
    { id: 'h1', clientId: '1', date: '2023-10-26 14:00', action: '报告提交', details: '讨论了Q4路线图。' },
    { id: 'h2', clientId: '1', date: '2023-10-20 09:00', action: '信息更新', details: '更改了联系人。' },
    { id: 'h3', clientId: '1', date: '2023-09-15 10:00', action: '创建', details: '添加了新客户。' },
    { id: 'h4', clientId: '2', date: '2023-10-25 11:30', action: '报告提交', details: '续签了合同。' },
];
