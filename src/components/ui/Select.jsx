import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

// Custom dropdown — uses a portal so the menu escapes any parent
// transform/overflow context (which causes native <select> to misrender).
const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    placeholder,
    className = '',
    wrapperClassName = '',
    id,
    value,
    onChange,
    required,
    name,
    disabled,
  },
  _ref,
) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const selectedOption = options.find((o) => o.value === value);

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    computePosition();
    setOpen((o) => !o);
  };

  const handleSelect = (opt) => {
    // Synthesise a change event so callers using e.target.value work unchanged
    onChange?.({ target: { name, value: opt.value } });
    setOpen(false);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  return (
    <div className={['flex flex-col gap-1', wrapperClassName].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'w-full flex items-center justify-between gap-2',
          'rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white',
          'transition-colors duration-150 cursor-pointer text-left',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          error
            ? 'border-red-400'
            : open
              ? 'border-indigo-500 ring-2 ring-indigo-500'
              : 'border-gray-300 hover:border-gray-400',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption?.label ?? placeholder ?? 'Select…'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Portal dropdown menu */}
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-auto max-h-56 py-1 animate-in"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt)}
                className={[
                  'flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer select-none',
                  opt.value === value
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {opt.label}
                {opt.value === value && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
              </li>
            ))}
          </ul>,
          document.body,
        )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;
