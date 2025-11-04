import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { IoMdCamera } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";

export default function BottomNav({ role }) {
  let items = [];

  if (role === "admin") {
    items = [
      { to: "/admin", label: "Beranda", icon: AiOutlineHome, end: true },
      { to: "/admin/laporan", label: "Laporan", icon: HiOutlineDocumentText },
      { to: "/admin/akun", label: "Akun", icon: MdManageAccounts },
    ];
  } else if (role === "koordinator") {
    items = [
      { to: "/koordinator", label: "Home", icon: AiOutlineHome, end: true },
      {
        to: "/koordinator/buat-laporan",
        label: "Buat Laporan",
        icon: IoMdCamera,
        end: true,
      },
      {
        to: "/koordinator/laporan",
        label: "Laporan",
        icon: HiOutlineDocumentText,
      },
    ];
  } else if (role === "petugas") {
    items = [
      { to: "/petugas", label: "Home", icon: AiOutlineHome, end: true },
      { to: "/petugas/input", label: "Input", icon: HiOutlineDocumentText },
      { to: "/petugas/profile", label: "Profile", icon: CgProfile },
    ];
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,.06)] z-40 sm:hidden">
      <div className="flex">
        {items.map((item, i) => (
          <Item key={i} {...item} />
        ))}
      </div>
    </nav>
  );
}

function Item({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end} // ✅ pastikan diteruskan ke NavLink
      className={({ isActive }) =>
        `flex-1 py-2 text-xs grid place-items-center gap-1 ${
          isActive ? "text-blue-600" : "text-neutral-500"
        }`
      }
    >
      <Icon size={22} />
      <span>{label}</span>
    </NavLink>
  );
}
