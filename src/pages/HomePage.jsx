import { useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { api } from '../lib/api';

export default function HomePage(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ api.posts().then(setItems); },[]);

  return (
    <div className="pb-20 sm:pb-0">
      <Header/>
      <div className="px-5">
        <div className="mb-4">
          <div className="rounded-2xl shadow-inner px-4 py-3 text-neutral-400">🔎 Search</div>
        </div>
        <div className="space-y-5">
          {items.map((it)=> (
            <article key={it.id} className="rounded-3xl shadow-xl p-4">
              <p className="text-neutral-700 mb-3 line-clamp-3">{it.snippet}</p>
              {it.image ? <img src={it.image} alt="poster" className="rounded-2xl w-full mb-3"/> : <div className="h-40 bg-neutral-100 rounded-2xl mb-3" />}
              <div className="text-neutral-500">👍 {it.likes?.toLocaleString?.()||'1.200'}</div>
            </article>
          ))}
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}
