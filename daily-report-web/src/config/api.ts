// API 基础配置
// 开发环境使用代理，生产环境使用完整 URL
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'http://test-salebot.yiyouliao.com/api';

// Token 存储键名
export const TOKEN_KEY = 'wework_token';

// 开发环境测试 code（用于无企业微信环境的开发测试）
// Token 有效期：1天
export const DEV_TEST_CODE = 'w4-xOSBMj9u3BDCsBmNFHmUjWtWZ9OVN7iI2sYKrJ5U';
