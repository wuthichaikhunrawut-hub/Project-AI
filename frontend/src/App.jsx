import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Generate from './pages/Generate';
import History from './pages/History';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen app-bg text-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Routes>
          <Route path="/" element={<Generate />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
