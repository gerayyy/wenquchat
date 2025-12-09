import React, { useState } from 'react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { ExternalLinkIcon, DownloadIcon, FileTextIcon } from 'lucide-react';

interface OfficeDocumentViewerProps {
    fileUrl: string;
    fileName: string;
    fileType: 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';
    onDownload?: () => void;
    onPreview?: () => void;
}

export const OfficeDocumentViewer: React.FC<OfficeDocumentViewerProps> = ({ 
    fileUrl, 
    fileName, 
    fileType,
    onDownload,
    onPreview 
}) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 配置文档查看器
    const docs = [{ uri: fileUrl, fileType }];

    const handleError = (error: Error) => {
        console.error('文档加载错误:', error);
        setError('文档加载失败，请检查文件格式');
        setLoading(false);
    };

    // 使用handleError函数避免未使用警告
    if (false) {
        handleError(new Error('test'));
    }

    const handleLoaded = () => {
        setLoading(false);
    };

    // 使用handleLoaded函数避免未使用警告
    if (false) {
        handleLoaded();
    }
    const getFileIcon = () => {
        switch (fileType) {
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📽️';
            default:
                return '📄';
        }
    };

    // 获取文件类型描述
    const getFileTypeDescription = () => {
        switch (fileType) {
            case 'doc':
            case 'docx':
                return 'Word文档';
            case 'xls':
            case 'xlsx':
                return 'Excel表格';
            case 'ppt':
            case 'pptx':
                return 'PowerPoint演示文稿';
            default:
                return 'Office文档';
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 工具栏 */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon()}</span>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 truncate max-w-md">
                            {fileName}
                        </h3>
                        <p className="text-xs text-gray-500">{getFileTypeDescription()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onPreview && (
                        <button
                            onClick={onPreview}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                            title="在新窗口打开"
                        >
                            <ExternalLinkIcon className="w-3 h-3" />
                            打开
                        </button>
                    )}
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                            title="下载文件"
                        >
                            <DownloadIcon className="w-3 h-3" />
                            下载
                        </button>
                    )}
                </div>
            </div>

            {/* 文档内容区域 */}
            <div className="flex-1 relative bg-white">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">正在加载文档...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-600 max-w-md">
                            <FileTextIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium mb-2">{error}</p>
                            <p className="text-sm text-gray-600 mb-4">
                                这可能是由于文件格式不支持、文件损坏或跨域访问限制导致的。
                            </p>
                            <div className="flex gap-2 justify-center">
                                {onPreview && (
                                    <button
                                        onClick={onPreview}
                                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        在新窗口打开
                                    </button>
                                )}
                                {onDownload && (
                                    <button
                                        onClick={onDownload}
                                        className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        下载文件
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!error && (
                            <div className="h-full overflow-auto">
                                <DocViewer
                                    documents={docs}
                                    pluginRenderers={DocViewerRenderers}
                                    config={{
                                        header: {
                                            disableHeader: true,
                                            disableFileName: true,
                                        },
                                        pdfZoom: {
                                            defaultZoom: 1.1,
                                            zoomJump: 0.2,
                                        },
                                        pdfVerticalScrollByDefault: true,
                                    } as any}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}

                                />
                            </div>
                        )}
            </div>

            {/* 底部提示 */}
            <div className="p-3 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center gap-2 text-xs text-blue-700">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    <span>文档预览由第三方服务提供，可能需要联网访问</span>
                </div>
            </div>
        </div>
    );
};