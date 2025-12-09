import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { MediaAsset } from '@/types';

const COZE_API_URL = 'https://api.coze.cn/v1/workflows/chat';
// TODO: Replace with real credentials
const WORKFLOW_ID = '74423...';
const APP_ID = '7439828073...';
const TOKEN = 'pat_...';

export const sendMessage = async (text: string, _contextFiles: MediaAsset[]) => {
    const store = useWorkspaceStore.getState();
    const assistantMsgId = Date.now().toString();

    // Optimistic update: Add an empty assistant message immediately
    store.addMessage({
        id: assistantMsgId,
        role: 'assistant',
        text: '',
        timestamp: Date.now()
    });

    try {
        const requestBody: any = {
            workflow_id: WORKFLOW_ID,
            additional_messages: [
                {
                    role: 'user',
                    content_type: 'text',
                    content: text
                }
            ]
        };

        if (APP_ID) {
            requestBody.app_id = APP_ID;
        }

        await fetchEventSource(COZE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            onmessage(msg) {
                if (msg.event === 'conversation.message.delta') {
                    const data = JSON.parse(msg.data);
                    if (data.role === 'assistant' && data.type === 'answer' && data.content) {
                        // Append content to the message
                        const currentMsg = store.chatHistory.find(m => m.id === assistantMsgId);
                        const newText = (currentMsg?.text || '') + data.content;
                        store.updateMessage(assistantMsgId, { text: newText });
                    }
                } else if (msg.event === 'conversation.message.completed') {
                    const data = JSON.parse(msg.data);
                    if (data.role === 'assistant' && data.type === 'answer') {
                        // Ensure final content is set
                        store.updateMessage(assistantMsgId, { text: data.content });
                    }
                } else if (msg.event === 'conversation.chat.created') {
                    // Chat created
                    console.log('Chat created:', JSON.parse(msg.data));
                } else if (msg.event === 'conversation.chat.in_progress') {
                    // Chat in progress
                } else if (msg.event === 'conversation.chat.requires_action') {
                    // Handle interruption if needed
                }
            },
            onerror(err) {
                console.error('EventSource error:', err);
                // Don't rethrow to avoid retry loop if it's a fatal error
                // But fetchEventSource retries by default.
                // We might want to stop retrying on certain errors.
            }
        });
    } catch (error) {
        console.error('Failed to send message:', error);
        store.updateMessage(assistantMsgId, { text: 'Error: Failed to send message.' });
    }
};
