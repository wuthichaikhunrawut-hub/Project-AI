import { useState } from 'react';
import { Copy, Edit3, AlertTriangle, Check, X } from 'lucide-react';
import { updateFeedback } from '../api';

function ReplyCard({ reply, responseTime, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(reply);
  const [isCopied, setIsCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      await updateFeedback(reply.id, {
        edited_reply: editedText,
        status: 'edited',
      });
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to save edit:', err);
      alert('Failed to save edit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(reply);
    setIsEditing(false);
  };

  const handleReport = async () => {
    if (!reportText.trim()) return;

    setIsSubmitting(true);
    try {
      await updateFeedback(reply.id, {
        status: 'reported',
        feedback: reportText,
      });
      setShowReportModal(false);
      setReportText('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to report:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          AI Generated Reply
        </h3>
        <p className="text-primary-100 text-sm mt-1">
          Response time: {responseTime}ms
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[200px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-slate-700 leading-relaxed"
          />
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 text-slate-700 leading-relaxed whitespace-pre-wrap">
            {editedText}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Wrong
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Report Incorrect Response
            </h3>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Please describe what was wrong with the AI response..."
              className="w-full min-h-[120px] p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-slate-700"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReport}
                disabled={isSubmitting || !reportText.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Submit Report
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportText('');
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplyCard;
