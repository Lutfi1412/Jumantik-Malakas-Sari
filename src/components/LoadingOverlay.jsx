import React from "react";
import Lottie from "lottie-react";
import loadingAnim from "../assets/lottie/Sandy-Loading.json";

export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg flex flex-col items-center">
        <Lottie animationData={loadingAnim} loop={true} className="w-40 h-40" />
        <p className="text-slate-600 mt-3 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
