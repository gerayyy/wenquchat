export interface Client {
    id: string;
    name: string;
    shortName: string;
    status: 'active' | 'inactive';
    submitter: string;
    lastUpdate: string;
    // 基本信息字段
    industry: string;          // 行业
    contactPerson: string;     // 对接人
    department: string;        // 部门
    base: string;              // 所在地
    contactInfo: string;       // 联系方式
    wechat: string;            // 微信号
    entryDate: string;         // 入库时间
    contacted: boolean;        // 联系上客户
    cooperated: boolean;       // 已合作
    hasBusiness: boolean;      // 有商机
    expectedSignDate: string;  // 预计签单时间
    businessAttribute: string; // 商机属性
    projectCategory: string;   // 项目类别
    expectedAmount: string;    // 预计商机金额
    businessStatus: string;    // 商机状态
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
    { 
        id: '1', 
        name: '科技公司', 
        shortName: '科技', 
        status: 'active', 
        submitter: '爱丽丝', 
        lastUpdate: '2023-10-26',
        // 基本信息
        industry: '互联网', 
        contactPerson: '张三', 
        department: '技术部', 
        base: '北京', 
        contactInfo: '13800138000', 
        wechat: 'zhangsan123', 
        entryDate: '2023-01-15', 
        contacted: true, 
        cooperated: true, 
        hasBusiness: true, 
        expectedSignDate: '2023-11-30', 
        businessAttribute: '新增', 
        projectCategory: '软件开发', 
        expectedAmount: '50万', 
        businessStatus: '进行中'
    },
    { 
        id: '2', 
        name: '全球解决方案有限公司', 
        shortName: '全球', 
        status: 'active', 
        submitter: '鲍勃', 
        lastUpdate: '2023-10-25',
        // 基本信息
        industry: '金融', 
        contactPerson: '李四', 
        department: '财务部', 
        base: '上海', 
        contactInfo: '13900139000', 
        wechat: 'lisi456', 
        entryDate: '2023-02-20', 
        contacted: true, 
        cooperated: true, 
        hasBusiness: false, 
        expectedSignDate: '', 
        businessAttribute: '', 
        projectCategory: '', 
        expectedAmount: '', 
        businessStatus: '已完成'
    },
    { 
        id: '3', 
        name: '创新公司', 
        shortName: '创新', 
        status: 'inactive', 
        submitter: '爱丽丝', 
        lastUpdate: '2023-10-20',
        // 基本信息
        industry: '人工智能', 
        contactPerson: '王五', 
        department: '研发部', 
        base: '深圳', 
        contactInfo: '13700137000', 
        wechat: 'wangwu789', 
        entryDate: '2023-03-10', 
        contacted: true, 
        cooperated: false, 
        hasBusiness: true, 
        expectedSignDate: '2023-12-15', 
        businessAttribute: '跟进', 
        projectCategory: 'AI解决方案', 
        expectedAmount: '100万', 
        businessStatus: '待定'
    },
    { 
        id: '4', 
        name: '阿尔法公司', 
        shortName: '阿尔法', 
        status: 'active', 
        submitter: '查理', 
        lastUpdate: '2023-10-27',
        // 基本信息
        industry: '制造业', 
        contactPerson: '赵六', 
        department: '生产部', 
        base: '广州', 
        contactInfo: '13600136000', 
        wechat: 'zhaoliu1011', 
        entryDate: '2023-04-05', 
        contacted: false, 
        cooperated: false, 
        hasBusiness: false, 
        expectedSignDate: '', 
        businessAttribute: '', 
        projectCategory: '', 
        expectedAmount: '', 
        businessStatus: '未接触'
    },
    { 
        id: '5', 
        name: '贝塔公司', 
        shortName: '贝塔', 
        status: 'active', 
        submitter: '爱丽丝', 
        lastUpdate: '2023-10-27',
        // 基本信息
        industry: '教育', 
        contactPerson: '孙七', 
        department: '教学部', 
        base: '杭州', 
        contactInfo: '13500135000', 
        wechat: 'sunqi1213', 
        entryDate: '2023-05-15', 
        contacted: true, 
        cooperated: false, 
        hasBusiness: true, 
        expectedSignDate: '2024-01-20', 
        businessAttribute: '新增', 
        projectCategory: '在线教育', 
        expectedAmount: '30万', 
        businessStatus: '进行中'
    },
    { 
        id: '6', 
        name: '伽马公司', 
        shortName: '伽马', 
        status: 'active', 
        submitter: '鲍勃', 
        lastUpdate: '2023-10-24',
        // 基本信息
        industry: '医疗', 
        contactPerson: '周八', 
        department: '医疗部', 
        base: '武汉', 
        contactInfo: '13400134000', 
        wechat: 'zhouba1415', 
        entryDate: '2023-06-20', 
        contacted: true, 
        cooperated: true, 
        hasBusiness: true, 
        expectedSignDate: '2023-11-10', 
        businessAttribute: '续费', 
        projectCategory: '医疗系统', 
        expectedAmount: '80万', 
        businessStatus: '已签单'
    },
    { 
        id: '7', 
        name: '德尔塔公司', 
        shortName: '德尔塔', 
        status: 'active', 
        submitter: '查理', 
        lastUpdate: '2023-10-23',
        // 基本信息
        industry: '能源', 
        contactPerson: '吴九', 
        department: '能源部', 
        base: '成都', 
        contactInfo: '13300133000', 
        wechat: 'wujiu1617', 
        entryDate: '2023-07-10', 
        contacted: true, 
        cooperated: false, 
        hasBusiness: false, 
        expectedSignDate: '', 
        businessAttribute: '', 
        projectCategory: '', 
        expectedAmount: '', 
        businessStatus: '跟进中'
    },
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
