import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
    PlayIcon, 
    PauseIcon, 
    Volume2Icon, 
    VolumeXIcon, 
    MaximizeIcon,
    DownloadIcon,
    ExternalLinkIcon,
    RewindIcon,
    ForwardIcon
} from 'lucide-react';

interface VideoPlayerProps {
    fileUrl: string;
    fileName: string;
    onDownload?: () => void;
    onPreview?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
    fileUrl, 
    fileName, 
    onDownload,
    onPreview 
}) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [durationState] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const playerRef = useRef<any>(null);

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const handleMute = () => {
        setMuted(!muted);
    };

    const handleProgress = (state: any) => {
        setPlayed(state.played);
        setLoaded(state.loaded);
    };



    const handleSeekMouseDown = () => {
        setPlaying(false);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayed = parseFloat(e.target.value);
        setPlayed(newPlayed);
    };

    const handleSeekMouseUp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPlayed = parseFloat(e.target.value);
        setPlayed(newPlayed);
        if (playerRef.current) {
            playerRef.current.seekTo(newPlayed);
        }
        setPlaying(true);
    };

    const handleRewind = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(Math.max(0, played - 0.1));
        }
    };

    const handleForward = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(Math.min(1, played + 0.1));
        }
    };

    const handleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };



    return (
        <div className={`flex flex-col bg-black ${fullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
            {/* 视频播放器 */}
            <div className={`relative ${fullscreen ? 'h-full' : 'flex-1'} bg-black`}>
                <ReactPlayer
                    ref={playerRef}
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    width="100%"
                    height="100%"
                    onProgress={handleProgress}
                    onReady={() => console.log('视频准备就绪')}
                    onError={(error: any) => console.error('视频播放错误:', error)}
                    {...{ url: fileUrl }}
                />

                {/* 自定义控制层 */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {/* 顶部信息栏 */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="text-white">
                            <h3 className="text-sm font-medium truncate max-w-md">{fileName}</h3>
                            <p className="text-xs opacity-75">
                                {durationState ? formatTime(durationState * played) : '0:00'} / {durationState ? formatTime(durationState) : '0:00'}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 pointer-events-auto">
                            {onPreview && (
                                <button
                                    onClick={onPreview}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    title="在新窗口打开"
                                >
                                    <ExternalLinkIcon className="w-4 h-4" />
                                </button>
                            )}
                            {onDownload && (
                                <button
                                    onClick={onDownload}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    title="下载文件"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={handleFullscreen}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                title="全屏"
                            >
                                <MaximizeIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* 中央播放按钮 */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={handlePlayPause}
                            className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors pointer-events-auto"
                        >
                            {playing ? (
                                <PauseIcon className="w-8 h-8" />
                            ) : (
                                <PlayIcon className="w-8 h-8" />
                            )}
                        </button>
                    </div>

                    {/* 底部控制栏 */}
                    <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                        {/* 进度条 */}
                        <div className="mb-3">
                            <input
                                type="range"
                                min={0}
                                max={0.999999}
                                step="any"
                                value={played}
                                onMouseDown={handleSeekMouseDown}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekMouseUp as any}
                                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%, rgba(255,255,255,0.3) ${loaded * 100}%, rgba(255,255,255,0.1) ${loaded * 100}%, rgba(255,255,255,0.1) 100%)`
                                }}
                            />
                        </div>

                        {/* 控制按钮 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRewind}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    title="快退 10秒"
                                >
                                    <RewindIcon className="w-4 h-4" />
                                </button>
                                
                                <button
                                    onClick={handlePlayPause}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    {playing ? (
                                        <PauseIcon className="w-4 h-4" />
                                    ) : (
                                        <PlayIcon className="w-4 h-4" />
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleForward}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    title="快进 10秒"
                                >
                                    <ForwardIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* 音量控制 */}
                                <button
                                    onClick={handleMute}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    {muted || volume === 0 ? (
                                        <VolumeXIcon className="w-4 h-4" />
                                    ) : (
                                        <Volume2Icon className="w-4 h-4" />
                                    )}
                                </button>
                                
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={muted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(muted ? 0 : volume) * 100}%)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 自定义样式 */}
            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
                }
                
                .slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};