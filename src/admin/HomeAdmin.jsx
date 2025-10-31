// src/admin/HomeAdmin.jsx
import { useState, useRef } from 'react';
import Modal from '../shared/Modal';
import { FaPlus, FaEdit } from 'react-icons/fa';

const dummy = [
  { id: 1, title: 'Cegah DBD', desc: 'Tips pencegahan DBD...', image: '' },
  { id: 2, title: 'Vaksinasi Lokal', desc: 'Info vaksinasi...', image: '' },
  { id: 3, title: 'Tips 3M Plus', desc: 'Mengu ras, menutup, mengubur...', image: '' },
];

export default function HomeAdmin() {
  const [items, setItems] = useState(dummy);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // ====== file picker / drag-n-drop state ======
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function addContent() {
    setEditing({ id: Date.now(), title: '', desc: '', image: '', __blobUrl: '' });
    setOpen(true);
  }
  function editContent(it) {
    setEditing({ ...it, __blobUrl: '' });
    setOpen(true);
  }
  function save() {
    setItems((arr) => {
      const idx = arr.findIndex((a) => a.id === editing.id);
      const payload = { id: editing.id, title: editing.title, desc: editing.desc, image: editing.image || '' };
      if (idx > -1) {
        const next = [...arr];
        next[idx] = payload;
        return next;
      }
      return [payload, ...arr];
    });
    // bersihkan blob URL sementara jika ada
    if (editing?.__blobUrl) URL.revokeObjectURL(editing.__blobUrl);
    setOpen(false);
  }

  // ====== helpers untuk upload/preview gambar ======
  const openFile = () => fileRef.current?.click();

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    // revoke url lama bila ada
    if (editing?.__blobUrl) URL.revokeObjectURL(editing.__blobUrl);
    const url = URL.createObjectURL(f);
    setEditing((e) => ({ ...e, image: url, __blobUrl: url }));
  };

  const onInputFile = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const clearImage = () => {
    if (editing?.__blobUrl) URL.revokeObjectURL(editing.__blobUrl);
    setEditing((e) => ({ ...e, image: '', __blobUrl: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen">
      {/* Header sticky + tombol Add */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Home</h2>
          <button
            onClick={addContent}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
          >
            <FaPlus /> Add content
          </button>
        </div>
      </div>

      {/* Grid konten */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((it) => (
          <article key={it.id} className="rounded-2xl shadow border border-slate-100">
            <div className="p-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-slate-500">{it.desc}</p>
              </div>
              <button
                onClick={() => editContent(it)}
                className="p-2 rounded-lg text-sky-600 hover:bg-slate-50"
                title="Edit"
              >
                <FaEdit />
              </button>
            </div>

            <div className="px-4 pb-4">
              {it.image ? (
                <div className="rounded-xl overflow-hidden">
                  {/* Preview rapi memenuhi container */}
                  <div className="w-full aspect-[16/9]">
                    <img src={it.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="h-44 grid place-items-center rounded-xl bg-slate-100 text-slate-400">
                  Tidak ada gambar
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add / Edit Konten">
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Judul</label>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Masukan judul konten …"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Deskripsi Konten</label>
              <textarea
                rows={4}
                value={editing.desc}
                onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Masukan deskripsi …"
              />
            </div>

            {/* ====== Dropzone / Click-to-Upload ====== */}
            <div>
              <label className="block text-sm mb-1">Gambar</label>
              <div
                role="button"
                tabIndex={0}
                onClick={openFile}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFile()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`rounded-xl border-2 border-dashed ${
                  dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300'
                }`}
              >
                {/* preview akan nge-fit container (16:9) */}
                <div className="w-full aspect-[16/9] overflow-hidden rounded-[10px]">
                  {editing.image ? (
                    <img src={editing.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400">
                      Seret & letakkan gambar di sini, atau klik untuk memilih
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onInputFile}
                />
                {editing.image && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-sm text-slate-600 hover:text-rose-600"
                  >
                    Hapus gambar
                  </button>
                )}
              </div>
            </div>
            {/* ====== End Dropzone ====== */}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2">
                Batal
              </button>
              <button onClick={save} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white">
                Submit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
