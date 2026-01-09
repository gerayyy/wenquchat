import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { User, Clock, History, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { getDailyCustomerList, getDailyCustomerDetail } from '../services/dailyCustomer';
import type { DailyCustomer } from '../services/dailyCustomer';

type FilterType = 'all' | 'yesterday' | 'week';

export function View() {
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<DailyCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const pageSize = 9; // 每页显示 9 个（3x3 网格）

    // 客户详情相关状态
    const [clientDetail, setClientDetail] = useState<DailyCustomer | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    // 加载客户列表
    useEffect(() => {
        loadClients();
    }, [currentPage]);

    const loadClients = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getDailyCustomerList(currentPage, pageSize);
            setClients(result.records);
            setTotalPages(result.pages);
            setTotal(result.total);
        } catch (err) {
            console.error('加载客户列表失败:', err);
            setError(err instanceof Error ? err.message : '加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 加载客户详情
    const loadClientDetail = async (clientId: number) => {
        setLoadingDetail(true);
        setDetailError(null);
        try {
            const detail = await getDailyCustomerDetail(clientId);
            setClientDetail(detail);
        } catch (err) {
            console.error('加载客户详情失败:', err);
            const errorMessage = err instanceof Error ? err.message : '加载详情失败';
            setDetailError(errorMessage);
        } finally {
            setLoadingDetail(false);
        }
    };

    // 点击查看历史按钮
    const handleViewHistory = (clientId: number) => {
        setSelectedClientId(clientId);
        loadClientDetail(clientId);
    };

    // 关闭历史弹窗
    const handleCloseModal = () => {
        setSelectedClientId(null);
        setClientDetail(null);
        setDetailError(null);
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch =
            (client.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (client.abbreviation?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        // TODO: 实现日期过滤逻辑
        return matchesSearch;
    });

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 加载状态
    if (loading && clients.length === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="w-16 h-16 mb-4 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
                    <p className="text-white/60">加载中...</p>
                </div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="text-red-400 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-white/90 mb-2">加载失败</h2>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button onClick={loadClients}>重试</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-white">客户报告</h2>
                    <p className="text-white/70">客户活动和报告概览（共 {total} 个客户）</p>
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
                    placeholder="搜索客户..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
            </div>

            {filteredClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-white/60">
                    <p>暂无客户数据</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredClients.map(client => {
                            return (
                                <Card key={client.id} className="flex flex-col gap-4 hover:border-white/40 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-white group-hover:text-blue-200 transition-colors">
                                                {client.abbreviation || client.fullName}
                                            </h3>
                                            {client.abbreviation && client.fullName && (
                                                <p className="text-xs text-white/50">{client.fullName}</p>
                                            )}
                                        </div>
                                        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        {client.dailyReport?.createUserName && (
                                            <div className="flex items-center gap-2 text-sm text-white/70">
                                                <User className="w-4 h-4" />
                                                <span>{client.dailyReport.createUserName}</span>
                                            </div>
                                        )}
                                        {(client.dailyReport?.createTime || client.createTime || client.updateTime) && (
                                            <div className="flex items-center gap-2 text-sm text-white/70">
                                                <Clock className="w-4 h-4" />
                                                <span>{client.dailyReport?.createTime || client.updateTime || client.createTime}</span>
                                            </div>
                                        )}
                                        <div className="space-y-1 text-xs text-white/60">
                                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                {client.industry && <span>{client.industry}</span>}
                                                {client.dept && <span>· {client.dept}</span>}
                                            </div>
                                            {client.name && (
                                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                    <span>对接人: {client.name}</span>
                                                    {client.base && <span>· {client.base}</span>}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded text-xs",
                                                    client.isContact ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
                                                )}>
                                                    {client.isContact ? "已联系" : "未联系"}
                                                </span>
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded text-xs",
                                                    client.isCooperation ? "bg-blue-500/20 text-blue-300" : "bg-gray-500/20 text-gray-300"
                                                )}>
                                                    {client.isCooperation ? "已合作" : "未合作"}
                                                </span>
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded text-xs",
                                                    client.isOpportunity ? "bg-yellow-500/20 text-yellow-300" : "bg-gray-500/20 text-gray-300"
                                                )}>
                                                    {client.isOpportunity ? "有商机" : "无商机"}
                                                </span>
                                            </div>
                                            {client.opportunityStatus && (
                                                <div className="mt-2">
                                                    <span className="text-white/70">商机状态: </span>
                                                    <span className="text-white/90">{client.opportunityStatus}</span>
                                                </div>
                                            )}
                                        </div>
                                        {client.dailyReport?.reportContent && (
                                            <div className="p-3 rounded-lg bg-white/5 text-sm text-white/80 italic line-clamp-2 border border-white/5 mt-2">
                                                "{client.dailyReport.reportContent}"
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full mt-auto"
                                        onClick={() => client.id && handleViewHistory(client.id)}
                                    >
                                        <History className="w-4 h-4 mr-2" /> 查看历史
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>

                    {/* 分页控件 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1 || loading}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> 上一页
                            </Button>
                            <span className="text-white/70 text-sm">
                                第 {currentPage} / {totalPages} 页
                            </span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || loading}
                            >
                                下一页 <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={!!selectedClientId}
                onClose={handleCloseModal}
                title="客户历史"
            >
                {loadingDetail ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 mb-4 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
                        <p className="text-white/60">加载中...</p>
                    </div>
                ) : detailError ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="text-red-400 text-5xl">⚠️</div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-white/90">加载失败</h3>
                            <p className="text-white/60">{detailError}</p>
                            <p className="text-sm text-white/50">可能是该客户数据不完整或后端服务异常</p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => selectedClientId && loadClientDetail(selectedClientId)}
                        >
                            重试
                        </Button>
                    </div>
                ) : clientDetail ? (
                    <div className="space-y-6">
                        {/* 客户基本信息 */}
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-semibold text-white mb-2">
                                {clientDetail.abbreviation || clientDetail.fullName}
                            </h3>
                            {clientDetail.abbreviation && clientDetail.fullName && (
                                <p className="text-sm text-white/60">{clientDetail.fullName}</p>
                            )}
                        </div>

                        {/* 历史日报 */}
                        {clientDetail.dailyReports && clientDetail.dailyReports.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                                    历史日报 ({clientDetail.dailyReports.length})
                                </h4>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {clientDetail.dailyReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                                        >
                                            <div className="flex items-center gap-2 text-xs text-white/60">
                                                <User className="w-3 h-3" />
                                                <span>{report.createUserName}</span>
                                                <span>·</span>
                                                <Clock className="w-3 h-3" />
                                                <span>{report.createTime}</span>
                                            </div>
                                            <p className="text-sm text-white/80">{report.reportContent}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 客户修改记录时间轴 */}
                        {clientDetail.dailyCustomerLogs && clientDetail.dailyCustomerLogs.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                                    修改记录 ({clientDetail.dailyCustomerLogs.length})
                                </h4>
                                <div className="space-y-0 max-h-[300px] overflow-y-auto">
                                    {clientDetail.dailyCustomerLogs.map((log, index) => (
                                        <div key={log.id} className="relative pl-6 pb-6 last:pb-0">
                                            {/* 时间轴线 */}
                                            {index !== clientDetail.dailyCustomerLogs!.length - 1 && (
                                                <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-white/10" />
                                            )}

                                            {/* 时间轴点 */}
                                            <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white/20" />

                                            {/* 内容 */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-white/60">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{log.createTime}</span>
                                                    {log.createUserName && (
                                                        <>
                                                            <span>·</span>
                                                            <User className="w-3 h-3" />
                                                            <span>{log.createUserName}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-white/90 font-medium">{log.fieldName}</span>
                                                    {log.oldValue && (
                                                        <div className="text-white/60 mt-1">
                                                            <span className="text-white/50">原值:</span> {log.oldValue}
                                                        </div>
                                                    )}
                                                    {log.newValue && (
                                                        <div className="text-white/80 mt-1">
                                                            <span className="text-white/50">新值:</span> {log.newValue}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 没有历史记录 */}
                        {(!clientDetail.dailyReports || clientDetail.dailyReports.length === 0) &&
                         (!clientDetail.dailyCustomerLogs || clientDetail.dailyCustomerLogs.length === 0) && (
                            <div className="p-8 text-center text-white/60">
                                <p>暂无历史记录</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 text-center text-white/60">
                        <p>加载失败</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
