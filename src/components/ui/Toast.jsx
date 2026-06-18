import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

let toastQueue = [];
let listeners = [];

export function toast(message, type = 'success', duration = 3500) {
  const id = Date.now();
  toastQueue = [...toastQueue, { id, message, type }];
  listeners.forEach((fn) => fn([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toastQueue]));
  }, duration);
}

const icons = {
  success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  error: <XCircle className="w-4 h-4 shrink-0" />,
  info: <Info className="w-4 h-4 shrink-0" />,
};

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fn = (updated) => setToasts(updated);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm shadow-lg',
            'pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-200',
            styles[t.type] || styles.info,
          ].join(' ')}
        >
          {icons[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
