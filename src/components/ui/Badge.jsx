const variants = {
  // Status
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  // Priority
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
  // Generic
  info: 'bg-indigo-100 text-indigo-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-600',
};

const labels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
}) {
  const colorClass = variants[variant] || variants.neutral;
  const displayText = children ?? labels[variant] ?? variant;

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        colorClass,
        className,
      ].join(' ')}
    >
      {displayText}
    </span>
  );
}
