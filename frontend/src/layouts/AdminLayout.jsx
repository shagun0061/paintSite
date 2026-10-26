import {
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  PaintRoller,
  Settings,
  UserCog,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Seo } from '../components/layout/Seo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { cn } from '../utils/cn.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareQuote },
  { to: '/admin/services', label: 'Services', icon: PaintRoller },
  { to: '/admin/settings', label: 'Business settings', icon: Settings },
  { to: '/admin/account', label: 'Account & users', icon: UserCog },
];

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  return (
    <div className="flex h-full flex-col bg-navy-950 text-navy-200">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="truncate font-display text-lg font-semibold text-white">{settings.businessName}</p>
        <p className="text-xs tracking-wider text-navy-400 uppercase">Admin dashboard</p>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-5" aria-hidden="true" /> View website
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <LogOut className="size-5" aria-hidden="true" /> Sign out
        </button>
        <p className="truncate px-3 pt-2 text-xs text-navy-400">
          {user?.email} · {user?.role}
        </p>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-navy-50/60">
      <Seo title="Admin" noindex />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy-100 bg-white px-4 lg:hidden">
        <span className="font-bold">Admin</span>
        <button type="button" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-navy-50" aria-expanded={open} aria-controls="admin-drawer">
          <Menu className="size-6" aria-hidden="true" />
          <span className="sr-only">Open admin menu</span>
        </button>
      </div>
      {open && (
        <div id="admin-drawer" className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="relative h-full w-72 max-w-[85%]">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button type="button" onClick={() => setOpen(false)} className="absolute top-4 -right-12 rounded-full bg-white p-2">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
        </div>
      )}

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
