import { useState } from 'react';
import { Send, Sparkles, AlertCircle, Wand2, Bot, Copy, Check, Edit3, AlertTriangle, X } from 'lucide-react';
import { generateReply, updateFeedback } from '../api';

// ── Animated dots loader ─────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-white"
          style={{
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Inline Reply Panel ───────────────────────────────────────────────────────
function ReplyPanel({ reply, responseTime, onReset, onRefetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(reply.reply);
  const [isCopied, setIsCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState('');
  const [saving, setSaving] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(editedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await updateFeedback(reply.id, { edited_reply: editedText, status: 'edited' });
      setIsEditing(false);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const submitReport = async () => {
    if (!reportText.trim()) return;
    setSaving(true);
    try {
      await updateFeedback(reply.id, { status: 'reported', feedback: reportText });
      setShowReport(false); setReportText('');
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <>
      <div
        className="rounded-3xl overflow-hidden shadow-2xl animate-fadeIn"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 45%, #24243e 100%)' }}
      >
        {/* glows */}
        <div className="absolute pointer-events-none"
          style={{ inset: 0, backgroundImage: 'radial-gradient(circle at 10% 80%, #6366f155, transparent 50%), radial-gradient(circle at 90% 10%, #a855f755, transparent 45%)' }} />

        {/* header */}
        <div className="relative px-7 pt-7 pb-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">คำตอบจาก AI</p>
                <p className="text-white/40 text-xs">เวลาตอบกลับ {responseTime}ms</p>
              </div>
            </div>
            <button

              onClick={onReset}
              className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* reply body */}
        <div className="relative px-7 py-6">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="w-full min-h-[200px] bg-white/10 text-white/90 rounded-2xl p-4 resize-none border border-white/20 focus:outline-none focus:border-violet-400 leading-relaxed text-sm"
            />
          ) : (
            <p className="text-white/85 leading-relaxed text-sm whitespace-pre-wrap">{editedText}</p>
          )}
        </div>

        {/* action bar */}
        <div className="px-7 pb-7 flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button onClick={saveEdit} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors disabled:opacity-50">
                <Check className="w-4 h-4" /> บันทึก
              </button>
              <button onClick={() => { setIsEditing(false); setEditedText(reply.reply); }} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
                <X className="w-4 h-4" /> ยกเลิก
              </button>
            </>
          ) : (
            <>
              <button onClick={copy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-all">
                {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
              </button>
              <button onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/50 hover:bg-violet-500/70 text-white text-sm font-medium transition-all">
                <Edit3 className="w-4 h-4" /> แก้ไข
              </button>
              <button onClick={() => setShowReport(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/40 hover:bg-rose-500/60 text-white text-sm font-medium transition-all">
                <AlertTriangle className="w-4 h-4" /> รายงานปัญหา
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report modal */}
      {showReport && (
        <div
          onClick={e => e.target === e.currentTarget && setShowReport(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h3 className="text-slate-800 font-semibold text-base mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> แจ้งปัญหาการตอบกลับที่ไม่ถูกต้อง
            </h3>
            <textarea
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              placeholder="โปรดอธิบายสิ่งที่ผิดพลาด..."
              className="w-full min-h-[110px] p-3 border border-slate-200 rounded-xl resize-none text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={submitReport} disabled={saving || !reportText.trim()}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                ส่งรายงาน
              </button>
              <button onClick={() => setShowReport(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Generate Page ────────────────────────────────────────────────────────────
function Generate() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const charCount = message.trim().length;
  const isValid = charCount >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) { setError('ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร'); return; }
    setError(''); setIsLoading(true); setReply(null);
    try {
      const result = await generateReply(message);
      setReply(result);
      setResponseTime(result.response_time);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    } finally { setIsLoading(false); }
  };

  const handleReset = () => { setMessage(''); setReply(null); setResponseTime(null); setError(''); };

  return (
    <div className="space-y-7">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-10 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: 'radial-gradient(circle at 15% 60%, #6366f1, transparent 45%), radial-gradient(circle at 85% 25%, #06b6d4, transparent 40%)',
        }} />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                <Wand2 className="w-6 h-6 text-cyan-300" />
              </div>
              <span className="text-cyan-300 text-sm font-semibold uppercase tracking-widest">ทรงพลังด้วย AI</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-1">สร้างคำตอบอีเมล</h1>
            <p className="text-white/50 text-sm">วางข้อความจากลูกค้า → รับคำตอบแบบมืออาชีพได้ทันที</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/80 text-sm font-medium">พลังของ Gemini</span>
          </div>
        </div>
      </div>

      {/* ── Input Card ──────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden">
        {/* top accent line */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />

        <form onSubmit={handleSubmit} className="p-7">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700">ข้อความจากลูกค้า</label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${isValid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {charCount} / 10+ ตัวอักษร
            </span>
          </div>

          <div className={`relative rounded-2xl transition-all duration-300 ${error ? 'ring-2 ring-rose-300' : isValid ? 'ring-2 ring-indigo-200' : ''}`}>
            <textarea
              value={message}
              onChange={e => { setMessage(e.target.value); if (error) setError(''); }}
              placeholder="วางข้อความจากลูกค้าที่นี่... เช่น ปัญหาเกี่ยวกับคำสั่งซื้อ, ขอข้อมูลสินค้า ฯลฯ"
              rows={6}
              className="w-full p-5 rounded-2xl resize-none bg-slate-50 text-slate-700 text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors border border-slate-200 focus:border-indigo-300"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="mt-5 w-full py-4 px-6 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200/60 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: isLoading || !message.trim()
                ? '#94a3b8'
                : 'linear-gradient(135deg, #6366f1, #06b6d4)',
            }}
          >
            {isLoading ? (
              <>
                <ThinkingDots />
                <span className="ml-2">กำลังสร้างคำตอบ...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                สร้างคำตอบ
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Result ──────────────────────────────────────────────────────────── */}
      {reply && (
        <div className="relative">
          <ReplyPanel reply={reply} responseTime={responseTime} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default Generate;
