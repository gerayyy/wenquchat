import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { AssetCard } from './AssetCard';

export const MediaGallery: React.FC = () => {
    const { mediaAssets } = useWorkspaceStore();

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-4 border-b border-white/10 font-semibold bg-white/10 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-foreground/90">知识看板</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/10">
                        {mediaAssets.length} 项
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {mediaAssets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 rounded-3xl bg-white/30 flex items-center justify-center shadow-inner">
                            <div className="w-12 h-12 border-2 border-dashed border-white/40 rounded-xl" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-foreground/80">暂无媒体资源</p>
                            <p className="text-sm text-muted-foreground/80">可以开始跟我对话来获取企业知识</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {mediaAssets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
