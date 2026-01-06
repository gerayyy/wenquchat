import React from 'react';
import { Button } from '../ui/button';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ResultPageProps {
  onBack: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ onBack }) => {
  return (
    <div className="animate-in slide-in-from-bottom-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          提交结果
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="floating-input rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          {/* 成功图标 */}
          <div className="bg-green-100/80 backdrop-blur-sm p-6 rounded-full mb-6 border border-green-200/50">
            <CheckCircle2 className="h-12 w-12 text-green-600 animate-pulse" />
          </div>
          
          {/* 成功信息 */}
          <h3 className="text-2xl font-bold mb-4 text-foreground">提交成功</h3>
          <p className="text-muted-foreground mb-8 max-w-md">
            您的日报已成功提交，感谢您的认真填写。
          </p>
          
          {/* 返回按钮 */}
          <Button 
            onClick={onBack}
            className="text-base py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            返回填写准备
          </Button>
        </div>
      </CardContent>
    </div>
  );
};