import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FolderOpen,
  Inbox,
  Users,
  BarChart2,
  Settings,
  Target,
  X,
  ChevronUp,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard', exact: true },
    { label: 'My Tasks', icon: <CheckSquare className="w-5 h-5" />, path: '#my-tasks' },
    { label: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '#calendar' },
    { label: 'Projects', icon: <FolderOpen className="w-5 h-5" />, path: '#projects' },
    { label: 'Inbox', icon: <Inbox className="w-5 h-5" />, path: '#inbox' },
  ];

  const generalItems = [
    { label: 'Team', icon: <Users className="w-5 h-5" />, path: '#team' },
    { label: 'Reports', icon: <BarChart2 className="w-5 h-5" />, path: '#reports' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '#settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              TaskFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav */}
        <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.path === '/dashboard'; // Only Dashboard is active
              return (
                <a
                  key={item.label}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* General Nav */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              General
            </h3>
            <nav className="space-y-1">
              {generalItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 relative" ref={profileRef}>
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-10 overflow-hidden">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
          
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                {user?.avatar}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Ram Thapa'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'ram@example.com'}
                </p>
              </div>
            </div>
            <div className="text-gray-400 shrink-0 transition-transform">
              {isProfileOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
