import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

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
  submitter: string;
  lastReport: string;
  updateTime: string;
  tracks: CustomerTrack[];
}

// 客户轨迹接口
interface CustomerTrack {
  id: number;
  date: string;
  content: string;
  operator: string;
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
    submitter: '王五',
    lastReport: '今天与客户沟通了项目需求，客户对我们的方案很感兴趣',
    updateTime: '2024-01-06 14:30',
    tracks: [
      {
        id: 1,
        date: '2024-01-06',
        content: '联系客户：沟通项目需求',
        operator: '王五',
      },
      {
        id: 2,
        date: '2024-01-05',
        content: '日报详情：提交了客户需求分析',
        operator: '王五',
      },
      {
        id: 3,
        date: '2024-01-04',
        content: '新增客户：创建了客户档案',
        operator: '王五',
      },
    ],
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
    submitter: '赵六',
    lastReport: '客户确认了合作意向，正在准备合同',
    updateTime: '2024-01-06 10:15',
    tracks: [
      {
        id: 1,
        date: '2024-01-06',
        content: '联系客户：确认合作意向',
        operator: '赵六',
      },
      {
        id: 2,
        date: '2024-01-05',
        content: '日报详情：提交了合作方案',
        operator: '赵六',
      },
    ],
  },
  {
    id: 3,
    name: '百度',
    industry: '互联网',
    contact: '钱七',
    department: '技术部',
    phone: '13700137000',
    email: 'qianqi@baidu.com',
    address: '北京市海淀区',
    status: '跟进中',
    expectedAmount: '60万',
    description: '搜索引擎巨头',
    submitter: '王五',
    lastReport: '与客户技术团队进行了深入交流',
    updateTime: '2024-01-05 16:45',
    tracks: [
      {
        id: 1,
        date: '2024-01-05',
        content: '联系客户：技术交流',
        operator: '王五',
      },
      {
        id: 2,
        date: '2024-01-04',
        content: '日报详情：提交了技术方案',
        operator: '王五',
      },
    ],
  },
];

// 筛选选项类型
type FilterOption = 'all' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'bySubmitter';

export const CustomerPage: React.FC = () => {
  // 筛选状态
  const [filter, setFilter] = useState<FilterOption>('all');
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');
  // 轨迹弹窗状态
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  // 当前查看轨迹的客户
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // 处理筛选变化
  const handleFilterChange = (option: FilterOption) => {
    setFilter(option);
  };

  // 处理搜索变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 处理查看轨迹
  const handleViewTrack = (customer: Customer) => {
    setCurrentCustomer(customer);
    setTrackDialogOpen(true);
  };

  // 过滤客户列表
  const filteredCustomers = mockCustomers.filter(customer => {
    // 搜索过滤
    if (searchKeyword) {
      return customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
             customer.contact.toLowerCase().includes(searchKeyword.toLowerCase());
    }
    // 其他筛选逻辑可以在这里添加
    return true;
  });

  return (
    <div>
      <CardHeader>
        <CardTitle>客户资料查看</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 筛选和搜索区域 */}
          <div className="space-y-4">
            {/* 筛选按钮组 */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('all')}
                size="sm"
              >
                全部客户
              </Button>
              <Button 
                variant={filter === 'yesterday' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('yesterday')}
                size="sm"
              >
                昨日更新
              </Button>
              <Button 
                variant={filter === 'thisWeek' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('thisWeek')}
                size="sm"
              >
                本周更新
              </Button>
              <Button 
                variant={filter === 'thisMonth' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('thisMonth')}
                size="sm"
              >
                本月更新
              </Button>
              <Button 
                variant={filter === 'bySubmitter' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('bySubmitter')}
                size="sm"
              >
                按人筛选
              </Button>
            </div>
            
            {/* 搜索框 */}
            <div className="flex gap-2">
              <Input
                placeholder="搜索客户名称或联系人"
                value={searchKeyword}
                onChange={handleSearchChange}
                className="flex-1"
              />
              <Button>搜索</Button>
            </div>
          </div>

          {/* 客户数量统计 */}
          <div>
            <p className="text-sm text-muted-foreground">当前总计：{filteredCustomers.length} 条记录</p>
          </div>

          {/* 客户卡片列表 */}
          <div className="space-y-4">
            {filteredCustomers.map(customer => (
              <Card key={customer.id} className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 客户基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">行业</p>
                        <p>{customer.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">联系人</p>
                        <p>{customer.contact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">部门</p>
                        <p>{customer.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">电话</p>
                        <p>{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">状态</p>
                        <p>{customer.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">预计金额</p>
                        <p>{customer.expectedAmount}</p>
                      </div>
                    </div>
                    
                    {/* 提交信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">提交人</p>
                        <p>{customer.submitter}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">更新时间</p>
                        <p>{customer.updateTime}</p>
                      </div>
                    </div>
                    
                    {/* 最新日报 */}
                    <div>
                      <p className="text-sm text-muted-foreground">最新日报</p>
                      <p className="text-sm">{customer.lastReport}</p>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTrack(customer)}
                      >
                        查看客户轨迹
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                      >
                        编辑客户信息
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>

      {/* 客户轨迹弹窗 */}
      <Dialog open={trackDialogOpen} onOpenChange={setTrackDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentCustomer?.name} - 客户轨迹</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentCustomer?.tracks.map((track) => (
              <div key={track.id} className="relative pl-8 pb-6 border-l-2 border-gray-200">
                {/* 时间点 */}
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                {/* 轨迹内容 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{track.date}</p>
                    <p className="text-sm text-muted-foreground">操作人：{track.operator}</p>
                  </div>
                  <p className="text-sm">{track.content}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setTrackDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};