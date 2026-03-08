import { useState, useEffect, useRef } from 'react';
import { BarChart3, Clock, Edit3, FileText, Zap, TrendingUp, Award, Activity, RefreshCw } from 'lucide-react';
import { getHistory } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, rawValue, displayValue, icon: Icon, gradient, delay, suffix = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-500"
      style={{
        background: gradient,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
        style={{ background: 'rgba(255,255,255,0.25)', filter: 'blur(20px)' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <TrendingUp className="w-5 h-5 text-white/50" />
        </div>
        <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
        <p className="text-white text-4xl font-bold tracking-tight">
          {displayValue}{suffix}
        </p>
      </div>
    </div>
  );
}

// ── Mini circular progress ───────────────────────────────────────────────────
function RingProgress({ pct }) {
  const r = 52, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 400);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width="140" height="140" className="rotate-[-90deg]">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Activity sparkline ───────────────────────────────────────────────────────
function ActivityBar({ history }) {
  if (!history.length) return null;
  const last7 = [...history].slice(-7);
  const maxT = Math.max(...last7.map(h => h.response_time), 1);
  return (
    <div className="flex items-end gap-1.5 h-12">
      {last7.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer">
          {/* Tooltip */}
          <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
            {h.response_time}ms
          </div>
          <div
            className="w-full rounded-t-md transition-all duration-700 group-hover:brightness-110"
            style={{
              height: `${Math.round((h.response_time / maxT) * 40)}px`,
              background: 'linear-gradient(180deg, #6366f1, #a855f7)',
              opacity: 0.7 + (i / last7.length) * 0.3,
              transitionDelay: `${i * 80}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    averageResponseTime: 0,
    editedReplies: 0,
    feedbackRate: 0,
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const animTotal = useCountUp(metrics.totalRequests);
  const animAvg   = useCountUp(metrics.averageResponseTime);
  const animEdited = useCountUp(metrics.editedReplies);

  useEffect(() => { fetchMetrics(); }, []);

  const fetchMetrics = async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const loadData = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
      const total = data.length;
      const edited = data.filter(i => i.status === 'edited').length;
      const avg = total > 0
        ? Math.round(data.reduce((s, i) => s + i.response_time, 0) / total)
        : 0;
      setMetrics({
        totalRequests: total,
        averageResponseTime: avg,
        editedReplies: edited,
        feedbackRate: total > 0 ? +((edited / total) * 100).toFixed(1) : 0,
      });
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-10 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        }}
      >
        {/* Mesh decoration */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%)',
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-purple-300 text-sm font-semibold uppercase tracking-widest">วิเคราะห์ข้อมูล</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-1">แดชบอร์ด</h1>
            <p className="text-white/50 text-sm">ติดตามประสิทธิภาพการตอบอีเมลด้วย AI แบบเรียลไทม์</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit transition-colors disabled:opacity-50 group"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 text-green-400 animate-spin" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            )}
            <span className="text-white/80 text-sm font-medium">ข้อมูลล่าสุด</span>
          </button>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="คำขอทั้งหมด"
          displayValue={animTotal}
          icon={FileText}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          delay={0}
        />
        <StatCard
          title="เวลาตอบกลับเฉลี่ย"
          displayValue={animAvg}
          suffix="ms"
          icon={Zap}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          delay={120}
        />
        <StatCard
          title="คำตอบที่ถูกแก้ไข"
          displayValue={animEdited}
          icon={Edit3}
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          delay={240}
        />
      </div>

      {/* ── Bottom 2-col section ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Feedback Rate ring */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <RingProgress pct={metrics.feedbackRate} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">{metrics.feedbackRate}%</span>
              <span className="text-xs text-slate-400 mt-0.5">การแก้ไข</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2 justify-center">
              <Award className="w-4 h-4 text-purple-500" />
              อัตราการแก้ไขโดยมนุษย์
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              มีการแก้ไข {metrics.editedReplies} รายการ จากทั้งหมด {metrics.totalRequests} รายการ
            </p>
          </div>
        </div>

        {/* Recent activity sparkline */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              ความเร็วการตอบกลับล่าสุด
            </h3>
            <span className="text-xs text-slate-400">ย้อนหลัง {Math.min(history.length, 7)} รายการ</span>
          </div>

          {history.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">ยังไม่มีข้อมูล</p>
          ) : (
            <>
              <ActivityBar history={history} />
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-xl p-3">
                  <p className="text-xs text-indigo-500 font-medium mb-0.5">เร็วที่สุด</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {Math.min(...history.map(h => h.response_time))}ms
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-500 font-medium mb-0.5">ช้าที่สุด</p>
                  <p className="text-xl font-bold text-purple-700">
                    {Math.max(...history.map(h => h.response_time))}ms
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

