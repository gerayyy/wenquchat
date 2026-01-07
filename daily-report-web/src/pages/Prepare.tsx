import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIENTS } from '../data/mock';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Check, Plus, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function Prepare() {
    const navigate = useNavigate();
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
    const [newClientCount, setNewClientCount] = useState<number | string>('');

    const toggleClient = (id: string) => {
        setSelectedClientIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        navigate('/fill', {
            state: {
                selectedClientIds,
                newClientCount: typeof newClientCount === 'string' ? 0 : newClientCount
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">准备日报</h2>
                <p className="text-white/70">选择您今天访问的客户</p>
            </div>

            <Card className="p-6 space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-medium text-white/80 uppercase tracking-wider">现有客户</label>
                    <div className="flex flex-wrap gap-3">
                        {MOCK_CLIENTS.map(client => {
                            const isSelected = selectedClientIds.includes(client.id);
                            return (
                                <button
                                    key={client.id}
                                    onClick={() => toggleClient(client.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                        isSelected
                                            ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/25"
                                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {isSelected && <Check className="w-3 h-3" />}
                                        {client.shortName}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <label className="text-sm font-medium text-white/80 uppercase tracking-wider">新客户</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <div className="relative flex-1 w-full">
                            <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newClientCount}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // 允许空输入
                                        if (value === '') {
                                            setNewClientCount('');
                                            return;
                                        }
                                        // 只接受1-5之间的数字
                                        const num = parseInt(value);
                                        if (!isNaN(num) && num >= 1 && num <= 5) {
                                            setNewClientCount(num);
                                        }
                                    }}
                                    className="pl-10"
                                    style={{ textIndent: '8px' }} // 确保数字输入时可见
                                />
                            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        </div>
                        <span className="text-sm text-white/50">位客户访问(仅支持输入 1-5 之间的数值)</span>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={selectedClientIds.length === 0 && (newClientCount === '' || newClientCount === 0)}
                    className="w-full md:w-auto"
                >
                    开始填写 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
