import React from 'react';
import type { MediaAsset } from '@/types';
import { XIcon, DownloadIcon, ExternalLinkIcon, FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon, MessageSquareIcon } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { OfficeDocumentViewer } from './OfficeDocumentViewer';
import { VideoPlayer } from './VideoPlayer';
import { ImageViewer } from './ImageViewer';

interface MediaDetailModalProps {
    asset: MediaAsset | null;
    isOpen: boolean;
    onClose: () => void;
    onDownload: (asset: MediaAsset) => void;
    onPreview: (asset: MediaAsset) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
    asset,
    isOpen,
    onClose,
    onDownload,
    onPreview
}) => {
    if (!isOpen || !asset) return null;

    // 获取文件扩展名
    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase() || '';
    };

    // 渲染预览内容
    const renderPreviewContent = () => {
        switch (asset.type) {
            case 'image':
                // 使用自定义图片查看器，支持缩放和拖拽
                return (
                    <ImageViewer
                        src={asset.url}
                        alt={asset.filename}
                        className="w-full h-full"
                        maxZoom={5}
                        minZoom={0.5}
                        zoomStep={0.2}
                    />
                );

            case 'pdf':
                // 检查文件扩展名是否为PDF
                const pdfExt = getFileExtension(asset.filename);
                if (pdfExt === 'pdf') {
                    return (
                        <PDFViewer
                            fileUrl={asset.url}
                            fileName={asset.filename}
                            pageCount={asset.metadata?.pageCount}
                            onDownload={() => onDownload(asset)}
                            onPreview={() => onPreview(asset)}
                        />
                    );
                }
                break;

            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'ppt':
            case 'pptx':
                // 检查文件扩展名是否为Office文档
                const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
                const officeExt = getFileExtension(asset.filename);
                if (officeExtensions.includes(officeExt)) {
                    return (
                        <OfficeDocumentViewer
                            fileUrl={asset.url}
                            fileName={asset.filename}
                            fileType={asset.type}
                            onDownload={() => onDownload(asset)}
                            onPreview={() => onPreview(asset)}
                        />
                    );
                }
                break;

            case 'mp4':
            case 'avi':
            case 'mov':
            case 'wmv':
            case 'flv':
            case 'mkv':
                // 检查文件扩展名是否为视频格式
                const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v'];
                const fileExt = getFileExtension(asset.filename);
                if (videoExtensions.includes(fileExt)) {
                    return (
                        <VideoPlayer
                            fileUrl={asset.url}
                            fileName={asset.filename}
                            onDownload={() => onDownload(asset)}
                            onPreview={() => onPreview(asset)}
                        />
                    );
                }
                break;

            default:
                return (
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4">
                            {getFileIcon(asset.type)}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{asset.filename}</h3>
                        <p className="text-gray-500 text-sm mb-4">此文件类型不支持预览</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => onPreview(asset)}
                                className="flex items-center gap-1 px-2 py-1 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <ExternalLinkIcon className="w-3 h-3" />
                                打开文件
                            </button>
                            <button
                                onClick={() => onDownload(asset)}
                                className="flex items-center gap-1 px-2 py-1 text-[10px] bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                <MessageSquareIcon className="w-3 h-3" />
                                插入对话
                            </button>
                        </div>
                    </div>
                );
        }
    };

    // 根据文件类型获取对应的图标
    const getFileIcon = (type: MediaAsset['type']) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="w-6 h-6" />;
            case 'pdf':
                return <FileTextIcon className="w-6 h-6" />;
            case 'doc':
            case 'docx':
                return <FileTextIcon className="w-6 h-6" />;
            case 'xls':
            case 'xlsx':
                return <FileTextIcon className="w-6 h-6" />;
            case 'ppt':
            case 'pptx':
                return <FileTextIcon className="w-6 h-6" />;
            case 'psd':
                return <FileArchiveIcon className="w-6 h-6" />;
            default:
                return <FileIcon className="w-6 h-6" />;
        }
    };

    // 格式化文件大小
    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                            {getFileIcon(asset.type)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                                {asset.filename}
                            </h2>
                            <p className="text-sm text-gray-500 capitalize">{asset.type} 文件</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <XIcon className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row max-h-[calc(80vh-80px)]">
                    {/* 左侧预览区 */}
                    <div className="lg:w-2/3 p-6 bg-gray-50 flex items-center justify-center overflow-y-auto relative">
                        {renderPreviewContent()}
                    </div>

                    {/* 右侧信息区 */}
                    <div className="lg:w-1/3 p-6 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">文件信息</h3>
                        
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {/* 文件标识 */}
                            {(asset.id || asset.materialId) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">文件标识</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.materialId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">素材ID:</span>
                                                <span className="text-gray-900 text-xs font-mono truncate max-w-32">{asset.materialId}</span>
                                            </div>
                                        )}
                                        {asset.id && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">资源ID:</span>
                                                <span className="text-gray-900 text-xs font-mono truncate max-w-32">{asset.id}</span>
                                            </div>
                                        )}
                                        {asset.simHash && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">去重哈希:</span>
                                                <span className="text-gray-900 text-xs font-mono truncate max-w-32">{asset.simHash}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 基本信息 */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">基本信息</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">文件名:</span>
                                        <span className="text-gray-900 font-medium truncate max-w-32">{asset.filename}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">文件类型:</span>
                                        <span className="text-gray-900 capitalize">{asset.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">MIME类型:</span>
                                        <span className="text-gray-900 text-xs font-mono">{asset.mimeType}</span>
                                    </div>
                                    {asset.metadata?.size && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">文件大小:</span>
                                            <span className="text-gray-900">{formatFileSize(asset.metadata.size)}</span>
                                        </div>
                                    )}
                                    {asset.metadata?.format && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">文件格式:</span>
                                            <span className="text-gray-900">{asset.metadata.format}</span>
                                        </div>
                                    )}
                                    {asset.usageType && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">用途类型:</span>
                                            <span className="text-gray-900">{asset.usageType}</span>
                                        </div>
                                    )}
                                    {asset.project && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">所属项目:</span>
                                            <span className="text-gray-900">{asset.project}</span>
                                        </div>
                                    )}
                                    {asset.custom && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">自定义:</span>
                                            <span className="text-gray-900">{asset.custom}</span>
                                        </div>
                                    )}
                                    {asset.status && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">状态:</span>
                                            <span className="text-gray-900">{asset.status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 创建信息 */}
                            {(asset.createBy || asset.user || asset.createTime) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">创建信息</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.user && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">上传者:</span>
                                                <span className="text-gray-900">{asset.user.name}</span>
                                            </div>
                                        )}
                                        {asset.createBy && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">创建者:</span>
                                                <span className="text-gray-900">{asset.createBy}</span>
                                            </div>
                                        )}
                                        {asset.createTime && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">创建时间:</span>
                                                <span className="text-gray-900">{new Date(asset.createTime).toLocaleString('zh-CN')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 媒体信息 */}
                            {asset.metadata && (asset.metadata.width || asset.metadata.height || asset.metadata.duration || asset.metadata.pageCount || asset.metadata.cover || asset.metadata.fps) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">媒体信息</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.metadata.width && asset.metadata.height && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">分辨率:</span>
                                                <span className="text-gray-900">{asset.metadata.width} × {asset.metadata.height}</span>
                                            </div>
                                        )}
                                        {asset.metadata.duration && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">时长:</span>
                                                <span className="text-gray-900">{Math.floor(asset.metadata.duration / 60)}:{(asset.metadata.duration % 60).toString().padStart(2, '0')}</span>
                                            </div>
                                        )}
                                        {asset.metadata.fps && asset.metadata.fps > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">帧率:</span>
                                                <span className="text-gray-900">{asset.metadata.fps} fps</span>
                                            </div>
                                        )}
                                        {asset.metadata.pageCount && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">页数:</span>
                                                <span className="text-gray-900">{asset.metadata.pageCount} 页</span>
                                            </div>
                                        )}
                                        {asset.metadata.cover && (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-500">封面图:</span>
                                                </div>
                                                <img 
                                                    src={asset.metadata.cover} 
                                                    alt="封面预览"
                                                    className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => window.open(asset.metadata?.cover, '_blank')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 描述信息 */}
                            {asset.description && (asset.description.theme || asset.description.color || asset.description.festivalInfo || asset.description.elements) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">描述信息</h4>
                                    <div className="space-y-3 text-sm">
                                        {asset.description.theme && (
                                            <div>
                                                <span className="text-gray-500 font-medium">主题:</span>
                                                <p className="text-gray-900 mt-1">{asset.description.theme}</p>
                                            </div>
                                        )}
                                        {asset.description.color && (
                                            <div>
                                                <span className="text-gray-500 font-medium">主色调:</span>
                                                <p className="text-gray-900 mt-1">{asset.description.color}</p>
                                            </div>
                                        )}
                                        {asset.description.festivalInfo && (
                                            <div>
                                                <span className="text-gray-500 font-medium">节日标签:</span>
                                                <p className="text-gray-900 mt-1">{asset.description.festivalInfo}</p>
                                            </div>
                                        )}
                                        {asset.description.elements && (
                                            <div>
                                                <span className="text-gray-500 font-medium">元素:</span>
                                                <p className="text-gray-900 mt-1">{asset.description.elements}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 摘要 */}
                            {asset.summary && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">摘要</h4>
                                    <p className="text-sm text-gray-900">{asset.summary}</p>
                                </div>
                            )}

                            {/* 标签 */}
                            {asset.tags && asset.tags.length > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">标签</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {asset.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 时间信息 */}
                            {(asset.createTime || asset.updateTime) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">时间信息</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.createTime && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">创建时间:</span>
                                                <span className="text-gray-900">{new Date(asset.createTime).toLocaleString('zh-CN')}</span>
                                            </div>
                                        )}
                                        {asset.updateTime && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">更新时间:</span>
                                                <span className="text-gray-900">{new Date(asset.updateTime).toLocaleString('zh-CN')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 关联文件 */}
                            {asset.sourceFiles && asset.sourceFiles.length > 0 && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">关联文件</h4>
                                    <div className="space-y-2">
                                        {asset.sourceFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <span className="text-sm text-gray-900 truncate flex-1">{file.filename}</span>
                                                <button
                                                    onClick={() => window.open(file.url, '_blank')}
                                                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    打开
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 评分与分析 */}
                            {(asset.score || asset.themeBelonging) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">评分与分析</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.score && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">相关性得分:</span>
                                                <span className="text-gray-900 font-medium">{asset.score.toFixed(3)}</span>
                                            </div>
                                        )}
                                        {asset.themeBelonging && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">主题归属:</span>
                                                <span className="text-gray-900">{asset.themeBelonging}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 技术信息 */}
                            {(asset.transcodeStatus !== undefined || asset.vectorStatus !== undefined) && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">技术信息</h4>
                                    <div className="space-y-2 text-sm">
                                        {asset.transcodeStatus !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">转码状态:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    asset.transcodeStatus === 0 ? 'bg-green-100 text-green-800' : 
                                                    asset.transcodeStatus === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {asset.transcodeStatus === 0 ? '成功' : 
                                                     asset.transcodeStatus === 1 ? '处理中' : '失败'}
                                                </span>
                                            </div>
                                        )}
                                        {asset.vectorStatus !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">向量状态:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    asset.vectorStatus === 1 ? 'bg-green-100 text-green-800' : 
                                                    asset.vectorStatus === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {asset.vectorStatus === 1 ? '已生成' : 
                                                     asset.vectorStatus === 0 ? '未生成' : '失败'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 关联信息 */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">关联信息</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">消息ID:</span>
                                        <span className="text-gray-900 text-xs font-mono truncate max-w-32">{asset.relatedMessageId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">资源ID:</span>
                                        <span className="text-gray-900 text-xs font-mono truncate max-w-32">{asset.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="mt-6 flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => onPreview(asset)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <ExternalLinkIcon className="w-3 h-3" />
                                在新窗口打开
                            </button>
                            <button
                                onClick={() => onDownload(asset)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                <MessageSquareIcon className="w-3 h-3" />
                                插入对话
                            </button>
                        </div>
                        
                        {/* 下载文件按钮 - 浅色样式 */}
                        <div className="mt-2 flex-shrink-0">
                            <button
                                onClick={() => onDownload(asset)}
                                className="w-full flex items-center justify-center gap-1 px-2 py-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                            >
                                <DownloadIcon className="w-3 h-3" />
                                下载文件
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};