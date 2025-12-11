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
    createTime?: string;
    creator?: string;
    custom?: string;
    description?: {
        color?: string;
        elements?: string;
        festivalInfo?: string;
        theme?: string;
        summary?: string;
    };
    materialId?: string;
    materialName?: string;
    materialType?: string; // 改为可选字段，某些情况下可能缺失
    mediaInfo?: {
        cover?: string;
        format?: string;
        height?: number;
        size?: number;
        url?: string;
        width?: number;
        duration?: number;
    };
    project?: string;
    sourceFiles?: {
        filename: string;
        url: string;
    }[];
    tags?: string[];
    usageType?: string;
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
        format?: string; // 文件格式
        cover?: string; // 封面图片URL
        fps?: number; // 视频帧率
    };
    relatedMessageId: string; // Associated AI response ID
    // 扩展文件信息（基于接口文档）
    description?: {
        color?: string; // 主色调描述
        elements?: string; // 元素描述
        festivalInfo?: string; // 节日标签
        theme?: string; // 主题描述
    };
    summary?: string; // 摘要
    tags?: string[]; // 标签列表
    project?: string; // 项目名称
    usageType?: string; // 用途类型
    createTime?: string; // 创建时间
    updateTime?: string; // 更新时间
    createBy?: string; // 创建者
    updateBy?: string; // 更新者
    status?: string; // 生命周期状态
    simHash?: string; // 去重哈希
    score?: number; // 相关性得分
    themeBelonging?: string; // 主题归属
    user?: { // 上传者信息
        name: string;
        userId: string;
        avatar?: string | null;
    };
    sourceFiles?: { // 关联文件列表
        filename: string;
        url: string;
    }[];
    // 新增字段
    materialId?: string; // 素材ID
    custom?: string; // 自定义信息
    transcodeStatus?: number; // 转码状态 (0:成功, 1:处理中, 2:失败)
    vectorStatus?: number; // 向量状态 (0:未生成, 1:已生成, 2:失败)
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
    clearChatHistoryOnly: () => void;
    clearMediaAssets: () => void;
    updateMessage: (id: string, updates: Partial<Message>) => void;
}
