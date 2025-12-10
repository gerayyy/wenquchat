import { create } from 'zustand'
import type { WorkspaceState, Message, MediaAsset } from '../types'

// 清除所有状态数据 - 空状态
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    chatHistory: [],
    mediaAssets: [],
    selectedAssetId: null,
    contextFiles: [],

    // 空操作函数
    addMessage: (message: Message) => set((state) => ({
        chatHistory: [...state.chatHistory, message]
    })),

    addMediaAsset: (asset: MediaAsset) => set((state) => ({
        mediaAssets: [...state.mediaAssets, asset]
    })),

    setSelectedAssetId: (id: string | null) => set({ selectedAssetId: id }),

    addContextFile: (asset: MediaAsset) => set(() => {
        // 仅保留一个文件，新插入的文件会替换前一个
        return { contextFiles: [asset] };
    }),

    removeContextFile: (assetId: string) => set((state) => ({
        contextFiles: state.contextFiles.filter(f => f.id !== assetId)
    })),

    updateMessage: (id: string, updates: Partial<Message>) => set((state) => ({
        chatHistory: state.chatHistory.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
        ),
    })),

    clearChat: () => set({ 
        chatHistory: [], 
        mediaAssets: [], 
        selectedAssetId: null,
        contextFiles: []
    }),
    
    // 只清空聊天历史，保留媒体资源（知识看板卡片）
    clearChatHistoryOnly: () => set({ 
        chatHistory: [], 
        selectedAssetId: null,
        contextFiles: []
        // 注意：不清空 mediaAssets，保留知识看板卡片
    }),
}))
