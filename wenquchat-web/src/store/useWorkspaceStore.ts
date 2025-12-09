import { create } from 'zustand'
import type { WorkspaceState, Message, MediaAsset } from '../types'

// 清除所有状态数据 - 空状态
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    chatHistory: [],
    mediaAssets: [],
    selectedAssetId: null,
    contextFiles: [],

    // 空操作函数
    addMessage: (_message: Message) => set((state) => ({
        chatHistory: [...state.chatHistory, _message]
    })),

    addMediaAsset: (_asset: MediaAsset) => set((state) => ({
        mediaAssets: [...state.mediaAssets, _asset]
    })),

    setSelectedAssetId: (_id: string | null) => set({ selectedAssetId: _id }),

    addContextFile: (_asset: MediaAsset) => set((state) => {
        if (state.contextFiles.some(f => f.id === _asset.id)) return state;
        return { contextFiles: [...state.contextFiles, _asset] };
    }),

    removeContextFile: (_assetId: string) => set((state) => ({
        contextFiles: state.contextFiles.filter(f => f.id !== _assetId)
    })),

    updateMessage: (_id: string, _updates: Partial<Message>) => set((state) => ({
        chatHistory: state.chatHistory.map((msg) =>
            msg.id === _id ? { ...msg, ..._updates } : msg
        ),
    })),

    clearChat: () => set({ 
        chatHistory: [], 
        mediaAssets: [], 
        selectedAssetId: null,
        contextFiles: []
    }),
}))
