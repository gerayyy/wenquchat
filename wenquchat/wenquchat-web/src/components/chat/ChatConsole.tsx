import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, XIcon, FileIcon, Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessage, convertCozeFileToMediaAsset } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatConsole: React.FC = () => {
    const { chatHistory, contextFiles, removeContextFile, addMessage, addMediaAsset, clearChatHistoryOnly, clearMediaAssets } = useWorkspaceStore();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        if (isLoading) return; // 防止重复发送

        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            text: inputValue,
            timestamp: Date.now(),
            referencedFiles: [...contextFiles], // 存储引用的文件
        };
        addMessage(userMsg);
        setInputValue('');
        setIsLoading(true);
        
        // 重置文本框高度
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        // 添加等待中的助手消息
        const tempAssistantMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            text: '正在思考中...',
            timestamp: Date.now() + 1,
        };
        addMessage(tempAssistantMsg);

        try {
            // 调用Coze工作流
            const workflowData = await sendMessage(inputValue, contextFiles);
            
            // 更新助手消息内容
            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                text: workflowData.assistant,
                timestamp: Date.now() + 1,
            };
            
            // 移除临时消息，添加正式消息
            const updatedHistory = chatHistory.filter(msg => msg.id !== tempAssistantMsg.id);
            updatedHistory.push(userMsg, assistantMsg);
            
            // 只清空聊天历史，保留知识看板卡片
            clearChatHistoryOnly();
            updatedHistory.forEach(msg => addMessage(msg));
            
            // 添加媒体资源 - 只处理有效的文件对象
            if (workflowData.file && workflowData.file.length > 0) {
                const validFiles = workflowData.file.filter(file => {
                    // 检查文件对象是否有效（不是空对象）
                    return file && Object.keys(file).length > 0 && file.materialId;
                });
                
                console.log('过滤后的有效文件:', validFiles);
                console.log('原始文件数组:', workflowData.file);
                
                if (validFiles.length > 0) {
                    // 先清空原有媒体资源，再添加新的卡片信息
                    clearMediaAssets();
                    
                    validFiles.forEach(cozeFile => {
                        try {
                            const mediaAsset = convertCozeFileToMediaAsset(cozeFile, assistantMsg.id);
                            addMediaAsset(mediaAsset);
                        } catch (fileError) {
                            console.error('转换文件失败:', fileError, cozeFile);
                            // 单个文件转换失败不影响整体流程
                        }
                    });
                } else {
                    console.log('没有有效的文件需要处理');
                }
            }
            
        } catch (error) {
            console.error('工作流调用失败:', error);
            // 更新错误消息
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                text: '抱歉，处理您的请求时出现错误。请稍后重试。',
                timestamp: Date.now() + 1,
            };
            
            const updatedHistory = chatHistory.filter(msg => msg.id !== tempAssistantMsg.id);
            updatedHistory.push(userMsg, errorMsg);
            
            clearChatHistoryOnly();
            updatedHistory.forEach(msg => addMessage(msg));
        } finally {
            setIsLoading(false);
        }
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
                                    <div className={cn(
                                        "w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0 mt-1",
                                        msg.text === '正在思考中...' && "animate-pulse"
                                    )}>
                                        {msg.text === '正在思考中...' ? (
                                            <Loader2Icon className="w-3 h-3 text-primary/60 animate-spin" />
                                        ) : (
                                            <SendIcon className="w-3 h-3 text-primary/60 rotate-180" />
                                        )}
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
                                    {msg.role === 'assistant' ? (
                                        <div className={cn(
                                            "prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-white/50 prose-pre:text-foreground",
                                            "whitespace-pre-wrap leading-relaxed",
                                            msg.text === '正在思考中...' && "text-muted-foreground animate-pulse"
                                        )}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "whitespace-pre-wrap leading-relaxed",
                                            msg.text === '正在思考中...' && "text-muted-foreground animate-pulse"
                                        )}>
                                            {msg.text}
                                        </div>
                                    )}
                                    
                                    {/* 引用文件标签 - 显示在消息底部 */}
                                    {msg.referencedFiles && msg.referencedFiles.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-white/20 flex flex-wrap gap-1">
                                            {msg.referencedFiles.map((file) => (
                                                <div key={file.id} className="flex items-center gap-1 bg-white/80 text-foreground px-2 py-1 rounded-full text-xs border border-white/30 shadow-xs">
                                                    <FileIcon className="w-3 h-3 text-primary" />
                                                    <span className="max-w-[100px] truncate">{file.filename}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                            onClick={() => window.location.reload()}
                            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground hover:bg-black/5 px-2 py-1 rounded-full transition-colors"
                        >
                            重置当前对话
                        </button>
                    </div>
                </div>
        </div>
    );
};
