import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

export default function ChatPage(){
  const [messages,setMessages]=useState([
    {role:'bot', text:'Hello, good morning.'},
  ]);
  const [input,setInput]=useState('');
  const listRef=useRef(null);
  const inputRef=useRef(null);

  // rekomendasi hilang setelah ada pesan dari user
  const hasUserAsked = useMemo(() => messages.some(m => m.role === 'user'), [messages]);

  useEffect(()=>{
    listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
  },[messages]);

  const send=(e)=>{
    e?.preventDefault?.();
    if(!input.trim()) return;
    setMessages(m=>[
      ...m,
      {role:'user', text: input},
      {role:'bot', text:'(mock) Of course... Tell me your issue.'}
    ]);
    setInput('');
  };

  // === KIRIM LANGSUNG dari rekomendasi ===
  const sendSuggestion = (text) => {
    setMessages(m => [
      ...m,
      { role: 'user', text },
      { role: 'bot', text: '(mock) Of course... Tell me your issue.' }
    ]);
    // opsional: kosongkan input & fokuskan kolom untuk pertanyaan berikutnya
    setInput('');
    inputRef.current?.focus();
  };

  // daftar rekomendasi seputar jumantik
  const suggestions = [
    'Bagaimana cara membuat laporan jumantik?',
    'Apa bedanya “Berpotensi” dan “Tidak Berpotensi”?',
    'Apakah harus menyertakan foto saat melaporkan?',
    'Bagaimana melihat status laporan saya?',
    'Kapan petugas akan menindaklanjuti laporan?',
    'Tips 3M Plus untuk cegah sarang nyamuk?',
    'Bisakah saya menghapus atau mengedit laporan?',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-2">
        <Link
          to="/"
          aria-label="Kembali"
          className="p-1.5 -ml-2 rounded-full hover:bg-black/5"
        >
          <FaArrowLeft size={24} className="sm:size-7" />
        </Link>
        <h1 className="text-xl font-semibold">ChatBot</h1>
      </div>

      {/* Message list */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-5 space-y-3">
        {!hasUserAsked && (
          <section className="mb-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendSuggestion(q)}  // << kirim langsung
                  className="rounded-full border-2 border-neutral-300 px-3 py-1.5 text-sm
                             hover:border-blue-500 hover:text-blue-600 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {messages.map((m,i)=> (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${
              m.role==='user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-neutral-100'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input + tombol kirim */}
      <form onSubmit={send} className="p-4">
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Write your message..."
            className="w-full rounded-2xl px-4 py-3 outline-none
                       bg-white border-2 border-neutral-300 shadow-inner
                       focus:border-blue-600 focus:ring-2 focus:ring-blue-500
                       pr-12"
          />
          <button
            type="submit"
            aria-label="Kirim"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       grid place-items-center rounded-full p-2
                       text-blue-600 hover:bg-blue-50
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IoMdSend size={22} />
          </button>
        </div>
      </form>
    </div>
  );
}
