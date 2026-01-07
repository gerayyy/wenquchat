import { useNavigate } from 'react-router-dom';
import { FileText, Users } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                    Daily Workbench
                </h1>
                <p className="text-white/70 text-lg">Select your role to continue</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <button
                    onClick={() => navigate('/prepare')}
                    className="group relative w-48 h-48 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/40 hover:shadow-blue-500/20 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-4 rounded-full bg-blue-500/30 group-hover:bg-blue-500/50 transition-colors z-10">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-white z-10">Fill Report</span>
                </button>

                <button
                    onClick={() => navigate('/view')}
                    className="group relative w-48 h-48 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/40 hover:shadow-purple-500/20 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-4 rounded-full bg-purple-500/30 group-hover:bg-purple-500/50 transition-colors z-10">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-white z-10">View Reports</span>
                </button>
            </div>
        </div>
    );
}
