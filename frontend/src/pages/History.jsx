import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Timer, CheckCircle, AlertCircle, Edit3, X, Copy, Check, Filter } from 'lucide-react';
import { getHistory } from '../api';

// ── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);

  const copy = async (text, setter) => {
    await navigator.clipboard.writeText(text);
    setter(true); setTimeout(() => setter(false), 2000);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn relative border border-white/40">
        
        {/* Header gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">รายละเอียดคำตอบ</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.created_at))}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-7 space-y-6">
          
          {/* Customer Message */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                ข้อความจากลูกค้า
              </span>
              <button
                onClick={() => copy(item.customer_message, setCopiedMsg)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-600"
              >
                {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMsg ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}
              </button>
            </div>
            <div className="bg-slate-50/80 rounded-2xl p-5 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100/50 shadow-inner">
              {item.customer_message}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* AI Reply */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                คำตอบจาก AI
              </span>
              <button
                onClick={() => copy(item.edited_reply || item.ai_reply, setCopiedReply)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-all font-medium text-violet-600"
              >
                {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReply ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}
              </button>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50/50 rounded-2xl p-5 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-violet-100/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Edit3 className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                {item.edited_reply || item.ai_reply}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
            <Timer className="w-3.5 h-3.5" />
            เวลาตอบสนอง: {item.response_time}ms
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 min-w-[100px] bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-slate-200"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Loader ───────────────────────────────────────────────────────────────────
function BeautifulLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-pulse">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-violet-500 border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-[3px] border-fuchsia-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">กำลังโหลดข้อมูลประวัติ...</p>
    </div>
  );
}

// ── History Page ─────────────────────────────────────────────────────────────
function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const getStatusBadge = (status) => {
    const config = {
      generated: { icon: CheckCircle, colors: 'bg-emerald-100/50 text-emerald-700 border-emerald-200', label: 'อัตโนมัติ' },
      edited:    { icon: Edit3,       colors: 'bg-violet-100/50 text-violet-700 border-violet-200',   label: 'แก้ไขแล้ว' },
      reported:  { icon: AlertCircle, colors: 'bg-rose-100/50 text-rose-700 border-rose-200',         label: 'รายงานปัญหา' },
    }[status] || { icon: CheckCircle, colors: 'bg-slate-100 text-slate-700 border-slate-200', label: status };
    
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${config.colors}`}>
        <Icon className="w-3 h-3" /> {config.label}
      </span>
    );
  };

  const filteredHistory = history.filter(h => filter === 'all' ? true : h.status === filter);

  if (isLoading) return <BeautifulLoader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Detail Modal */}
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-10 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              ประวัติการใช้งาน
            </h1>
            <p className="text-slate-400 text-sm max-w-md">ย้อนดูประวัติการสร้างคำตอบ การแก้ไขของมนุษย์ และข้อความที่ถูกแจ้งรายงานปัญหา ได้ในที่เดียว</p>
          </div>
          
          {/* Filters */}
          <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-inner">
             {['all', 'generated', 'edited', 'reported'].map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                   filter === f 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                 }`}
               >
                 {f === 'all' ? <Filter className="w-4 h-4 inline mr-1.5" /> : null}
                 {f === 'all' ? 'ทั้งหมด' : f === 'generated' ? 'อัตโนมัติ' : f === 'edited' ? 'แก้ไขแล้ว' : 'แจ้งปัญหา'}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────────── */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-slate-50/50">
            <MessageSquare className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">ไม่พบประวัติการใช้งาน</h3>
          <p className="text-slate-500 max-w-sm mb-6">
            {filter === 'all' 
              ? "เริ่มทดลองสร้างคำตอบอีเมล แล้วประวัติทั้งหมดจะแสดงขึ้นมาที่นี่โดยอัตโนมัติ" 
              : `ไม่พบประวัติคำตอบอีเมลตรงกับตัวกรองที่เลือก`}
          </p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="text-violet-600 font-semibold hover:text-violet-700 underline underline-offset-4 decoration-violet-200">
              ล้างตัวกรอง
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">ข้อความจากลูกค้า</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">คำตอบที่ใช้จริง</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap"><Timer className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />เวลาใช้งาน</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">สถานะ</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">วันที่</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="group hover:bg-violet-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5 w-1/3">
                      <div className="max-w-[280px] text-sm text-slate-600 truncate group-hover:text-slate-900 transition-colors">
                        {item.customer_message}
                      </div>
                    </td>
                    <td className="px-6 py-5 w-1/3">
                      <div className="max-w-[280px] text-sm text-slate-500 font-medium truncate group-hover:text-violet-700 transition-colors">
                        {item.edited_reply || item.ai_reply}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-xs font-semibold text-slate-500 font-mono">
                        {item.response_time}ms
                      </span>
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {new Intl.DateTimeFormat('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(item.created_at))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ดูรายละเอียด →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
