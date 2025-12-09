import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChatConsole } from '../chat/ChatConsole';
import { MediaGallery } from '../gallery/MediaGallery';

// 主布局组件 - 已移除所有预览器相关功能
export const MainLayout: React.FC = () => {
    console.log('MainLayout组件 - 预览器功能已完全清除');
    
    return (
        <div className="h-screen w-screen overflow-hidden p-4 md:p-6 lg:p-8">
            <PanelGroup direction="horizontal" className="gap-4 md:gap-6">
                <Panel defaultSize={30} minSize={20} maxSize={50} className="flex flex-col">
                    <div className="flex-1 rounded-[32px] shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden">
                        <div className="h-full w-full bg-white/40 backdrop-blur-md rounded-[32px] border border-white/20 overflow-hidden hover:bg-white/50 transition-colors duration-300">
                            <ChatConsole />
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1.5 bg-white/20 hover:bg-white/40 transition-colors cursor-col-resize rounded-full backdrop-blur-sm" />

                <Panel defaultSize={70} className="flex flex-col">
                    <div className="flex-1 rounded-[32px] shadow-smooth transition-all duration-300 hover:shadow-smooth-hover overflow-hidden">
                        <div className="h-full w-full bg-white/40 backdrop-blur-md rounded-[32px] border border-white/20 overflow-hidden hover:bg-white/50 transition-colors duration-300">
                            <MediaGallery />
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
            {/* UniversalPreviewer组件已完全移除 */}
        </div>
    );
};
