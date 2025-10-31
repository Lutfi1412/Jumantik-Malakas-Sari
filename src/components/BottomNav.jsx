import { NavLink } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { CgProfile } from 'react-icons/cg';

function Item({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 py-2 text-xs grid place-items-center gap-1 ${
          isActive ? 'text-blue-600' : 'text-neutral-500'
        }`
      }
    >
      <Icon size={22} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    // <- kunci: sm:hidden  => sembunyikan mulai breakpoint sm (≥640px)
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,.06)] z-40 sm:hidden">
      <div className="flex">
        <Item to="/" label="Beranda" icon={AiOutlineHome} />
        <Item to="/laporan" label="Laporan" icon={HiOutlineDocumentText} />
        <Item to="/profile" label="Profile" icon={CgProfile} />
      </div>
    </nav>
  );
}
