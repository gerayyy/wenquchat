import { create } from 'zustand'
import type { WorkspaceState, Message, MediaAsset } from '../types'

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    chatHistory: [],
    mediaAssets: [],
    selectedAssetId: null,
    contextFiles: [],

    addMessage: (message: Message) => set((state) => ({
        chatHistory: [...state.chatHistory, message]
    })),

    addMediaAsset: (asset: MediaAsset) => set((state) => ({
        mediaAssets: [...state.mediaAssets, asset]
    })),

    setSelectedAssetId: (id: string | null) => set({ selectedAssetId: id }),

    addContextFile: (asset: MediaAsset) => set((state) => {
        if (state.contextFiles.some(f => f.id === asset.id)) return state;
        return { contextFiles: [...state.contextFiles, asset] };
    }),

    removeContextFile: (assetId: string) => set((state) => ({
        contextFiles: state.contextFiles.filter(f => f.id !== assetId)
    })),

    updateMessage: (id: string, updates: Partial<Message>) => set((state) => ({
        chatHistory: state.chatHistory.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
        ),
    })),

    clearChat: () => set({ chatHistory: [] }),
}))
