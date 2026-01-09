import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDailyCustomerList } from '../services/dailyCustomer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { Input } from '../components/ui/Input';
import { AutoResizeInput } from '../components/ui/AutoResizeInput';
import { Send, AlertCircle } from 'lucide-react';
import { createDailyCustomer } from '../services/dailyCustomer';
import type { DailyCustomer } from '../services/dailyCustomer';

interface LocationState {
    selectedClientIds: number[];
    newClientCount: number;
}

interface FormData {
    source: string;
    abbreviation: string;
    fullName: string;
    dept: string;
    industry: string;
    base: string;
    name: string;
    phone: string;
    wechatCode: string;
    isContact: number;
    isCooperation: number;
    isOpportunity: number;
    opportunityStatus: string;
    reportContent: string;
}

export function Fill() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 为每个客户创建表单数据状态
    const [existingClientsForms, setExistingClientsForms] = useState<Record<number, FormData>>({});
    const [newClientsForms, setNewClientsForms] = useState<FormData[]>([]);
    const [clients, setClients] = useState<DailyCustomer[]>([]);
    const [loadingClients, setLoadingClients] = useState(true);

    // 加载已选客户的详细信息
    useEffect(() => {
        const loadClients = async () => {
            if (!state || state.selectedClientIds.length === 0) {
                setLoadingClients(false);
                return;
            }

            try {
                // 加载客户列表并筛选出已选客户
                const result = await getDailyCustomerList(1, 100);
                const selectedClients = result.records.filter(c =>
                    c.id && state.selectedClientIds.includes(c.id)
                );
                setClients(selectedClients);
            } catch (err) {
                console.error('加载客户信息失败:', err);
            } finally {
                setLoadingClients(false);
            }
        };

        loadClients();
    }, [state]);

    useEffect(() => {
        if (!state || loadingClients) return;

        // 初始化已选客户的表单数据
        const initialForms: Record<number, FormData> = {};

        clients.forEach(client => {
            if (client.id) {
                initialForms[client.id] = {
                    source: client.source || '',
                    abbreviation: client.abbreviation || '',
                    fullName: client.fullName || '',
                    dept: client.dept || '',
                    industry: client.industry || '',
                    base: client.base || '',
                    name: client.name || '',
                    phone: client.phone || '',
                    wechatCode: client.wechatCode || '',
                    isContact: client.isContact || 0,
                    isCooperation: client.isCooperation || 0,
                    isOpportunity: client.isOpportunity || 0,
                    opportunityStatus: client.opportunityStatus || '',
                    reportContent: '',
                };
            }
        });
        setExistingClientsForms(initialForms);

        // 初始化新客户的表单数据
        const newForms: FormData[] = Array.from({ length: state.newClientCount }).map(() => ({
            source: '',
            abbreviation: '',
            fullName: '',
            dept: '',
            industry: '',
            base: '',
            name: '',
            phone: '',
            wechatCode: '',
            isContact: 0,
            isCooperation: 0,
            isOpportunity: 0,
            opportunityStatus: '',
            reportContent: '',
        }));
        setNewClientsForms(newForms);
    }, [state, clients, loadingClients]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // 收集所有表单数据
            const allCustomers: DailyCustomer[] = [];

            // 添加已选择客户的数据
            Object.values(existingClientsForms).forEach(form => {
                allCustomers.push({
                    source: form.source,
                    abbreviation: form.abbreviation,
                    fullName: form.fullName,
                    dept: form.dept,
                    industry: form.industry,
                    base: form.base,
                    name: form.name,
                    phone: form.phone,
                    wechatCode: form.wechatCode,
                    isContact: form.isContact,
                    isCooperation: form.isCooperation,
                    isOpportunity: form.isOpportunity,
                    opportunityStatus: form.opportunityStatus,
                    dailyReport: {
                        reportContent: form.reportContent,
                    },
                });
            });

            // 添加新客户的数据
            newClientsForms.forEach(form => {
                allCustomers.push({
                    source: form.source,
                    abbreviation: form.abbreviation,
                    fullName: form.fullName,
                    dept: form.dept,
                    industry: form.industry,
                    base: form.base,
                    name: form.name,
                    phone: form.phone,
                    wechatCode: form.wechatCode,
                    isContact: form.isContact,
                    isCooperation: form.isCooperation,
                    isOpportunity: form.isOpportunity,
                    opportunityStatus: form.opportunityStatus,
                    dailyReport: {
                        reportContent: form.reportContent,
                    },
                });
            });

            // 调用接口提交
            await createDailyCustomer(allCustomers);

            // 提交成功，跳转到成功页面
            navigate('/success');
        } catch (err) {
            console.error('提交失败:', err);
            setError(err instanceof Error ? err.message : '提交失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateExistingClientForm = (clientId: number, field: keyof FormData, value: string | number) => {
        setExistingClientsForms(prev => ({
            ...prev,
            [clientId]: {
                ...prev[clientId],
                [field]: value,
            },
        }));
    };

    const updateNewClientForm = (index: number, field: keyof FormData, value: string | number) => {
        setNewClientsForms(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white gap-4">
                <p>未选择数据。</p>
                <Button onClick={() => navigate('/prepare')}>返回</Button>
            </div>
        );
    }

    if (loadingClients) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
                <p className="text-white/60">加载客户信息中...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">填写日报</h2>
                <p className="text-white/70">为每位客户完成详细信息</p>
            </div>

            <div className="space-y-6">
                {clients.map(client => {
                    const form = client.id ? existingClientsForms[client.id] : null;
                    if (!form || !client.id) return null;

                    return (
                        <Card key={client.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{client.fullName || client.abbreviation}</h3>
                                    <p className="text-sm text-white/50">更新时间: {client.updateTime || client.createTime || '-'}</p>
                                </div>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-white/70 uppercase tracking-wider">客户</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-white/90 mb-2">基本信息</h4>
                                    <div className="flex flex-wrap items-center gap-1 text-xs">
                                        <span className="text-white/70">客户简称</span>
                                        <AutoResizeInput
                                            value={form.abbreviation}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'abbreviation', e.target.value)}
                                            placeholder="简称"
                                        />
                                        <span className="text-white/70">；客户属于</span>
                                        <AutoResizeInput
                                            value={form.industry}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'industry', e.target.value)}
                                            placeholder="行业"
                                        />
                                        <span className="text-white/70">行业；对接人为</span>
                                        <AutoResizeInput
                                            value={form.name}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'name', e.target.value)}
                                            placeholder="对接人"
                                        />
                                        <span className="text-white/70">；属于</span>
                                        <AutoResizeInput
                                            value={form.dept}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'dept', e.target.value)}
                                            placeholder="部门"
                                        />
                                        <span className="text-white/70">部门；base 在</span>
                                        <AutoResizeInput
                                            value={form.base}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'base', e.target.value)}
                                            placeholder="所在地"
                                        />
                                        <span className="text-white/70">；联系方式为</span>
                                        <AutoResizeInput
                                            value={form.phone}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'phone', e.target.value)}
                                            placeholder="联系方式"
                                        />
                                        <span className="text-white/70">；微信号为</span>
                                        <AutoResizeInput
                                            value={form.wechatCode}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'wechatCode', e.target.value)}
                                            placeholder="微信号"
                                        />
                                        <span className="text-white/70">；联系上客户：</span>
                                        <AutoResizeInput
                                            value={form.isContact ? '是' : '否'}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'isContact', e.target.value === '是' ? 1 : 0)}
                                            placeholder="是/否"
                                        />
                                        <span className="text-white/70">；已合作：</span>
                                        <AutoResizeInput
                                            value={form.isCooperation ? '是' : '否'}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'isCooperation', e.target.value === '是' ? 1 : 0)}
                                            placeholder="是/否"
                                        />
                                        <span className="text-white/70">；有商机：</span>
                                        <AutoResizeInput
                                            value={form.isOpportunity ? '是' : '否'}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'isOpportunity', e.target.value === '是' ? 1 : 0)}
                                            placeholder="是/否"
                                        />
                                        <span className="text-white/70">；商机状态：</span>
                                        <AutoResizeInput
                                            value={form.opportunityStatus}
                                            onChange={(e) => client.id && updateExistingClientForm(client.id, 'opportunityStatus', e.target.value)}
                                            placeholder="商机状态"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">访问报告</label>
                                    <Textarea
                                        placeholder="讨论了什么内容？下一步计划是什么？"
                                        className="min-h-[120px]"
                                        value={form.reportContent}
                                        onChange={(e) => client.id && updateExistingClientForm(client.id, 'reportContent', e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {newClientsForms.map((form, i) => (
                    <Card key={`new-${i}`} className="p-6 space-y-4 border-dashed border-white/30 bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center h-6 px-2 rounded-full bg-blue-500 text-xs font-bold text-white">新</span>
                            <h3 className="text-xl font-semibold text-white">新客户 #{i + 1}</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">客户名称</label>
                                <Input
                                    placeholder="公司名称"
                                    className="w-full"
                                    value={form.fullName}
                                    onChange={(e) => updateNewClientForm(i, 'fullName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">客户简称</label>
                                <Input
                                    placeholder="公司简称 建议6个字以内"
                                    className="w-full"
                                    value={form.abbreviation}
                                    onChange={(e) => updateNewClientForm(i, 'abbreviation', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white/90 mb-2">基本信息</h4>
                            <div className="flex flex-wrap items-center gap-1 text-xs">
                                <span className="text-white/70">客户属于</span>
                                <AutoResizeInput
                                    placeholder="行业"
                                    value={form.industry}
                                    onChange={(e) => updateNewClientForm(i, 'industry', e.target.value)}
                                />
                                <span className="text-white/70">行业；对接人为</span>
                                <AutoResizeInput
                                    placeholder="对接人"
                                    value={form.name}
                                    onChange={(e) => updateNewClientForm(i, 'name', e.target.value)}
                                />
                                <span className="text-white/70">；属于</span>
                                <AutoResizeInput
                                    placeholder="部门"
                                    value={form.dept}
                                    onChange={(e) => updateNewClientForm(i, 'dept', e.target.value)}
                                />
                                <span className="text-white/70">部门；base 在</span>
                                <AutoResizeInput
                                    placeholder="所在地"
                                    value={form.base}
                                    onChange={(e) => updateNewClientForm(i, 'base', e.target.value)}
                                />
                                <span className="text-white/70">；联系方式为</span>
                                <AutoResizeInput
                                    placeholder="联系方式"
                                    value={form.phone}
                                    onChange={(e) => updateNewClientForm(i, 'phone', e.target.value)}
                                />
                                <span className="text-white/70">；微信号为</span>
                                <AutoResizeInput
                                    placeholder="微信号"
                                    value={form.wechatCode}
                                    onChange={(e) => updateNewClientForm(i, 'wechatCode', e.target.value)}
                                />
                                <span className="text-white/70">；联系上客户：</span>
                                <AutoResizeInput
                                    placeholder="是/否"
                                    value={form.isContact ? '是' : '否'}
                                    onChange={(e) => updateNewClientForm(i, 'isContact', e.target.value === '是' ? 1 : 0)}
                                />
                                <span className="text-white/70">；已合作：</span>
                                <AutoResizeInput
                                    placeholder="是/否"
                                    value={form.isCooperation ? '是' : '否'}
                                    onChange={(e) => updateNewClientForm(i, 'isCooperation', e.target.value === '是' ? 1 : 0)}
                                />
                                <span className="text-white/70">；有商机：</span>
                                <AutoResizeInput
                                    placeholder="是/否"
                                    value={form.isOpportunity ? '是' : '否'}
                                    onChange={(e) => updateNewClientForm(i, 'isOpportunity', e.target.value === '是' ? 1 : 0)}
                                />
                                <span className="text-white/70">；商机状态：</span>
                                <AutoResizeInput
                                    placeholder="商机状态"
                                    value={form.opportunityStatus}
                                    onChange={(e) => updateNewClientForm(i, 'opportunityStatus', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">访问报告</label>
                            <Textarea
                                placeholder="初次会面详情..."
                                className="min-h-[120px]"
                                value={form.reportContent}
                                onChange={(e) => updateNewClientForm(i, 'reportContent', e.target.value)}
                            />
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
                        提交所有报告 <Send className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
