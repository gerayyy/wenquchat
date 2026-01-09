import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Prepare } from './pages/Prepare';
import { Fill } from './pages/Fill';
import { Success } from './pages/Success';
import { View } from './pages/View';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getToken, getStoredToken } from './services/auth';
import { DEV_TEST_CODE } from './config/api';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // 检查是否已经有 token
        const storedToken = getStoredToken();
        if (storedToken) {
          console.log('已存在 token，跳过鉴权');
          setIsAuthenticating(false);
          return;
        }

        // 从 URL 参数中获取企业微信的 code
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');

        // 开发环境：如果没有 code，使用测试 code
        if (!code && import.meta.env.DEV) {
          console.log('开发环境：使用测试 code 获取 token');
          code = DEV_TEST_CODE;
        }

        if (code) {
          // 调用后端接口获取 token
          console.log('正在获取 token...');
          await getToken(code);
          console.log('Token 获取成功');

          // 清除 URL 中的 code 参数
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);

          setIsAuthenticating(false);
        } else {
          // 如果没有 code 且没有 token（生产环境）
          console.warn('未找到企业微信 code 参数，请通过企业微信进入');
          setAuthError('未找到企业微信授权码，请通过企业微信进入应用');
          setIsAuthenticating(false);
        }
      } catch (error) {
        console.error('鉴权失败:', error);
        setAuthError(error instanceof Error ? error.message : '鉴权失败');
        setIsAuthenticating(false);
      }
    };

    authenticate();
  }, []);

  // 鉴权中显示加载状态
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
          <p className="text-white/60">正在加载...</p>
        </div>
      </div>
    );
  }

  // 鉴权失败显示错误
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white/90 mb-2">鉴权失败</h2>
          <p className="text-white/60 mb-4">{authError}</p>
          <p className="text-white/40 text-sm">请通过企业微信重新进入应用</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20" />
          <span className="font-bold text-white/90 tracking-tight">问渠·日报系统</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/prepare" element={<Prepare />} />
          <Route path="/fill" element={<Fill />} />
          <Route path="/success" element={<Success />} />
          <Route path="/view" element={<View />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
