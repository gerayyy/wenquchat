# 调用文档网址：https://www.coze.cn/open/docs/developer_guides/workflow_chat

> **注意**：根据最新搜索，建议同时参考以下相关文档：
> - 工作流运行 API: https://www.coze.cn/open/docs/developer_guides/workflow_run
> - Coze API 总览: https://www.coze.cn/open/docs/developer_guides/coze_api_overview


# Coze 工作流对话接口调用文档

## 概述

Coze 工作流对话接口（`/v1/workflows/chat`）是用于调用对话流的 API 接口。对话流是基于对话场景的特殊工作流，专门用于处理对话类请求，通过对话方式与用户交互并完成复杂的业务逻辑。

### 最新更新
- **接口地址**: `https://api.coze.cn/v1/workflows/chat`
- **认证方式**: Bearer Token (个人访问令牌)
- **协议支持**: HTTP/HTTPS, 支持 SSE (Server-Sent Events) 流式响应
- **内容类型**: 支持文本、文件、图片等多模态内容

### 核心功能
- **智能对话**: 基于工作流的智能对话处理
- **上下文管理**: 支持多轮对话上下文保持
- **流式响应**: 实时输出响应内容，提升用户体验
- **中断处理**: 支持对话中断和恢复机制

## 接口特性

### 流式响应
- **SSE 支持**: 基于 Server-Sent Events 协议，支持长连接流式响应
- **实时输出**: 允许客户端在接收到完整数据流之前就开始处理数据
- **低延迟**: 可在对话界面实时展示回复内容，减少用户等待时间
- **事件驱动**: 通过不同的事件类型处理各种响应状态

### 对话中断支持
- **智能中断**: 支持问答节点、输入节点等可能导致对话中断的场景
- **断点续传**: 对话中断时，只需再次调用对话流，在 `additional_messages` 中指定输入内容即可继续对话
- **状态保持**: 自动维护对话状态和上下文信息

### 调试功能
- **调试链接**: 调用接口后，可从响应的 Done 事件中获得 `debug_url`
- **可视化调试**: 通过可视化界面查看对话流的试运行过程，包含每个执行节点的输入输出等详细信息
- **性能监控**: 提供详细的执行时间和资源使用统计

### 多模态支持
- **文件处理**: 支持文档、图片、音频等多种文件格式
- **URL 接入**: 支持通过公开 URL 访问多模态内容
- **格式转换**: 自动处理不同格式的内容转换

## 请求说明

### 基本配置
- **请求方式**: POST
- **请求地址**: `https://api.coze.cn/v1/workflows/chat`
- **认证方式**: Bearer Token
- **Content-Type**: application/json

### 请求头
```http
Authorization: Bearer pat_*****
Content-Type: application/json
```

### 请求参数

#### 基础参数说明
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| workflow_id | string | 是 | 工作流 ID |
| app_id | string | 否 | 扣子应用 ID（调用应用中的对话流时需要） |
| additional_messages | array | 否 | 额外的消息内容 |
| conversation_id | string | 否 | 会话 ID（用于保持对话上下文） |
| bot_id | string | 否 | 机器人 ID |

#### 调用空间资源库中的对话流
```json
{
  "workflow_id": "74423***",
  "conversation_id": "456",
  "additional_messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下工作流功能",
      "content_type": "text"
    }
  ]
}
```

#### 调用扣子应用中的对话流
```json
{
  "workflow_id": "74423***",
  "app_id": "7439828073***",
  "conversation_id": "456",
  "additional_messages": [
    {
      "role": "user", 
      "content": "查询今天的天气",
      "content_type": "text"
    }
  ]
}
```

#### 多模态内容调用
```json
{
  "workflow_id": "74423***",
  "additional_messages": [
    {
      "role": "user",
      "content": "请分析这张图片",
      "content_type": "image",
      "file_url": "https://example.com/image.jpg"
    }
  ]
}
```

## 响应格式

### 事件流结构
响应采用 Server-Sent Events (SSE) 格式，包含多种事件类型：

#### 1. 对话创建事件
```json
event: conversation.chat.created
data: {
  "id": "120",
  "conversation_id": "456",
  "created_at": 1733407180,
  "last_error": {
    "code": 0,
    "msg": ""
  },
  "status": "created",
  "usage": {
    "token_count": 0,
    "output_count": 0,
    "input_count": 0
  },
  "section_id": "789"
}
```

#### 2. 对话进行中事件
```json
event: conversation.chat.in_progress
data: {
  "id": "121",
  "conversation_id": "456",
  "created_at": 1733407180,
  "last_error": {
    "code": 0,
    "msg": ""
  },
  "status": "in_progress",
  "usage": {
    "token_count": 0,
    "output_count": 0,
    "input_count": 0
  },
  "section_id": "789"
}
```

#### 3. 消息增量事件
```json
event: conversation.message.delta
data: {
  "id": "122",
  "conversation_id": "456",
  "role": "assistant",
  "type": "answer",
  "content": "中午吃啥了",
  "content_type": "text",
  "chat_id": "567",
  "section_id": "789",
  "created_at": 1733407182
}
```

#### 4. 消息完成事件
```json
event: conversation.message.completed
data: {
  "id": "124",
  "conversation_id": "456",
  "role": "assistant",
  "type": "answer",
  "content": "中午吃啥了",
  "content_type": "text",
  "chat_id": "567",
  "section_id": "789",
  "created_at": 1733407182
}
```

#### 5. 对话中断事件
```json
event: conversation.chat.requires_action
data: {
  "id": "131",
  "conversation_id": "456",
  "created_at": 1733407180,
  "completed_at": 1733407182,
  "last_error": {
    "code": 0,
    "msg": ""
  },
  "status": "requires_action",
  "usage": {
    "token_count": 0,
    "output_count": 0,
    "input_count": 0
  },
  "required_action": {
    "type": "submit_tool_outputs",
    "submit_tool_outputs": {
      "tool_calls": [
        {
          "id": "",
          "type": "reply_message",
          "function": null,
          "require_info": null
        }
      ]
    }
  },
  "section_id": "789"
}
```

#### 6. 调试信息
```json
data: {
  "debug_url": "https://www.coze.cn/work_flow?execute_id=74449256856***&space_id=7442165654356*****&workflow_id=744224337778*****"
}
```

#### 7. 对话完成事件
```json
event: conversation.chat.completed
data: {
  "id": "132",
  "conversation_id": "456",
  "created_at": 1733407180,
  "completed_at": 1733407185,
  "last_error": {
    "code": 0,
    "msg": ""
  },
  "status": "completed",
  "usage": {
    "token_count": 150,
    "output_count": 80,
    "input_count": 70
  },
  "section_id": "789"
}
```

#### 8. 错误事件
```json
event: error
data: {
  "error": {
    "code": 403,
    "message": "Insufficient permissions to access this resource"
  }
}
```

## 返回参数详细说明

### 基础响应字段

#### Chat 级别字段
| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | string | 对话会话 ID | "120" |
| conversation_id | string | 会话标识符 | "456" |
| section_id | string | 章节/分段 ID | "789" |
| created_at | integer | 创建时间戳 | 1733407180 |
| completed_at | integer | 完成时间戳 | 1733407185 |
| status | string | 对话状态 | "created" / "in_progress" / "completed" |

#### Message 级别字段
| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | string | 消息 ID | "122" |
| role | string | 消息角色 | "assistant" / "user" |
| type | string | 消息类型 | "answer" / "verbose" / "function_call" |
| content | string | 消息内容 | "中午吃啥了" |
| content_type | string | 内容类型 | "text" / "image" / "file" |
| chat_id | string | 所属对话 ID | "567" |

#### 使用统计字段
| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| token_count | integer | 总 token 数 | 150 |
| output_count | integer | 输出 token 数 | 80 |
| input_count | integer | 输入 token 数 | 70 |

#### 错误信息字段
| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| code | integer | 错误码 | 0 (成功) / 403 (权限错误) |
| msg | string | 错误消息 | "Insufficient permissions" |

### 事件类型详解

#### conversation.chat.created
**触发时机**: 对话会话创建时
**用途**: 确认对话已建立，获取会话基础信息
**关键字段**:
- `id`: 对话会话唯一标识
- `conversation_id`: 用于后续消息关联
- `status`: 初始状态为 "created"

#### conversation.chat.in_progress  
**触发时机**: 对话开始处理时
**用途**: 表示对话正在执行中
**关键字段**:
- `status`: 状态为 "in_progress"
- 可用于界面加载状态显示

#### conversation.message.delta
**触发时机**: 消息内容增量更新时
**用途**: 流式输出消息内容
**关键字段**:
- `content`: 增量消息内容
- `role`: 消息发送者角色
- `type`: 消息类型标识

#### conversation.message.completed
**触发时机**: 单条消息完成时
**用途**: 确认消息已完整输出
**关键字段**:
- 包含完整消息内容
- 可用于消息状态更新

#### conversation.chat.requires_action
**触发时机**: 对话需要用户输入时
**用途**: 处理对话中断场景
**关键字段**:
- `required_action`: 需要的用户操作
- `tool_calls`: 工具调用信息

#### conversation.chat.completed
**触发时机**: 对话会话完成时
**用途**: 对话结束处理
**关键字段**:
- `status`: 状态为 "completed" 
- `usage`: 使用统计信息
- `completed_at`: 完成时间

## 完整响应流程示例

以下是一次完整对话的实际响应流程：

### 1. 对话创建阶段
```
event: conversation.chat.created
data: {
  "id": "chat_001",
  "conversation_id": "conv_123", 
  "created_at": 1733407180,
  "status": "created",
  "section_id": "sec_001"
}
```

### 2. 对话处理阶段
```
event: conversation.chat.in_progress
data: {
  "id": "chat_001",
  "conversation_id": "conv_123",
  "status": "in_progress",
  "section_id": "sec_001"
}
```

### 3. 消息增量输出阶段
```
event: conversation.message.delta
data: {
  "id": "msg_001",
  "conversation_id": "conv_123",
  "chat_id": "chat_001",
  "role": "assistant",
  "type": "answer",
  "content": "你好",
  "content_type": "text",
  "section_id": "sec_001"
}

event: conversation.message.delta
data: {
  "id": "msg_001", 
  "conversation_id": "conv_123",
  "chat_id": "chat_001",
  "role": "assistant",
  "type": "answer",
  "content": "！很高兴",
  "content_type": "text",
  "section_id": "sec_001"
}

event: conversation.message.delta
data: {
  "id": "msg_001",
  "conversation_id": "conv_123", 
  "chat_id": "chat_001",
  "role": "assistant",
  "type": "answer",
  "content": "为你提供帮助。",
  "content_type": "text",
  "section_id": "sec_001"
}
```

### 4. 消息完成阶段
```
event: conversation.message.completed
data: {
  "id": "msg_001",
  "conversation_id": "conv_123",
  "chat_id": "chat_001", 
  "role": "assistant",
  "type": "answer",
  "content": "你好！很高兴为你提供帮助。",
  "content_type": "text",
  "created_at": 1733407182,
  "section_id": "sec_001"
}
```

### 5. 调试信息阶段
```
data: {
  "debug_url": "https://www.coze.cn/work_flow?execute_id=74449256856***&space_id=7442165654356*****&workflow_id=744224337778*****"
}
```

### 6. 对话完成阶段
```
event: conversation.chat.completed
data: {
  "id": "chat_001",
  "conversation_id": "conv_123",
  "created_at": 1733407180,
  "completed_at": 1733407185,
  "status": "completed",
  "usage": {
    "token_count": 25,
    "output_count": 15,
    "input_count": 10
  },
  "section_id": "sec_001"
}
```

**流程说明**:
1. 每个事件都有明确的 `event` 类型标识
2. `data` 中的字段根据事件类型有所不同
3. 通过 `conversation_id` 和 `chat_id` 关联相关事件
4. 增量消息通过多个 `conversation.message.delta` 事件组成完整回复
5. 使用统计信息在对话完成时提供

## 高级响应处理示例

### 多轮对话场景
```json
// 第一轮对话响应
event: conversation.chat.created
data: {"id": "chat_001", "conversation_id": "conv_123", "status": "created"}

event: conversation.message.delta
data: {"content": "你好", "role": "assistant", "type": "answer"}

event: conversation.message.completed  
data: {"content": "你好！有什么可以帮助您的吗？", "role": "assistant", "type": "answer"}

event: conversation.chat.completed
data: {"status": "completed", "usage": {"token_count": 15}}

// 第二轮对话（继续同一个conversation_id）
event: conversation.chat.created
data: {"id": "chat_002", "conversation_id": "conv_123", "status": "created"}

event: conversation.message.delta
data: {"content": "基于之前的对话", "role": "assistant", "type": "answer"}

event: conversation.chat.completed
data: {"status": "completed", "usage": {"token_count": 35}}
```

### 中断与恢复场景
```json
// 对话中断
event: conversation.chat.requires_action
data: {
  "status": "requires_action",
  "required_action": {
    "type": "submit_tool_outputs",
    "submit_tool_outputs": {
      "tool_calls": [{
        "id": "call_001",
        "type": "reply_message",
        "function": {"name": "get_user_input"}
      }]
    }
  }
}

// 恢复对话（用户提供了所需信息）
event: conversation.chat.in_progress  
data: {"status": "in_progress", "conversation_id": "conv_123"}

event: conversation.message.completed
data: {"content": "感谢提供信息，继续处理...", "role": "assistant"}

event: conversation.chat.completed
data: {"status": "completed", "usage": {"token_count": 50}}
```

### 多模态内容响应
```json
// 图片分析请求响应
event: conversation.message.delta
data: {
  "content": "我分析了这张图片",
  "role": "assistant", 
  "type": "answer",
  "content_type": "text"
}

event: conversation.message.delta
data: {
  "content": "图中显示了",
  "role": "assistant",
  "type": "answer", 
  "content_type": "text"
}

event: conversation.message.completed
data: {
  "content": "我分析了这张图片，图中显示了一座山脉在日落时分的美丽景象。",
  "role": "assistant",
  "type": "answer",
  "content_type": "text",
  "metadata": {
    "image_analysis": {
      "objects": ["mountain", "sun", "clouds"],
      "confidence": 0.95
    }
  }
}
```

## 消息类型说明

### 消息角色 (role)
- **assistant**: 助手回复消息
- **user**: 用户发送消息
- **system**: 系统消息

### 消息类型 (type)
- **answer**: 正常文本回复
- **verbose**: 详细调试信息
- **function_call**: 函数调用
- **tool_output**: 工具输出
- **image**: 图片消息
- **file**: 文件消息

### 内容类型 (content_type)
- **text**: 文本内容
- **image**: 图片内容
- **file**: 文件内容
- **audio**: 音频内容

## 状态说明

### 对话状态 (status)
- **created**: 对话已创建
- **in_progress**: 对话进行中
- **requires_action**: 需要用户操作（中断）
- **completed**: 对话已完成

## 重要说明

### 多模态内容处理
如果对话流的输入中包含文件、图片等多模态内容，需要：
1. 先将多模态内容上传到第三方存储工具
2. 获取公开可访问的 URL 地址
3. 将此 URL 作为对话流的输入

### 错误处理
- 成功调用时，返回信息中 `code` 字段为 0
- 调用失败时，`code` 为其他值，`msg` 字段包含详细错误信息
- 可参考错误码文档查看对应的解决方法

### 对话层级结构
响应数据包含两级结构：
- **Chat 级别**: 包含会话整体信息
- **Message 级别**: 包含具体消息内容

在 chat 事件中，data 字段中的 `id` 为 Chat ID（会话 ID），还包含 `conversation_id` 和 `bot_id` 等标识信息。

## 完整调用示例

### cURL 示例
```bash
curl --location --request POST 'https://api.coze.cn/v1/workflows/chat' \
--header 'Authorization: Bearer pat_hfwkehfncaf****' \
--header 'Content-Type: application/json' \
--header 'Accept: text/event-stream' \
--data-raw '{
    "workflow_id": "74423***",
    "conversation_id": "456", 
    "additional_messages": [
        {
            "role": "user",
            "content": "你好，请帮我查询信息",
            "content_type": "text"
        }
    ]
}'
```

### Python 示例
```python
import requests
import json
import sseclient

def chat_with_workflow():
    url = "https://api.coze.cn/v1/workflows/chat"
    headers = {
        "Authorization": "Bearer pat_hfwkehfncaf****",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    }
    
    data = {
        "workflow_id": "74423***",
        "conversation_id": "456",
        "additional_messages": [
            {
                "role": "user",
                "content": "你好，请帮我查询信息",
                "content_type": "text"
            }
        ]
    }
    
    response = requests.post(url, headers=headers, json=data, stream=True)
    client = sseclient.SSEClient(response)
    
    for event in client.events():
        if event.event == "conversation.message.delta":
            message_data = json.loads(event.data)
            print(f"收到消息: {message_data.get('content', '')}")
```

## 错误处理

### 常见错误码
| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 401 | 认证失败 | 检查 Bearer Token 是否正确 |
| 403 | 权限不足 | 确认令牌是否开通了 run 权限 |
| 404 | 工作流不存在 | 检查 workflow_id 是否正确 |
| 429 | 请求频率过高 | 降低请求频率 |
| 500 | 服务器内部错误 | 稍后重试或联系技术支持 |

### 错误响应示例
```json
{
  "error": {
    "code": 403,
    "message": "Insufficient permissions to access this resource"
  }
}
```

## 使用建议

1. **流式处理**: 建议实现 SSE 客户端来实时处理响应数据
2. **状态管理**: 根据对话状态进行相应的界面更新和用户提示  
3. **错误处理**: 完善的错误处理机制，包括网络异常和业务错误
4. **调试利用**: 充分利用 debug_url 进行问题排查和流程优化
5. **重试机制**: 实现合理的重试逻辑，处理网络异常
 6. **超时设置**: 设置合适的请求超时时间，避免长时间等待

---

## 版本更新记录

### v2.2 (2024-12-09) 
- **新增**: 详细的返回参数说明与字段表格
- **新增**: 事件类型详解，包含每个事件的触发时机和用途
- **新增**: 完整响应流程示例，展示实际对话过程
- **新增**: 高级响应处理示例，包含多轮对话、中断恢复、多模态场景
- **新增**: 对话完成事件和错误事件示例
- **更新**: 消息类型和内容类型扩展，支持更多格式
- **优化**: 响应数据结构分层说明（Chat级别和Message级别）

### v2.1 (2024-12-09)
- **新增**: 完整的 cURL 和 Python 调用示例
- **新增**: 错误处理章节，包含常见错误码和解决方案
- **新增**: 多模态内容调用示例
- **更新**: 请求参数表格化，增加详细参数说明
- **更新**: 接口特性章节，添加 SSE 支持和多模态支持
- **优化**: 整体文档结构，提升可读性和实用性

### v2.0 (2024-早期)
- **新增**: 基础接口文档结构
- **新增**: 事件流响应格式说明
- **新增**: 对话状态管理和调试功能介绍

---

**相关链接**:
- 🔗 [Coze API 总览](https://www.coze.cn/open/docs/developer_guides/coze_api_overview)
- 🔗 [工作流运行 API](https://www.coze.cn/open/docs/developer_guides/workflow_run)  
- 🔗 [个人访问令牌](https://www.coze.cn/docs/developer_guides/pat)