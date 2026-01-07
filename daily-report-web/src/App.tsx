import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Prepare } from './pages/Prepare';
import { Fill } from './pages/Fill';
import { Success } from './pages/Success';
import { View } from './pages/View';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20" />
          <span className="font-bold text-white/90 tracking-tight">DailyReport</span>
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
