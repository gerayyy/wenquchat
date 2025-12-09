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
        const response = await fetch(COZE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workflow_id: COZE_WORKFLOW_ID,
                parameters: {
                    input: input
                }
            })
        });

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
        throw error;
    }
};

/**
 * 将Coze文件转换为MediaAsset
 */
export const convertCozeFileToMediaAsset = (cozeFile: CozeFile, messageId: string): MediaAsset => {
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
        id: cozeFile.materialId,
        filename: cozeFile.materialName,
        url: cozeFile.mediaInfo.url,
        downloadUrl: cozeFile.sourceFiles?.[0]?.url,
        type: mediaType,
        mimeType: cozeFile.mediaInfo.format,
        metadata: {
            width: cozeFile.mediaInfo.width,
            height: cozeFile.mediaInfo.height,
        },
        relatedMessageId: messageId
    };
};

/**
 * 发送消息（集成Coze工作流）
 */
export const sendMessage = async (text: string, _contextFiles: MediaAsset[]) => {
    console.log('发送消息到Coze工作流:', text);
    return await callCozeWorkflow(text);
};
