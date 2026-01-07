# 日报系统 - 数据结构说明

本文档描述了日报系统中使用的模拟数据结构和关系。

## 1. 客户数据 (Client)

### 接口定义
```typescript
export interface Client {
    id: string;           // 客户唯一标识符
    name: string;         // 客户全称
    shortName: string;    // 客户简称
    status: 'active' | 'inactive';  // 客户状态（活跃/非活跃）
    submitter: string;    // 跟进人
    lastUpdate: string;   // 最后更新日期
}
```

### 状态说明
- `active`: 活跃客户（显示绿色小圆点）
- `inactive`: 非活跃客户（显示灰色小圆点）

## 2. 报告数据 (Report)

### 接口定义
```typescript
export interface Report {
    id: string;           // 报告唯一标识符
    clientId: string;     // 关联的客户ID
    content: string;      // 报告内容
    date: string;         // 报告日期
    submitter: string;    // 提交人
}
```

## 3. 历史记录数据 (HistoryEvent)

### 接口定义
```typescript
export interface HistoryEvent {
    id: string;           // 事件唯一标识符
    clientId: string;     // 关联的客户ID
    date: string;         // 事件日期时间
    action: string;       // 事件类型（报告提交、信息更新等）
    details: string;      // 事件详情
}
```

## 4. 数据关系

- **客户与报告**: 一个客户可以有多条报告记录，通过`clientId`字段关联
- **客户与历史记录**: 一个客户可以有多条历史记录，通过`clientId`字段关联

## 5. 示例数据

### 客户数据示例
```typescript
export const MOCK_CLIENTS: Client[] = [
    { id: '1', name: '科技公司', shortName: '科技', status: 'active', submitter: '爱丽丝', lastUpdate: '2023-10-26' },
    { id: '2', name: '全球解决方案有限公司', shortName: '全球', status: 'active', submitter: '鲍勃', lastUpdate: '2023-10-25' },
    { id: '3', name: '创新公司', shortName: '创新', status: 'inactive', submitter: '爱丽丝', lastUpdate: '2023-10-20' },
    // 更多客户数据...
];
```

### 报告数据示例
```typescript
export const MOCK_REPORTS: Report[] = [
    { id: 'r1', clientId: '1', content: '讨论了Q4路线图。客户对进展感到满意。', date: '2023-10-26', submitter: '爱丽丝' },
    { id: 'r2', clientId: '2', content: '续签了2024年合同。', date: '2023-10-25', submitter: '鲍勃' },
    // 更多报告数据...
];
```

### 历史记录示例
```typescript
export const MOCK_HISTORY: HistoryEvent[] = [
    { id: 'h1', clientId: '1', date: '2023-10-26 14:00', action: '报告提交', details: '讨论了Q4路线图。' },
    { id: 'h2', clientId: '1', date: '2023-10-20 09:00', action: '信息更新', details: '更改了联系人。' },
    // 更多历史记录...
];
```

## 6. 数据统计

- 当前系统包含 **7个模拟客户**
- 其中 **6个客户** 状态为 `active`（活跃）
- 其中 **1个客户** 状态为 `inactive`（非活跃）
- 系统包含 **3条报告记录** 和 **4条历史记录**