import React, { useState } from 'react';

import { Button } from '../ui/button';
import { PreparationPage } from '../daily-report/PreparationPage';
import { DailyReportPage } from '../daily-report/DailyReportPage';
import { ResultPage } from '../daily-report/ResultPage';
import { CustomerPage } from '../daily-report/CustomerPage';

// 主布局组件 - 应用原项目的毛玻璃效果和卡片设计
export const MainLayout: React.FC = () => {
  // 页面状态管理
  const [currentPage, setCurrentPage] = useState<'preparation' | 'dailyReport' | 'result' | 'customer'>('preparation');
  
  // 导航到不同页面
  const navigateTo = (page: 'preparation' | 'dailyReport' | 'result' | 'customer') => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'preparation' ? (
        /* 准备页面 - 全屏白色半透明卡片 */
        <div className="min-h-screen flex items-center justify-center p-6 md:p-8 lg:p-10">
          <div className="w-full max-w-4xl">
            <div className="rounded-[2rem] shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden animate-in zoom-in">
              <div className="h-full w-full bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/30 overflow-hidden">
                <div className="p-8 md:p-10">
                  <PreparationPage onNext={() => navigateTo('dailyReport')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 其他页面 - 保持原有布局 */
        <div className="min-h-screen p-6 md:p-8 lg:p-10">
          {/* 顶部导航栏 - 增强毛玻璃效果 */}
          <div className="mb-10 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground animate-in fade-in tracking-tight">
              日报工作台
            </h1>
            <div className="flex gap-3 floating-input rounded-2xl p-3">
              <Button 
                onClick={() => navigateTo('preparation')}
                variant="ghost"
                className="rounded-xl transition-all duration-300 px-6 py-2 font-medium"
              >
                填写准备
              </Button>
              <Button 
                onClick={() => navigateTo('customer')}
                variant={currentPage === 'customer' ? 'default' : 'ghost'}
                className="rounded-xl transition-all duration-300 px-6 py-2 font-medium"
              >
                客户资料
              </Button>
            </div>
          </div>

          {/* 主内容区域 - 增强毛玻璃效果 */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-[2rem] shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden animate-in zoom-in">
              <div className="h-full w-full bg-white/30 backdrop-blur-xl rounded-[2rem] border border-white/30 overflow-hidden hover:bg-white/40 transition-all duration-500">
                <div className="p-8 md:p-10">
                  {/* 根据当前页面状态渲染不同组件 */}
                  {currentPage === 'dailyReport' && <DailyReportPage onSubmit={() => navigateTo('result')} />}
                  {currentPage === 'result' && <ResultPage onBack={() => navigateTo('preparation')} />}
                  {currentPage === 'customer' && <CustomerPage />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};