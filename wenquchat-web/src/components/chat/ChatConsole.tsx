import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, XIcon, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/lib/api';

export const ChatConsole: React.FC = () => {
    const { chatHistory, contextFiles, removeContextFile, addMessage, clearChat } = useWorkspaceStore();
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // 自动调整文本框高度
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // 最大高度120px
            textareaRef.current.style.height = newHeight + 'px';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        adjustTextareaHeight();
    };

    const handleSend = async () => {
        if (!inputValue.trim() && contextFiles.length === 0) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            text: inputValue,
            timestamp: Date.now(),
        };
        addMessage(userMsg);
        setInputValue('');
        
        // 重置文本框高度
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        // TODO: Call API here
        sendMessage(inputValue, contextFiles);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10 font-semibold flex items-center gap-2 bg-white/10 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                    <span className="ml-2 text-foreground/80">智能助手·问渠</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/10">V1.0</span>
                </div>

                {/* Message List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-4" ref={scrollRef}>
                    {chatHistory.length === 0 && (
                        <div className="text-center text-muted-foreground mt-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner">
                                <SendIcon className="w-8 h-8 text-primary/60" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground/90">欢迎使用问渠工作台</h3>
                            <p className="text-sm text-muted-foreground/80 max-w-xs mx-auto leading-relaxed">
                                让企业知识触手可及
                            </p>
                        </div>
                    )}
                    {chatHistory.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className="flex items-start gap-2 max-w-[85%]">
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                                        <SendIcon className="w-3 h-3 text-primary/60 rotate-180" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "px-5 py-3.5 text-sm shadow-sm backdrop-blur-sm bg-white/60 text-foreground border border-white/40 rounded-2xl shadow-sm",
                                        msg.role === 'user'
                                            ? "rounded-tr-sm"
                                            : "rounded-tl-sm"
                                    )}
                                >
                                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                                        <SendIcon className="w-3 h-3 text-primary/60" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area - 悬浮样式 */}
                <div className="p-4">
                    <div className="floating-input rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 hover:shadow-xl mb-2">
                        {/* Context Files */}
                        {contextFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 border-b border-black/5">
                                {contextFiles.map((file) => (
                                    <div key={file.id} className="flex items-center gap-1 bg-white/90 text-foreground px-3 py-1 rounded-full text-xs border border-white/50 shadow-sm animate-in zoom-in duration-200">
                                        <FileIcon className="w-3 h-3 text-primary" />
                                        <span className="max-w-[150px] truncate">{file.filename}</span>
                                        <button onClick={() => removeContextFile(file.id)} className="hover:text-destructive transition-colors p-0.5 rounded-full hover:bg-black/5">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 items-center px-3 py-2">
                            <Textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="输入消息..."
                                className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent px-1 py-1 min-h-[24px] max-h-[120px] overflow-y-auto resize-none placeholder:text-muted-foreground/70 text-sm leading-relaxed scrollbar-thin"
                                rows={1}
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="rounded-full h-8 w-8 shrink-0 bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
                            >
                                <SendIcon className="w-3.5 h-3.5 text-white" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={clearChat}
                            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground hover:bg-black/5 px-2 py-1 rounded-full transition-colors"
                        >
                            清空当前对话
                        </button>
                    </div>
                </div>
        </div>
    );
};
