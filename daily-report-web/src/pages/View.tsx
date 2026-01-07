import { useState } from 'react';
import { MOCK_CLIENTS, MOCK_REPORTS, MOCK_HISTORY } from '../data/mock';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { User, Clock, History, Search } from 'lucide-react';
import { cn } from '../lib/utils';

type FilterType = 'all' | 'yesterday' | 'week';

export function View() {
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = MOCK_CLIENTS.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.shortName.toLowerCase().includes(searchTerm.toLowerCase());
        // In a real app, date filtering would be more complex
        return matchesSearch;
    });

    const selectedClientHistory = MOCK_HISTORY.filter(h => h.clientId === selectedClientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-white">客户报告</h2>
                    <p className="text-white/70">客户活动和报告概览</p>
                </div>

                <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/10">
                    {(['all', 'yesterday', 'week'] as FilterType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                filter === f
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {f === 'all' ? '全部' : f === 'yesterday' ? '昨日' : '本周'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    placeholder="搜索客户、跟进人、分组..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map(client => {
                    const latestReport = MOCK_REPORTS.find(r => r.clientId === client.id);

                    return (
                        <Card key={client.id} className="flex flex-col gap-4 hover:border-white/40 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-200 transition-colors">{client.shortName}</h3>
                                    <p className="text-xs text-white/50">{client.name}</p>
                                </div>
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    client.status === 'active' ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-gray-400"
                                )} />
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <User className="w-4 h-4" />
                                    <span>{client.submitter}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <Clock className="w-4 h-4" />
                                    <span>{client.lastUpdate}</span>
                                </div>
                                <div className="space-y-1 text-xs text-white/60">
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        <span>{client.industry} · {client.department}</span>
                                        <span>对接人: {client.contactPerson}</span>
                                        <span>所在地: {client.base}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        <span className={cn("px-1.5 py-0.5 rounded", client.contacted ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300")}>
                                            {client.contacted ? "已联系" : "未联系"}
                                        </span>
                                        <span className={cn("px-1.5 py-0.5 rounded", client.cooperated ? "bg-blue-500/20 text-blue-300" : "bg-gray-500/20 text-gray-300")}>
                                            {client.cooperated ? "已合作" : "未合作"}
                                        </span>
                                        <span className={cn("px-1.5 py-0.5 rounded", client.hasBusiness ? "bg-yellow-500/20 text-yellow-300" : "bg-gray-500/20 text-gray-300")}>
                                            {client.hasBusiness ? "有商机" : "无商机"}
                                        </span>
                                    </div>
                                </div>
                                {latestReport && (
                                    <div className="p-3 rounded-lg bg-white/5 text-sm text-white/80 italic line-clamp-2 border border-white/5">
                                        "{latestReport.content}"
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full mt-auto"
                                onClick={() => setSelectedClientId(client.id)}
                            >
                                <History className="w-4 h-4 mr-2" /> 查看历史
                            </Button>
                        </Card>
                    );
                })}
            </div>

            <Modal
                isOpen={!!selectedClientId}
                onClose={() => setSelectedClientId(null)}
                title="客户历史"
            >
                <div className="relative border-l border-white/20 ml-3 space-y-8 py-2">
                    {selectedClientHistory.map((event) => (
                        <div key={event.id} className="relative pl-8 group">
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#1a1b26] group-hover:bg-blue-400 transition-colors" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-blue-400">{event.date}</span>
                                <h4 className="text-base font-semibold text-white">{event.action}</h4>
                                <p className="text-sm text-white/60 leading-relaxed">{event.details}</p>
                            </div>
                        </div>
                    ))}
                    {selectedClientHistory.length === 0 && (
                        <p className="text-white/50 text-center py-4">无历史记录。</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
