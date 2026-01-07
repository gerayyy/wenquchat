import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Home } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Success() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
            <Card className="p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-2 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">Submitted!</h2>
                    <p className="text-white/70">Your daily reports have been successfully recorded.</p>
                </div>

                <Button
                    onClick={() => navigate('/')}
                    className="w-full mt-4"
                    variant="secondary"
                >
                    <Home className="mr-2 w-4 h-4" /> Back to Home
                </Button>
            </Card>
        </div>
    );
}
