export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  confirmStyle = 'danger',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 bg-slate-900/45 flex items-center justify-center p-4 font-sans animate-[cdFadeIn_0.15s_ease]"
      onClick={onCancel}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes cdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cdSlideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div
        className="bg-white rounded-2xl p-7 w-full max-w-100 shadow-[0_20px_60px_rgba(15,23,42,0.18)] animate-[cdSlideUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-xl
            ${confirmStyle === 'danger' ? 'bg-red-50' : 'bg-blue-50'}
          `}
        >
          {confirmStyle === 'danger' ? '⚠️' : '✅'}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-slate-900 m-0 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-[13.5px] text-slate-500 leading-relaxed m-0 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="px-4.5 py-2.25 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-500 cursor-pointer transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4.5 py-2.25 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer transition-colors duration-150
              ${
                confirmStyle === 'danger'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}