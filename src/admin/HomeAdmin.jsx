// src/admin/HomeAdmin.jsx
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import Modal from "../shared/Modal";
import Swal from "sweetalert2";
import { getkonten, deleteKonten } from "../services/konten"; // pastikan path sesuai

export default function HomeAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // 🚀 Fetch konten dari API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getkonten();
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // 🧩 Lock scroll body saat modal terbuka
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // === CRUD Functions ===
  function addContent() {
    setEditing({
      id: Date.now(),
      judul: "",
      deskripsi: "",
      gambar: "",
      __blobUrl: "",
    });
    setOpen(true);
  }

  function editContent(it) {
    setEditing({ ...it, __blobUrl: "" });
    setOpen(true);
  }

  async function handleDelete() {
    if (!editing?.id) return;
    const confirm = await Swal.fire({
      title: "Hapus Konten?",
      text: `Apakah kamu yakin ingin menghapus "${editing.judul}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteKonten(editing.id);
        setItems((prev) => prev.filter((x) => x.id !== editing.id));
        setOpen(false);
        Swal.fire("Berhasil!", "Konten berhasil dihapus", "success");
      } catch (err) {
        Swal.fire("Gagal", err.message, "error");
      }
    }
  }

  const handleSave = () => {
    /* simpan data baru */
  };
  const handleEdit = () => {
    /* update data */
  };

  // === Upload Image Handlers ===
  const openFile = () => fileRef.current?.click();

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    if (editing?.__blobUrl) URL.revokeObjectURL(editing.__blobUrl);
    const url = URL.createObjectURL(f);
    setEditing((e) => ({ ...e, gambar: url, __blobUrl: url }));
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
    setEditing((e) => ({ ...e, gambar: "", __blobUrl: "" }));
    if (fileRef.current) fileRef.current.value = "";
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
          <article
            key={it.id}
            className="rounded-2xl shadow border border-slate-100"
          >
            <div className="p-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{it.judul}</h3>
                <p className="text-sm text-slate-500">{it.deskripsi}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Petugas: {it.petugas}
                </p>
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
              {it.gambar ? (
                <div className="rounded-xl overflow-hidden">
                  <div className="w-full aspect-[16/9]">
                    <img
                      src={it.gambar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
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
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Konten">
        {editing && (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-sm mb-1">Judul</label>
              <input
                value={editing.judul}
                onChange={(e) =>
                  setEditing({ ...editing, judul: e.target.value })
                }
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Masukan judul konten …"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Deskripsi Konten</label>
              <textarea
                rows={4}
                value={editing.deskripsi}
                onChange={(e) =>
                  setEditing({ ...editing, deskripsi: e.target.value })
                }
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Masukan deskripsi …"
              />
            </div>

            {/* Dropzone / Upload */}
            <div>
              <label className="block text-sm mb-1">Gambar</label>
              <div
                role="button"
                tabIndex={0}
                onClick={openFile}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && openFile()
                }
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`rounded-xl border-2 border-dashed ${
                  dragOver ? "border-sky-500 bg-sky-50" : "border-slate-300"
                }`}
              >
                <div className="w-full aspect-[16/9] overflow-hidden rounded-[10px]">
                  {editing.gambar ? (
                    <img
                      src={editing.gambar}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
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
                {editing.gambar && (
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

            {/* Tombol bawah */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              {items.find((x) => x.id === editing.id) ? (
                // MODE EDIT
                <>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2"
                  >
                    <FaTrash /> Hapus
                  </button>

                  <button
                    onClick={handleEdit} // ← fungsi untuk simpan perubahan edit
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                </>
              ) : (
                // MODE ADD (TAMBAH)
                <button
                  onClick={handleSave} // ← fungsi untuk simpan data baru
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                  <FaSave /> Simpan
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
