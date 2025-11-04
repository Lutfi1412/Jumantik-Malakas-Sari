import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function CreateSurat() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 flex flex-col items-center justify-center px-6 py-10 text-center">
      {/* Animated 404 */}
      <div className="relative mb-6">
        <div className="text-[100px] sm:text-[140px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 leading-none animate-pulse">
          404
        </div>

        {/* Floating blobs */}
        <div className="absolute top-1/2 left-1/4 w-10 h-10 sm:w-14 sm:h-14 bg-sky-200 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 rounded-full blur-2xl animate-float-delayed" />
      </div>

      {/* Text content */}
      <div className="space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Ini Buat Surat RT
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-sm sm:max-w-md mx-auto">
          hsdhjshdjh
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
