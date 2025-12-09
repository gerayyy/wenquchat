import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { XIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { readPsd } from 'ag-psd';

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const UniversalPreviewer: React.FC = () => {
    const { selectedAssetId, mediaAssets, setSelectedAssetId } = useWorkspaceStore();
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const asset = mediaAssets.find(a => a.id === selectedAssetId);

    useEffect(() => {
        if (asset?.type === 'psd' && canvasRef.current) {
            fetch(asset.url)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    const psd = readPsd(buffer);
                    if (psd && psd.canvas && canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx) {
                            canvasRef.current.width = psd.width;
                            canvasRef.current.height = psd.height;
                            ctx.drawImage(psd.canvas, 0, 0);
                        }
                    }
                })
                .catch(console.error);
        }
    }, [asset]);

    if (!selectedAssetId || !asset) return null;

    const handleClose = () => {
        setSelectedAssetId(null);
        setPageNumber(1);
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const renderContent = () => {
        switch (asset.type) {
            case 'image':
                return (
                    <Zoom>
                        <img src={asset.url} alt={asset.filename} className="max-w-full max-h-[80vh] object-contain" />
                    </Zoom>
                );
            case 'video':
                return <video src={asset.url} controls className="max-w-full max-h-[80vh]" />;
            case 'pdf':
                return (
                    <div className="flex flex-col items-center bg-white p-4 rounded-lg overflow-auto max-h-[80vh]">
                        <Document file={asset.url} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                        </Document>
                        {numPages > 1 && (
                            <div className="flex items-center gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                    disabled={pageNumber <= 1}
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                </Button>
                                <span>
                                    Page {pageNumber} of {numPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                    disabled={pageNumber >= numPages}
                                >
                                    <ChevronRightIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                );
            case 'psd':
                return (
                    <div className="bg-white p-4 rounded-lg overflow-auto max-h-[80vh]">
                        <canvas ref={canvasRef} className="max-w-full" />
                    </div>
                );
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
            case 'ppt':
            case 'pptx':
                return (
                    <div className="w-full h-[80vh] bg-white rounded-lg overflow-hidden">
                        <DocViewer
                            documents={[{ uri: asset.url, fileType: asset.type }]}
                            pluginRenderers={DocViewerRenderers}
                            style={{ height: '100%' }}
                        />
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-white">
                        <p className="text-xl mb-4">预览暂不支持此文件类型</p>
                        <Button asChild variant="secondary" className="rounded-full">
                            <a href={asset.downloadUrl || asset.url} download>下载文件</a>
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={handleClose}>
            <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 right-0 -mt-10 flex gap-2">
                    {asset.downloadUrl && (
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" asChild>
                            <a href={asset.downloadUrl} download>
                                <DownloadIcon className="w-6 h-6" />
                            </a>
                        </Button>
                    )}
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" onClick={handleClose}>
                        <XIcon className="w-6 h-6" />
                    </Button>
                </div>

                {renderContent()}

                <div className="mt-4 text-white font-medium">{asset.filename}</div>
            </div>
        </div>
    );
};
