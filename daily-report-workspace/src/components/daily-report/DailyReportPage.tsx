import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CardContent, CardHeader, CardTitle } from '../ui/card';

interface DailyReportPageProps {
  onSubmit: () => void;
}

// 客户信息接口
interface Customer {
  id: number;
  name: string;
  industry: string;
  contact: string;
  department: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  expectedAmount: string;
  description: string;
}

// 示例客户数据
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: '阿里巴巴',
    industry: '互联网',
    contact: '张三',
    department: '技术部',
    phone: '13800138000',
    email: 'zhangsan@alibaba.com',
    address: '杭州市余杭区',
    status: '跟进中',
    expectedAmount: '100万',
    description: '电商巨头，需求较大',
  },
  {
    id: 2,
    name: '腾讯',
    industry: '互联网',
    contact: '李四',
    department: '产品部',
    phone: '13900139000',
    email: 'lisi@tencent.com',
    address: '深圳市南山区',
    status: '已合作',
    expectedAmount: '80万',
    description: '社交和游戏领域的领导者',
  },
];

// 示例新增客户数量
const NEW_CUSTOMER_COUNT = 2;

export const DailyReportPage: React.FC<DailyReportPageProps> = ({ onSubmit }) => {
  // 日报内容
  const [dailyReports, setDailyReports] = useState<Record<number, string>>({});
  // 新增客户信息
  const [newCustomers, setNewCustomers] = useState<Record<number, Partial<Customer>>>(
    Array.from({ length: NEW_CUSTOMER_COUNT }, (_, index) => index + mockCustomers.length + 1)
      .reduce((acc, id) => {
        acc[id] = {};
        return acc;
      }, {} as Record<number, Partial<Customer>>)
  );
  // 新增客户的日报内容
  const [newCustomerReports, setNewCustomerReports] = useState<Record<number, string>>(
    Array.from({ length: NEW_CUSTOMER_COUNT }, (_, index) => index + mockCustomers.length + 1)
      .reduce((acc, id) => {
        acc[id] = '';
        return acc;
      }, {} as Record<number, string>)
  );

  // 处理日报内容变化
  const handleReportChange = (customerId: number, content: string) => {
    setDailyReports(prev => ({
      ...prev,
      [customerId]: content,
    }));
  };

  // 处理新增客户信息变化
  const handleNewCustomerChange = (customerId: number, field: keyof Customer, value: string) => {
    setNewCustomers(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value,
      },
    }));
  };

  // 处理新增客户日报内容变化
  const handleNewCustomerReportChange = (customerId: number, content: string) => {
    setNewCustomerReports(prev => ({
      ...prev,
      [customerId]: content,
    }));
  };

  // 处理提交
  const handleSubmit = () => {
    // 这里可以验证数据
    const allReports = {
      ...dailyReports,
      ...newCustomerReports,
    };
    
    // 检查是否所有必填项都已填写
    const hasEmptyReport = Object.values(allReports).some(report => report.trim() === '');
    
    if (hasEmptyReport) {
      // 模拟提交失败
      alert('请填写所有日报内容');
      return;
    }
    
    // 模拟提交成功
    console.log('Daily reports:', allReports);
    console.log('New customers:', newCustomers);
    onSubmit();
  };

  return (
    <div className="animate-in slide-in-from-bottom-2">
      <CardHeader className="mb-10">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
          日报填写
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-10">
          {/* 现有客户卡片 */}
          {mockCustomers.map(customer => (
            <div key={customer.id} className="rounded-3xl shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden">
              <div className="h-full w-full bg-white/25 backdrop-blur-xl rounded-3xl border border-white/30 overflow-hidden hover:bg-white/35 transition-all duration-500">
                <CardHeader className="pb-6 border-b border-white/20 px-8 pt-8">
                  <CardTitle className="text-2xl font-bold text-foreground tracking-tight">{customer.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* 客户基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">行业</p>
                        <p className="font-semibold text-foreground text-lg">{customer.industry}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">联系人</p>
                        <p className="font-semibold text-foreground text-lg">{customer.contact}</p>
                      </div>
                      <div className="floating-input rounded-xl p-3">
                        <p className="text-sm text-muted-foreground mb-1">部门</p>
                        <p className="font-medium text-foreground">{customer.department}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">电话</p>
                        <p className="font-semibold text-foreground text-lg">{customer.phone}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">邮箱</p>
                        <p className="font-semibold text-foreground text-lg">{customer.email}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">地址</p>
                        <p className="font-semibold text-foreground text-lg">{customer.address}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">状态</p>
                        <p className="font-semibold text-foreground text-lg">{customer.status}</p>
                      </div>
                      <div className="floating-input rounded-2xl p-4">
                        <p className="text-base text-muted-foreground mb-2 font-medium">预计金额</p>
                        <p className="font-semibold text-foreground text-lg">{customer.expectedAmount}</p>
                      </div>
                    </div>
                    
                    {/* 日报填写框 */}
                    <div className="floating-input rounded-3xl p-6">
                      <p className="text-lg font-semibold mb-4 text-foreground tracking-tight">本次日报填写</p>
                      <Textarea
                        placeholder="请详细填写今日跟进情况、客户反馈、下一步计划..."
                        value={dailyReports[customer.id] || ''}
                        onChange={(e) => handleReportChange(customer.id, e.target.value)}
                        className="min-h-[160px] bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl py-4 px-5"
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          ))}

          {/* 新增客户卡片 */}
                {Array.from({ length: NEW_CUSTOMER_COUNT }, (_, index) => {
                  const customerId = index + mockCustomers.length + 1;
                  return (
                    <div key={customerId} className="rounded-3xl shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden">
                      <div className="h-full w-full bg-white/25 backdrop-blur-xl rounded-3xl border border-white/30 overflow-hidden hover:bg-white/35 transition-all duration-500">
                        <CardHeader className="pb-6 border-b border-white/20 px-8 pt-8">
                          <CardTitle className="text-2xl font-bold text-foreground tracking-tight">新增客户 {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="space-y-8">
                            {/* 新增客户基本信息 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">客户名称 *</p>
                                <Input
                                  placeholder="请输入客户名称"
                                  value={newCustomers[customerId]?.name || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'name', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">行业</p>
                                <Input
                                  placeholder="请输入行业"
                                  value={newCustomers[customerId]?.industry || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'industry', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">联系人</p>
                                <Input
                                  placeholder="请输入联系人"
                                  value={newCustomers[customerId]?.contact || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'contact', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">部门</p>
                                <Input
                                  placeholder="请输入部门"
                                  value={newCustomers[customerId]?.department || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'department', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">电话</p>
                                <Input
                                  placeholder="请输入电话"
                                  value={newCustomers[customerId]?.phone || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'phone', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                              <div className="floating-input rounded-2xl p-4">
                                <p className="text-base text-muted-foreground mb-2 font-medium">邮箱</p>
                                <Input
                                  placeholder="请输入邮箱"
                                  value={newCustomers[customerId]?.email || ''}
                                  onChange={(e) => handleNewCustomerChange(customerId, 'email', e.target.value)}
                                  className="bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl"
                                />
                              </div>
                            </div>
                            
                            {/* 日报填写框 */}
                            <div className="floating-input rounded-3xl p-6">
                              <p className="text-lg font-semibold mb-4 text-foreground tracking-tight">本次日报填写 *</p>
                              <Textarea
                                placeholder="请填写今日跟进情况..."
                                value={newCustomerReports[customerId] || ''}
                                onChange={(e) => handleNewCustomerReportChange(customerId, e.target.value)}
                                className="min-h-[160px] bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-base rounded-2xl py-4 px-5"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  );
                })}

          {/* 提交按钮 */}
          <div className="pt-6">
            <Button 
              onClick={handleSubmit}
              className="w-full lg:w-auto text-lg py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              确认入库
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};