export type MediaType = 'image' | 'video' | 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'psd' | 'unknown';

export interface MediaAsset {
    id: string;
    filename: string;
    url: string; // Preview URL
    downloadUrl?: string; // Original file download URL
    type: MediaType;
    mimeType: string;
    metadata?: {
        width?: number;
        height?: number;
        duration?: number; // Video duration
        pageCount?: number; // PDF/PPT page count
    };
    relatedMessageId: string; // Associated AI response ID
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string; // Plain text
    timestamp: number;
}

export interface WorkspaceState {
    chatHistory: Message[];
    mediaAssets: MediaAsset[];
    selectedAssetId: string | null;
    contextFiles: MediaAsset[];
    addMessage: (message: Message) => void;
    addMediaAsset: (asset: MediaAsset) => void;
    setSelectedAssetId: (id: string | null) => void;
    addContextFile: (asset: MediaAsset) => void;
    removeContextFile: (assetId: string) => void;
    clearChat: () => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
}
