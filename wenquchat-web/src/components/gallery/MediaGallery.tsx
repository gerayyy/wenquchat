import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { MediaAsset } from '@/types';
import { FileIcon, DownloadIcon, ExternalLinkIcon, ImageIcon, FileTextIcon, FileSpreadsheetIcon, Presentation, FileArchiveIcon, MessageSquareIcon } from 'lucide-react';
import { MediaDetailModal } from './MediaDetailModal';

export const MediaGallery: React.FC = () => {
    const { mediaAssets, addContextFile } = useWorkspaceStore();
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
    const [showFilters, setShowFilters] = useState(false);
    
    // 根据文件类型获取对应的图标
    const getFileIcon = (type: MediaAsset['type']) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="w-4 h-4" />;
            case 'pdf':
                return <FileTextIcon className="w-4 h-4" />;
            case 'doc':
            case 'docx':
                return <FileTextIcon className="w-4 h-4" />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheetIcon className="w-4 h-4" />;
            case 'ppt':
            case 'pptx':
                return <Presentation className="w-4 h-4" />;
            case 'psd':
                return <FileArchiveIcon className="w-4 h-4" />;
            default:
                return <FileIcon className="w-4 h-4" />;
        }
    };

    // 格式化文件大小
    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    // 处理文件下载
    const handleDownload = (asset: MediaAsset) => {
        if (asset.downloadUrl) {
            window.open(asset.downloadUrl, '_blank');
        } else {
            window.open(asset.url, '_blank');
        }
    };

    // 处理文件预览
    const handlePreview = (asset: MediaAsset) => {
        window.open(asset.url, '_blank');
    };

    // 处理卡片点击 - 打开详情弹窗
    const handleCardClick = (asset: MediaAsset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    // 关闭弹窗
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    // 筛选媒体资源
    const filteredMediaAssets = mediaAssets.filter(asset => {
        switch (filterType) {
            case 'image':
                return asset.type === 'image';
            case 'video':
                return asset.type === 'video';
            case 'document':
                return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(asset.type);
            default:
                return true;
        }
    });

    // 检查当前筛选类型是否有可用内容
    const hasContentForFilterType = () => {
        switch (filterType) {
            case 'image':
                return mediaAssets.some(asset => asset.type === 'image');
            case 'video':
                return mediaAssets.some(asset => asset.type === 'video');
            case 'document':
                return mediaAssets.some(asset => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(asset.type));
            default:
                return mediaAssets.length > 0;
        }
    };

    // 调试日志
    // 获取筛选按钮文本
    const getFilterButtonText = () => {
        switch (filterType) {
            case 'image':
                return '仅图片';
            case 'video':
                return '仅视频';
            case 'document':
                return '仅文档';
            default:
                return '全部';
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent" key={`gallery-container-${filterType}`}>
            <div 
                className="p-4 border-b border-white/10 font-semibold bg-white/10 backdrop-blur-sm flex justify-between items-center group relative"
                onMouseEnter={() => setShowFilters(true)}
                onMouseLeave={() => setShowFilters(false)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-foreground/90">知识看板</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/10">
                        {filteredMediaAssets.length} 项
                    </span>
                </div>
                
                {/* 筛选按钮组 - 悬停时显示 */}
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 transition-all duration-300 ${showFilters ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-2 py-1 text-[10px] rounded-full border transition-all duration-200 ${
                            filterType === 'all' 
                                ? 'bg-primary/20 text-primary border-primary/30' 
                                : 'bg-white/10 text-foreground/70 border-white/20 hover:bg-white/20'
                        }`}
                    >
                        全部
                    </button>
                    <button
                        onClick={() => setFilterType('image')}
                        className={`px-2 py-1 text-[10px] rounded-full border transition-all duration-200 ${
                            filterType === 'image' 
                                ? 'bg-primary/20 text-primary border-primary/30' 
                                : 'bg-white/10 text-foreground/70 border-white/20 hover:bg-white/20'
                        }`}
                    >
                        仅图片
                    </button>
                    <button
                        onClick={() => setFilterType('video')}
                        className={`px-2 py-1 text-[10px] rounded-full border transition-all duration-200 ${
                            filterType === 'video' 
                                ? 'bg-primary/20 text-primary border-primary/30' 
                                : 'bg-white/10 text-foreground/70 border-white/20 hover:bg-white/20'
                        }`}
                    >
                        仅视频
                    </button>
                    <button
                        onClick={() => setFilterType('document')}
                        className={`px-2 py-1 text-[10px] rounded-full border transition-all duration-200 ${
                            filterType === 'document' 
                                ? 'bg-primary/20 text-primary border-primary/30' 
                                : 'bg-white/10 text-foreground/70 border-white/20 hover:bg-white/20'
                        }`}
                    >
                        仅文档
                    </button>
                </div>

                {/* 装饰性圆点 - 筛选按钮隐藏时显示 */}
                <div className={`flex gap-1 transition-opacity duration-300 ${showFilters ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
            </div>
            


            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {filteredMediaAssets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-white/30 flex items-center justify-center shadow-inner">
                            <div className="w-12 h-12 border-2 border-dashed border-white/40 rounded-xl" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-foreground/80">
                                {filterType === 'all' ? '暂无媒体资源' : `暂无${getFilterButtonText()}内容`}
                            </p>
                            <p className="text-sm text-muted-foreground/80">
                                {filterType === 'all' ? '智能体收集的文件将在此显示' : '当前筛选条件下没有找到内容'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}} key={`grid-${filterType}-${filteredMediaAssets.length}`}>
                        {filteredMediaAssets.map((asset) => (
                            <div
                                key={`${asset.id}-${filterType}`}
                                className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-[280px] flex flex-col"
                                onClick={() => handleCardClick(asset)}
                            >
                                {/* 图片类型显示缩略图 */}
                                {asset.type === 'image' && (
                                    <div className="rounded-lg overflow-hidden mb-3 border border-white/20 group-hover:scale-105 transition-transform duration-300 h-32 flex-shrink-0">
                                        <img
                                            src={asset.url}
                                            alt={asset.filename}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* 文件图标 */}
                                {asset.type !== 'image' && (
                                    <div className="flex justify-center mb-3 flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-primary border border-white/40">
                                            {getFileIcon(asset.type)}
                                        </div>
                                    </div>
                                )}
                                
                                {/* 文件信息 */}
                                <div className="space-y-2 flex-1 min-h-0">
                                    <h3 className="font-medium text-foreground text-xs leading-tight line-clamp-2">
                                        {asset.filename}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span className="capitalize bg-white/50 px-2 py-0.5 rounded-full">
                                            {asset.type}
                                        </span>
                                        {asset.metadata?.size && (
                                            <span className="bg-white/50 px-2 py-0.5 rounded-full">
                                                {formatFileSize(asset.metadata.size)}
                                            </span>
                                        )}
                                    </div>

                                    {/* 图片分辨率 */}
                                    {asset.metadata?.width && asset.metadata?.height && (
                                        <div className="text-[10px] text-muted-foreground text-center bg-white/50 px-2 py-0.5 rounded-full">
                                            {asset.metadata.width}×{asset.metadata.height}
                                        </div>
                                    )}
                                </div>

                                {/* 操作按钮 - 默认一直显示 */}
                                <div className="mt-auto flex gap-1 flex-shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreview(asset);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-white/70 hover:bg-white/90 text-foreground rounded-lg border border-white/40 transition-colors"
                                    >
                                        <ExternalLinkIcon className="w-3 h-3" />
                                        预览
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addContextFile(asset);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/20 transition-colors"
                                    >
                                        <MessageSquareIcon className="w-3 h-3" />
                                        插入对话
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 详情弹窗 */}
            <MediaDetailModal
                asset={selectedAsset}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDownload={addContextFile}
                onPreview={handlePreview}
            />
        </div>
    );
};
