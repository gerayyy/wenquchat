import React from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MediaAsset } from '@/types';
import { FileIcon, ImageIcon, VideoIcon, FileTextIcon, DownloadIcon, MessageSquareIcon, EyeIcon } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

interface AssetCardProps {
    asset: MediaAsset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
    const { setSelectedAssetId, addContextFile } = useWorkspaceStore();

    const getIcon = () => {
        switch (asset.type) {
            case 'image': return <ImageIcon className="w-8 h-8" />;
            case 'video': return <VideoIcon className="w-8 h-8" />;
            case 'pdf': return <FileTextIcon className="w-8 h-8" />;
            default: return <FileIcon className="w-8 h-8" />;
        }
    };

    const handlePreview = () => {
        setSelectedAssetId(asset.id);
    };

    const handleAskAI = (e: React.MouseEvent) => {
        e.stopPropagation();
        addContextFile(asset);
    };

    return (
        <Card
            className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-white/20 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:-translate-y-1 rounded-2xl"
            onClick={handlePreview}
        >
            <div className="aspect-square bg-black/5 relative flex items-center justify-center overflow-hidden">
                {asset.type === 'image' ? (
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="text-primary/60 group-hover:text-primary transition-colors duration-300 transform group-hover:scale-110">
                        {getIcon()}
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handlePreview}
                        title="预览"
                        className="rounded-full w-8 h-8 bg-white/90 hover:bg-white text-primary shadow-lg hover:scale-110 transition-all"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleAskAI}
                        title="对此提问"
                        className="rounded-full w-8 h-8 bg-white/90 hover:bg-white text-primary shadow-lg hover:scale-110 transition-all"
                    >
                        <MessageSquareIcon className="w-4 h-4" />
                    </Button>
                    {asset.downloadUrl && (
                        <Button
                            size="icon"
                            variant="secondary"
                            asChild
                            title="下载"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-full w-8 h-8 bg-white/90 hover:bg-white text-primary shadow-lg hover:scale-110 transition-all"
                        >
                            <a href={asset.downloadUrl} download>
                                <DownloadIcon className="w-4 h-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
            <CardFooter className="p-3 bg-white/20 border-t border-white/10">
                <div className="truncate text-xs font-medium w-full text-foreground/80 group-hover:text-primary transition-colors" title={asset.filename}>
                    {asset.filename}
                </div>
            </CardFooter>
        </Card>
    );
};
