export type MediaType = 'image' | 'video' | 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'psd' | 'mp4' | 'avi' | 'mov' | 'wmv' | 'flv' | 'mkv' | 'unknown';

// Coze 工作流相关类型
export interface CozeWorkflowResponse {
    code: number;
    msg: string;
    data: string; // JSON 序列化的字符串
    debug_url: string;
    usage: {
        token_count: number;
        output_count: number;
        input_count: number;
    };
    execute_id?: string;
    detail: {
        logid: string;
    };
}

export interface CozeWorkflowData {
    assistant: string;
    file: CozeFile[];
}

export interface CozeFile {
    createTime: string;
    creator: string;
    custom: string;
    description: {
        color: string;
        elements: string;
        festivalInfo: string;
        theme: string;
    };
    materialId: string;
    materialName: string;
    materialType: string;
    mediaInfo: {
        cover: string;
        format: string;
        height: number;
        size: number;
        url: string;
        width: number;
    };
    project: string;
    sourceFiles?: {
        filename: string;
        url: string;
    }[];
    tags: string[];
    usageType: string;
}

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
        size?: number; // File size in bytes
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
    referencedFiles?: MediaAsset[]; // 引用的文件列表
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
