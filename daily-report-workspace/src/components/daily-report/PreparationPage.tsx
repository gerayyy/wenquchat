import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CardContent } from '../ui/card';

interface PreparationPageProps {
  onNext: () => void;
}

// 示例客户数据
const mockCustomers = [
  { id: 1, name: '阿里巴巴' },
  { id: 2, name: '腾讯' },
  { id: 3, name: '百度' },
  { id: 4, name: '字节跳动' },
  { id: 5, name: '美团' },
  { id: 6, name: '京东' },
];

export const PreparationPage: React.FC<PreparationPageProps> = ({ onNext }) => {
  // 选中的客户
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  // 新增客户数量
  const [newCustomerCount, setNewCustomerCount] = useState<string>('0');

  // 切换客户选择状态
  const toggleCustomer = (customerId: number) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  // 处理新增客户数量变化
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setNewCustomerCount(value);
    }
  };

  // 处理提交
  const handleSubmit = () => {
    // 这里可以保存选中的客户和新增客户数量
    console.log('Selected customers:', selectedCustomers);
    console.log('New customer count:', newCustomerCount);
    onNext();
  };

  return (
    <div className="animate-in slide-in-from-bottom-2">
      <CardContent>
        <div className="space-y-10">
          {/* 客户选择区域 */}
          <div className="floating-input rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-foreground tracking-tight">个人所属客户列表</h3>
            <div className="flex flex-wrap gap-4">
              {mockCustomers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => toggleCustomer(customer.id)}
                  className={`px-6 py-3 rounded-2xl text-base font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                    selectedCustomers.includes(customer.id) 
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25' 
                      : 'bg-white/70 text-muted-foreground hover:bg-white/90 border border-white/40 hover:border-white/60'
                  }`}
                >
                  {customer.name}
                </button>
              ))}
            </div>
          </div>

          {/* 新增客户数量输入 */}
          <div className="floating-input rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-foreground tracking-tight">新增客户登记</h3>
            <div className="flex items-center gap-6">
              <span className="text-base text-muted-foreground">本次新增：</span>
              <Input
                type="text"
                value={newCustomerCount}
                onChange={handleNewCustomerChange}
                className="w-32 bg-white/80 border-white/40 focus:bg-white/95 transition-all duration-300 text-lg text-center rounded-2xl py-3"
                placeholder="0"
              />
              <span className="text-base text-muted-foreground">个客户</span>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="pt-6">
            <Button 
              onClick={handleSubmit}
              className="w-full text-lg py-4 px-10 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 font-semibold border-0"
            >
              进入日报填写
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};