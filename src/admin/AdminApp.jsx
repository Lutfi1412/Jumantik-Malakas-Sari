// src/admin/AdminApp.jsx
import { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';

import HomeAdmin from './HomeAdmin';
import LaporanAdmin from './LaporanAdmin';
import AccountsAdmin from './AccountsAdmin';

export default function AdminApp() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    // TODO: hapus token/session beneran di sini
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      {/* ===== Topbar (mobile) ===== */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-3 shadow-sm lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100"
          aria-label="Open menu"
        >
          {/* icon burger */}
          <svg width="20" height="20" viewBox="0 0 20 20" className="fill-current">
            <path d="M2 5h16v2H2zM2 9h16v2H2zM2 13h16v2H2z" />
          </svg>
        </button>
        <div className="font-semibold">Jumantik • Admin</div>
      </header>

      {/* ===== Overlay (mobile) ===== */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* ===== Sidebar (drawer di mobile) ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-900 text-slate-100 px-4 py-6 transition-transform lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold">Menu</div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <nav className="space-y-2">
          <Item to="/admin" onClick={() => setOpen(false)} end>Home</Item>
          <Item to="/admin/laporan" onClick={() => setOpen(false)}>Laporan</Item>
          <Item to="/admin/akun" onClick={() => setOpen(false)}>Data Akun</Item>
        </nav>

        <button
          onClick={() => { setOpen(false); logout(); }}
          className="mt-auto w-full rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* ====== MOBILE CONTENT (own layout) ====== */}
      <main className="lg:hidden pt-14">
        <div className="min-h-dvh px-4 sm:px-6 py-4">
          <ContentRoutes />
        </div>
      </main>

      {/* ====== DESKTOP CONTENT (sidebar + content) ====== */}
      <div className="hidden lg:flex">
        {/* Static sidebar (desktop) */}
        <aside className="sticky top-0 h-screen w-60 flex-shrink-0 bg-slate-900 text-slate-100 px-4 py-6">
          <div className="font-semibold text-lg mb-6">Jumantik • Admin</div>
          <nav className="space-y-2">
            <Item to="/admin" end>Home</Item>
            <Item to="/admin/laporan">Laporan</Item>
            <Item to="/admin/akun">Data Akun</Item>
          </nav>
          <button
            onClick={logout}
            className="mt-6 w-full rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-sm"
          >
            Logout
          </button>
        </aside>

        {/* Main content (desktop) */}
        <main className="flex-1 min-h-screen bg-white">
          <div className="px-6 lg:px-8 py-6">
            <ContentRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}

/** Routes dipakai ulang di mobile & desktop supaya tidak duplikasi logic */
function ContentRoutes() {
  return (
    <Routes>
      <Route index element={<HomeAdmin />} />
      <Route path="laporan" element={<LaporanAdmin />} />
      <Route path="akun" element={<AccountsAdmin />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}

/** Link item sidebar */
function Item({ to, children, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 transition',
          isActive ? 'bg-white text-slate-800 shadow' : 'hover:bg-white/10',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
}
