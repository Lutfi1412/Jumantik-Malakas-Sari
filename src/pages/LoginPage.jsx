import { useState } from 'react';
import { Link } from 'react-router-dom'; // ⬅️ tambahkan ini

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [err,setErr]=useState('');

  const submit=(e)=>{
    e.preventDefault();
    setErr('');
    // TODO: ganti dengan api.login(email, password)
    window.location.replace('/'); // default: masuk sebagai warga
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Login to your account
        </h1>
      </div>

      <form onSubmit={submit} className="px-6 space-y-4">
        <div>
          <label className="block mb-2 text-neutral-800">Username</label>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-2xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-neutral-800">Password</label>
          <div className="relative">
            <input
              type={show? 'text':'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={()=>setShow(s=>!s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {show? '🙈':'👁️'}
            </button>
          </div>
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button className="w-full bg-blue-600 text-white rounded-2xl py-3 text-lg">
          Login
        </button>
      </form>

      {/* ⬇️ Tambahkan blok pemisah role di luar form */}
      <div className="px-6 mt-6">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <div className="flex-1 h-px bg-neutral-200" />
          atau
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Masuk sebagai Warga */}
          <Link
            to="/"
            className="text-center rounded-2xl py-3 bg-blue-600 text-white"
          >
            Masuk Warga
          </Link>

          {/* Masuk sebagai Kelurahan/Pusat */}
          <Link
            to="/admin"
            className="text-center rounded-2xl py-3 bg-neutral-900 text-white"
          >
            Masuk Kelurahan
          </Link>
        </div>
      </div>
    </div>
  );
}
