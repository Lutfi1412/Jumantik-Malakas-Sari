import { useEffect } from 'react';

export default function Modal({ open, title, children, onClose }) {
  useEffect(()=>{
    const esc = (e)=> e.key==='Escape' && onClose?.();
    document.addEventListener('keydown', esc);
    return ()=> document.removeEventListener('keydown', esc);
  },[onClose]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl p-5 shadow-xl">
        <div className="text-xl font-semibold mb-3">{title}</div>
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">Tutup</button>
        </div>
      </div>
    </div>
  );
}
