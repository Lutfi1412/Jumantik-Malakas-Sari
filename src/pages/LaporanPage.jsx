import { useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { isMobile } from '../lib/device';
import { api } from '../lib/api';

export default function LaporanPage(){
  const [status,setStatus]=useState('Tidak Berpotensi');
  const [alamat,setAlamat]=useState('');
  const [photo,setPhoto]=useState(null);
  const fileRef = useRef(null);

  const showCamera = useMemo(()=> isMobile() && status==='Berpotensi', [status]);

  const pickPhoto=()=> fileRef.current?.click();

  const onFile=(e)=>{
    const f=e.target.files?.[0];
    if(!f) return;
    setPhoto(Object.assign(f,{ preview:URL.createObjectURL(f) }));
  };

  const submit=async()=>{
    const form = new FormData();
    form.append('status', status);
    form.append('alamat', alamat);
    if(photo) form.append('photo', photo);
    await api.createReport(form);
    alert('Laporan terkirim');
    setAlamat(''); setPhoto(null); setStatus('Tidak Berpotensi');
  };

  return (
    <div className="pb-24 sm:pb-10">
      <Header/>

      <div className="px-5 space-y-5">
        {/* Pilihan status - border dibuat lebih terlihat */}
        <div className="rounded-2xl shadow px-4 py-3 border-2 border-neutral-300 focus-within:border-blue-600">
          <select
            value={status}
            onChange={e=>setStatus(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option>Tidak Berpotensi</option>
            <option>Berpotensi</option>
          </select>
        </div>

        {/* Detail Alamat - border dibuat lebih terlihat */}
        <textarea
          rows="4"
          value={alamat}
          onChange={e=>setAlamat(e.target.value)}
          placeholder="Detail Alamat"
          className="w-full rounded-2xl shadow-inner px-4 py-3 outline-none border-2 border-neutral-300 focus:border-blue-600"
        />

        {showCamera && (
          <div>
            {!photo && (
              <button
                onClick={pickPhoto}
                className="w-full rounded-2xl bg-neutral-900 text-white py-12 text-lg flex items-center justify-center gap-2"
              >
                📷 Ambil Gambar
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFile}
            />
            {photo && (<img src={photo.preview} alt="preview" className="rounded-2xl w-full"/>)}
          </div>
        )}
      </div>

      <div className="px-5 fixed bottom-20 sm:static inset-x-0">
        {(!showCamera || photo) && (
          <button onClick={submit} className="w-full bg-blue-600 text-white rounded-2xl py-3">Kirim</button>
        )}
      </div>

      <BottomNav/>
    </div>
  );
}
