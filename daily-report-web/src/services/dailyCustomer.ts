import { request } from '../utils/request';

export interface DailyReport {
  id?: number;
  createUserId?: number;
  createUserName?: string;
  createTime?: string;
  updateTime?: string;
  customerId?: number;
  reportContent: string;
}

export interface DailyCustomerLog {
  id?: number;
  createUserId?: number;
  createUserName?: string;
  createTime?: string;
  updateTime?: string;
  customerId?: number;
  batchId?: string;
  fieldKey?: string;
  fieldName?: string;
  newValue?: string;
  oldValue?: string;
}

export interface DailyCustomer {
  id?: number;
  source: string;
  abbreviation: string;
  fullName: string;
  dept: string;
  industry: string;
  base: string;
  name: string;
  phone: string;
  wechatCode: string;
  isContact: number;
  isCooperation: number;
  isOpportunity: number;
  opportunityStatus: string;
  createTime?: string;
  updateTime?: string;
  createUserId?: number;
  dailyReport?: DailyReport;
  dailyCustomerLogs?: DailyCustomerLog[];
  dailyReports?: DailyReport[];
}

export interface PageResult<T> {
  current: number;
  hitCount: boolean;
  optimizeCountSql: boolean;
  orders: unknown[];
  pages: number;
  records: T[];
  searchCount: boolean;
  size: number;
  total: number;
}

export async function createDailyCustomer(customers: DailyCustomer[]): Promise<string> {
  const response = await request<string>('/dailyCustomer/create', {
    method: 'POST',
    body: JSON.stringify(customers),
  });

  return response.data;
}

export async function getDailyCustomerList(
  pageNum: number = 1,
  pageSize: number = 10
): Promise<PageResult<DailyCustomer>> {
  const response = await request<PageResult<DailyCustomer>>('/dailyCustomer/list', {
    params: { pageNum, pageSize },
  });

  return response.data;
}

export async function getDailyCustomerDetail(id: number): Promise<DailyCustomer> {
  const response = await request<DailyCustomer>('/dailyCustomer/detail', {
    params: { id },
  });

  return response.data;
}
