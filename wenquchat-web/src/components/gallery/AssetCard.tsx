import React from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import type { MediaAsset } from '@/types';

interface AssetCardProps {
    asset: MediaAsset;
}

// 资源卡片功能已清除 - 仅显示占位符
export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
    console.log('AssetCard功能已禁用，资产：', asset.filename);
    
    return (
        <Card className="overflow-hidden border-white/20 bg-white/40 backdrop-blur-sm rounded-2xl opacity-50">
            <div className="aspect-square bg-black/5 relative flex items-center justify-center overflow-hidden">
                <div className="text-primary/40">
                    <FileIcon className="w-8 h-8" />
                </div>
            </div>
            <CardFooter className="p-3 bg-white/20 border-t border-white/10">
                <div className="truncate text-xs font-medium w-full text-foreground/60" title={asset.filename}>
                    {asset.filename}
                </div>
            </CardFooter>
        </Card>
    );
};
