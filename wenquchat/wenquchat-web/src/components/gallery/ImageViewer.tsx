import React, { useState, useRef, useEffect } from 'react';
import type { WheelEvent } from 'react';

interface ImageViewerProps {
    src: string;
    alt: string;
    className?: string;
    maxZoom?: number;
    minZoom?: number;
    zoomStep?: number;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
    src,
    alt,
    className = '',
    maxZoom = 5,
    minZoom = 0.5,
    zoomStep = 0.2
}) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // 处理鼠标滚轮缩放
    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        const newScale = Math.max(minZoom, Math.min(maxZoom, scale + delta));
        setScale(newScale);
    };

    // 处理双击缩放
    const handleDoubleClick = () => {
        if (scale === 1) {
            setScale(2);
        } else {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    };

    // 处理拖拽开始
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    // 处理拖拽移动
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    // 处理拖拽结束
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // 处理缩放按钮
    const handleZoomIn = () => {
        const newScale = Math.min(maxZoom, scale + zoomStep);
        setScale(newScale);
    };

    const handleZoomOut = () => {
        const newScale = Math.max(minZoom, scale - zoomStep);
        setScale(newScale);
        if (newScale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // 全局鼠标事件监听
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging && scale > 1) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
        };

        if (isDragging) {
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('mousemove', handleGlobalMouseMove);
        }

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isDragging, dragStart, scale]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {/* 缩放控制按钮 */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-lg transition-colors"
                    title="放大"
                >
                    <span className="text-sm font-bold">+</span>
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-lg transition-colors"
                    title="缩小"
                >
                    <span className="text-sm font-bold">-</span>
                </button>
                <button
                    onClick={handleReset}
                    className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-lg transition-colors text-xs"
                    title="重置"
                >
                    重置
                </button>
            </div>

            {/* 图片容器 */}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-full object-contain transition-transform"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center'
                    }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                        }
                    }}
                />
            </div>

            {/* 错误提示 */}
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                    <span className="text-4xl mb-2">📷</span>
                    <p>图片加载失败</p>
                </div>
            </div>
        </div>
    );
};