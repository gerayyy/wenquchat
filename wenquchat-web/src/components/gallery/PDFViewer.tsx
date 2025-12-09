import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react';

// 设置PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    fileUrl: string;
    fileName: string;
    pageCount?: number;
    onDownload?: () => void;
    onPreview?: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onDownload, onPreview }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error('PDF加载失败:', error);
        setError('PDF文件加载失败');
        setLoading(false);
    };

    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const zoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3.0));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    const resetZoom = () => {
        setScale(1.0);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 工具栏 */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="上一页"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    
                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg">
                        {pageNumber} / {numPages || '?'}
                    </span>
                    
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="下一页"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={zoomOut}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="缩小"
                    >
                        <ZoomOutIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={resetZoom}
                        className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="重置缩放"
                    >
                        {Math.round(scale * 100)}%
                    </button>
                    
                    <button
                        onClick={zoomIn}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="放大"
                    >
                        <ZoomInIcon className="w-4 h-4" />
                    </button>

                    {onPreview && (
                        <button
                            onClick={onPreview}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors ml-2"
                            title="在新窗口打开"
                        >
                            <ExternalLinkIcon className="w-4 h-4" />
                        </button>
                    )}
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors ml-2"
                            title="下载文件"
                        >
                            <DownloadIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* PDF内容区域 */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">正在加载PDF...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-600">
                            <p className="font-medium">{error}</p>
                            <p className="text-sm mt-1">请检查文件是否有效</p>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex justify-center">
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={null}
                            error={null}
                            className="pdf-document"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                loading={null}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="pdf-page shadow-lg"
                            />
                        </Document>
                    </div>
                )}
            </div>

            {/* 底部页码导航 */}
            {numPages && numPages > 1 && (
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: Math.min(numPages, 10) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPageNumber(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                        pageNumber === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {numPages > 10 && (
                            <span className="text-gray-500 text-sm">...</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};