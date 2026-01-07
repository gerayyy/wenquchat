import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MOCK_CLIENTS } from '../data/mock';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { Input } from '../components/ui/Input';
import { Send, AlertCircle } from 'lucide-react';

interface LocationState {
    selectedClientIds: string[];
    newClientCount: number;
}

export function Fill() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        // Mock API call
        setTimeout(() => {
            // Random mock error (10% chance)
            if (Math.random() > 0.9) {
                setIsSubmitting(false);
                setError("Network error: Failed to submit reports. Please try again.");
                return;
            }

            navigate('/success');
        }, 1500);
    };

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white gap-4">
                <p>No data selected.</p>
                <Button onClick={() => navigate('/prepare')}>Go Back</Button>
            </div>
        );
    }

    const selectedClients = MOCK_CLIENTS.filter(c => state.selectedClientIds.includes(c.id));

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Fill Reports</h2>
                <p className="text-white/70">Complete the details for each client</p>
            </div>

            <div className="space-y-6">
                {selectedClients.map(client => (
                    <Card key={client.id} className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{client.name}</h3>
                                <p className="text-sm text-white/50">Last update: {client.lastUpdate}</p>
                            </div>
                            <span className="px-2 py-1 rounded bg-white/10 text-xs text-white/70 uppercase tracking-wider">{client.status}</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Visit Report</label>
                            <Textarea placeholder="What was discussed? What are the next steps?" className="min-h-[120px]" />
                        </div>
                    </Card>
                ))}

                {Array.from({ length: state.newClientCount }).map((_, i) => (
                    <Card key={`new-${i}`} className="p-6 space-y-4 border-dashed border-white/30 bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center h-6 px-2 rounded-full bg-blue-500 text-xs font-bold text-white">NEW</span>
                            <h3 className="text-xl font-semibold text-white">New Client #{i + 1}</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Client Name</label>
                                <Input placeholder="Company Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Contact Person</label>
                                <Input placeholder="Name" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Visit Report</label>
                            <Textarea placeholder="Initial meeting details..." className="min-h-[120px]" />
                        </div>
                    </Card>
                ))}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm md:static md:bg-none md:backdrop-blur-none md:p-0 z-20">
                <div className="max-w-2xl mx-auto">
                    <Button
                        size="lg"
                        className="w-full shadow-xl shadow-blue-500/20"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Submit All Reports <Send className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
