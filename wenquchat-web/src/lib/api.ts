import type { MediaAsset, CozeWorkflowResponse, CozeWorkflowData, CozeFile } from '@/types';

// Coze API 配置
const COZE_API_URL = 'https://api.coze.cn/v1/workflow/run';
const COZE_ACCESS_TOKEN = 'sat_9BUBsxwQjCwOY6Q5WII1hAc4viAlEWFABoOq7HBRApnHi34ltK83SvNrknSfRRQM'; // 需要替换为实际的token
const COZE_WORKFLOW_ID = '7581788520839266346'; // 使用示例中的工作流ID

/**
 * 调用Coze工作流API
 */
export const callCozeWorkflow = async (input: string): Promise<CozeWorkflowData> => {
    try {
        // 创建超时控制器 - 设置5分钟超时（Coze建议控制在5分钟内）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5分钟
        
        const response = await fetch(COZE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal, // 添加超时信号
            body: JSON.stringify({
                workflow_id: COZE_WORKFLOW_ID,
                parameters: {
                    input: input
                }
            })
        });
        
        // 清除超时定时器
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CozeWorkflowResponse = await response.json();
        
        if (result.code !== 0) {
            throw new Error(`Coze API error: ${result.msg}`);
        }

        // 解析data字段中的JSON字符串
        const workflowData: CozeWorkflowData = JSON.parse(result.data);
        return workflowData;
        
    } catch (error) {
        console.error('Coze工作流调用失败:', error);
        
        // 处理超时错误
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('工作流执行超时，请稍后重试或简化输入内容');
        }
        
        // 处理其他错误
        throw error;
    }
};

/**
 * 将Coze文件转换为MediaAsset
 */
export const convertCozeFileToMediaAsset = (cozeFile: CozeFile, messageId: string): MediaAsset => {
    console.log('转换Coze文件:', cozeFile);
    
    // 检查是否是空对象
    if (!cozeFile || Object.keys(cozeFile).length === 0) {
        console.error('接收到空对象文件:', cozeFile);
        throw new Error('Coze文件为空对象');
    }
    
    // 安全检查 - 确保必要字段存在
    if (!cozeFile.materialName) {
        console.error('Coze文件缺少materialName字段:', cozeFile);
        throw new Error('Coze文件数据格式错误：缺少文件名');
    }
    
    if (!cozeFile.materialId) {
        console.error('Coze文件缺少materialId字段:', cozeFile);
        throw new Error('Coze文件数据格式错误：缺少文件ID');
    }
    
    if (!cozeFile.mediaInfo || !cozeFile.mediaInfo.url) {
        console.error('Coze文件缺少mediaInfo或url字段:', cozeFile);
        throw new Error('Coze文件数据格式错误：缺少媒体信息');
    }
    
    // 安全检查 - 确保materialType存在
    if (!cozeFile.materialType) {
        console.warn('Coze文件缺少materialType字段:', cozeFile);
        // 尝试从文件名推断类型
        const fileExtension = cozeFile.materialName.split('.').pop()?.toLowerCase() || '';
        console.log('从文件扩展名推断类型:', fileExtension);
        
        let inferredType = 'unknown';
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)) {
            inferredType = 'image';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)) {
            inferredType = 'video';
        } else if (['pdf'].includes(fileExtension)) {
            inferredType = 'pdf';
        } else if (['doc', 'docx'].includes(fileExtension)) {
            inferredType = 'doc';
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
            inferredType = 'xls';
        } else if (['ppt', 'pptx'].includes(fileExtension)) {
            inferredType = 'ppt';
        } else if (['psd'].includes(fileExtension)) {
            inferredType = 'psd';
        }
        
        console.log('推断的媒体类型:', inferredType);
        return {
            id: cozeFile.materialId || 'unknown',
            filename: cozeFile.materialName || 'unknown',
            url: cozeFile.mediaInfo?.url || '',
            downloadUrl: cozeFile.sourceFiles?.[0]?.url,
            type: inferredType as MediaAsset['type'],
            mimeType: cozeFile.mediaInfo?.format || 'application/octet-stream',
            metadata: {
                width: cozeFile.mediaInfo?.width,
                height: cozeFile.mediaInfo?.height,
                size: cozeFile.mediaInfo?.size,
                duration: cozeFile.mediaInfo?.duration,
                format: cozeFile.mediaInfo?.format,
                cover: cozeFile.mediaInfo?.cover,
            },
            relatedMessageId: messageId,
            description: cozeFile.description,
            summary: cozeFile.description?.summary,
            tags: cozeFile.tags,
            project: cozeFile.project,
            usageType: cozeFile.usageType,
            createTime: cozeFile.createTime,
            createBy: cozeFile.creator,
            custom: cozeFile.custom,
            materialId: cozeFile.materialId,
            sourceFiles: cozeFile.sourceFiles,
        };
    }
    
    const fileType = cozeFile.materialType.toLowerCase();
    let mediaType: MediaAsset['type'] = 'unknown';
    
    switch (fileType) {
        case 'image':
            mediaType = 'image';
            break;
        case 'video':
            mediaType = 'video';
            break;
        case 'pdf':
            mediaType = 'pdf';
            break;
        case 'doc':
        case 'docx':
            mediaType = 'doc';
            break;
        case 'xls':
        case 'xlsx':
            mediaType = 'xls';
            break;
        case 'ppt':
        case 'pptx':
            mediaType = 'ppt';
            break;
        case 'psd':
            mediaType = 'psd';
            break;
        default:
            mediaType = 'unknown';
    }

    return {
        id: cozeFile.materialId || 'unknown',
        filename: cozeFile.materialName || 'unknown',
        url: cozeFile.mediaInfo?.url || '',
        downloadUrl: cozeFile.sourceFiles?.[0]?.url,
        type: mediaType,
        mimeType: cozeFile.mediaInfo?.format || 'application/octet-stream',
        metadata: {
            width: cozeFile.mediaInfo?.width,
            height: cozeFile.mediaInfo?.height,
            size: cozeFile.mediaInfo?.size,
            duration: cozeFile.mediaInfo?.duration,
            format: cozeFile.mediaInfo?.format,
            cover: cozeFile.mediaInfo?.cover,
        },
        relatedMessageId: messageId,
        // 扩展信息（基于接口文档）
        description: cozeFile.description,
        summary: cozeFile.description?.summary,
        tags: cozeFile.tags,
        project: cozeFile.project,
        usageType: cozeFile.usageType,
        createTime: cozeFile.createTime,
        createBy: cozeFile.creator,
        custom: cozeFile.custom,
        materialId: cozeFile.materialId,
        sourceFiles: cozeFile.sourceFiles,
    };
};

/**
 * 发送消息（集成Coze工作流）
 */
export const sendMessage = async (text: string, contextFiles: MediaAsset[]) => {
    // 构建包含引用文件信息的输入文本
    let fullInput = text;
    if (contextFiles.length > 0) {
        const fileReferences = contextFiles.map(file => {
            const createTime = file.createTime ? new Date(file.createTime).toLocaleString('zh-CN') : '未知时间';
            return `[引用文件: ${file.filename};${createTime}]`;
        }).join(' ');
        fullInput = `${fileReferences} ${text}`;
    }
    
    console.log('发送消息到Coze工作流:', fullInput);
    return await callCozeWorkflow(fullInput);
};
