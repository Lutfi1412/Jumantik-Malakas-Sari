import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { BsChatDots } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa';

export default function Header({ backTo, title = 'Jumantik Digital' }) {
  const { pathname } = useLocation();
  const showChat = pathname !== '/chat';

  return (
    <header className="px-5 pt-4 pb-3 flex items-center justify-between">
      {/* Kiri: back atau logo */}
      {backTo ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={backTo}
            aria-label="Kembali"
            className="p-2 sm:p-3 -ml-2 rounded-full hover:bg-black/5"
          >
            {/* ukuran ikon: mobile 24px, desktop lebih besar */}
            <FaArrowLeft className="text-2xl sm:text-3xl" />
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-2xl">🦟</span>
          <span>{title}</span>
        </div>
      )}

      {/* Kanan: chat + profile (profile disembunyikan di mobile, besar di desktop) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showChat && (
          <Link
            to="/chat"
            aria-label="Chat"
            className="p-2 sm:p-3 rounded-full hover:bg-black/5"
          >
            <BsChatDots className="text-2xl sm:text-3xl" />
          </Link>
        )}

        {/* Sembunyikan di mobile karena sudah ada bottom nav; tampil besar di desktop */}
        <Link
          to="/profile"
          aria-label="Profile"
          className="hidden sm:inline-flex p-2 sm:p-3 rounded-full hover:bg-black/5"
        >
          <CgProfile className="text-2xl sm:text-3xl" />
        </Link>
      </div>
    </header>
  );
}
