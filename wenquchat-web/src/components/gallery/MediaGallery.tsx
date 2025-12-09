import React from 'react';

export const MediaGallery: React.FC = () => {
    // 媒体资源功能已清除，始终显示空状态
    console.log('媒体资源功能已禁用');
    
    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-4 border-b border-white/10 font-semibold bg-white/10 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-foreground/90">知识看板</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/10">
                        0 项
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 rounded-3xl bg-white/30 flex items-center justify-center shadow-inner">
                        <div className="w-12 h-12 border-2 border-dashed border-white/40 rounded-xl" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-foreground/80">媒体资源功能已禁用</p>
                        <p className="text-sm text-muted-foreground/80">API调用逻辑已清除</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
