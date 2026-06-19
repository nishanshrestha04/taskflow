import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
  isLoading = false,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in"
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              danger ? 'bg-red-50' : 'bg-amber-50'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-amber-500'}`}
            />
          </div>
          <h2 id="confirm-title" className="text-base font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm text-gray-500 leading-relaxed pl-13">{message}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            isLoading={isLoading}
            className={
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                : ''
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
