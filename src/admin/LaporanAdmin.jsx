// src/admin/LaporanAdmin.jsx
import { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import Modal from '../shared/Modal';

/* dummy laporan */
const initial = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  date: '01/Okt/2025',
  rt: (i % 6 + 1).toString().padStart(2, '0'),
  rw: (i % 4 + 1).toString().padStart(2, '0'),
  alamat: 'Jl. MH. Thamrin No. 50, Sibolga',
  kategori: i % 3 === 0 ? 'Berpotensi' : 'Tidak Berpotensi',
  pelapor: 'Sindy',
  image: '', // taruh url kalau mau demo gambar
}));

export default function LaporanAdmin() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== 'all' && r.kategori !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.alamat.toLowerCase().includes(q) ||
        r.pelapor.toLowerCase().includes(q) ||
        r.date.toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  function openForEdit(row) {
    setEditing({ ...row });
    setOpenEdit(true);
  }

  function saveEdit() {
    setRows((rs) => rs.map((r) => (r.id === editing.id ? editing : r)));
    setOpenEdit(false);
  }

  function exportCSV() {
    const header = [
      'No',
      'Tanggal',
      'RT',
      'RW',
      'Detail Alamat',
      'Kategori',
      'Pelapor',
      'Gambar',
    ];
    const csv = [header.join(',')]
      .concat(
        rows.map((r) =>
          [
            r.id,
            r.date,
            r.rt,
            r.rw,
            `"${r.alamat}"`,
            r.kategori,
            r.pelapor,
            r.image || '',
          ].join(','),
        ),
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="max-w-7xl mx-auto">
      {/* Header sticky + controls (wrap di mobile) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur">
        <div className="px-4 sm:px-6 py-4 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Laporan</h2>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari alamat/tanggal/pelapor…"
              className="flex-1 min-w-[160px] rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-[140px] rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">Semua</option>
              <option>Berpotensi</option>
              <option>Tidak Berpotensi</option>
            </select>
            <button
              onClick={exportCSV}
              className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="px-4 sm:px-6 pb-8 pt-2">
        <div className="rounded-2xl bg-white shadow-sm p-2 sm:p-4">
          {/* Table container must scroll on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="text-left">
                  <Th>No</Th>
                  <Th>Tanggal</Th>
                  <Th>RT</Th>
                  <Th>RW</Th>
                  <Th>Detail Alamat</Th>
                  <Th>Kategori</Th>
                  <Th>Pelapor</Th>
                  <Th className="text-center">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td className="whitespace-nowrap">{r.id}</Td>
                    <Td className="whitespace-nowrap">{r.date}</Td>
                    <Td className="whitespace-nowrap">{r.rt}</Td>
                    <Td className="whitespace-nowrap">{r.rw}</Td>
                    <Td className="min-w-[220px]">{r.alamat}</Td>
                    <Td>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.kategori === 'Berpotensi'
                            ? 'bg-rose-500/10 text-rose-700'
                            : 'bg-emerald-500/10 text-emerald-700'
                        }`}
                      >
                        {r.kategori}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">{r.pelapor}</Td>
                    <Td className="text-center">
                      <div className="inline-flex flex-wrap items-center gap-2">
                        <button
                          title="Lihat lokasi"
                          className="rounded-lg px-2 py-1 text-rose-600 hover:bg-rose-50"
                        >
                          <FaMapMarkerAlt />
                        </button>
                        <button
                          onClick={() => openForEdit(r)}
                          title="Edit"
                          className="rounded-lg px-2 py-1 text-sky-600 hover:bg-sky-50"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Laporan">
        {editing && (
          <div className="space-y-3">
            <label className="block text-sm">Tanggal</label>
            <input
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              className="w-full rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">RT</label>
                <input
                  value={editing.rt}
                  onChange={(e) => setEditing({ ...editing, rt: e.target.value })}
                  className="w-full rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm">RW</label>
                <input
                  value={editing.rw}
                  onChange={(e) => setEditing({ ...editing, rw: e.target.value })}
                  className="w-full rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200"
                />
              </div>
            </div>

            <label className="block text-sm">Detail Alamat</label>
            <textarea
              rows={3}
              value={editing.alamat}
              onChange={(e) => setEditing({ ...editing, alamat: e.target.value })}
              className="w-full rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200"
            />

            <label className="block text-sm">Kategori</label>
            <select
              value={editing.kategori}
              onChange={(e) => setEditing({ ...editing, kategori: e.target.value })}
              className="w-full rounded-xl bg-white px-3 py-2 shadow-sm border border-slate-200"
            >
              <option>Berpotensi</option>
              <option>Tidak Berpotensi</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpenEdit(false)} className="px-4 py-2">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* Helpers */
function Th({ children, className = '' }) {
  return (
    <th className={`px-3 sm:px-4 py-2 sm:py-3 text-sm font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`px-3 sm:px-4 py-3 align-top ${className}`}>{children}</td>;
}
