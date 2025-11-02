// components/Users/tables/EducationTable.jsx
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EducationAddModal from "../addModals/EducationAddModal";
import { formatDate } from "../modalHooks/dateUtils";
import useCrudTable from "../modalHooks/useCrudTable";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Not sistemi metni
const notSistemaText = (val) =>
  val === "100"
    ? "100’lük Sistem"
    : val === "4"
    ? "4’lük Sistem"
    : String(val ?? "-");

const EducationTable = forwardRef(function EducationTable(
  { onValidChange }, // <-- parent'tan geçilecek (Status Bar için)
  ref
) {
  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Emin misin?",
      text: `“${row.okul} - ${row.bolum}” kaydını silmek istiyor musun?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "İptal",
      confirmButtonText: "Evet, sil!",
    });
    return res.isConfirmed;
  };
  const notify = (msg) => toast.success(msg);

  const {
    rows,
    modalOpen,
    modalMode,
    selectedRow,
    closeModal,
    openCreate,
    openEdit,
    handleSave,
    handleUpdate,
    handleDelete,
  } = useCrudTable(staticEducationDB, { confirmDelete, notify });

  // ✅ Satır sayısı değiştikçe parent’a “valid” sinyali gönder
  useEffect(() => {
    onValidChange?.(rows.length > 0);
  }, [rows, onValidChange]);

  // ✅ Dışarıya tek bir useImperativeHandle ile API ver
  useImperativeHandle(ref, () => ({
    openCreate,
    getData: () => rows, // tablo verileri
    hasAnyRow: () => rows.length > 0, // geriye uyumluluk
  }));

  return (
    <div className="">
      {/* Tablo */}
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Seviye</th>
                <th className="px-4 py-3">Okul Adı</th>
                <th className="px-4 py-3">Bölüm</th>
                <th className="px-4 py-3">Not Sistemi</th>
                <th className="px-4 py-3">GANO</th>
                <th className="px-4 py-3">Başlangıç</th>
                <th className="px-4 py-3">Bitiş</th>
                <th className="px-4 py-3">Diploma Durumu</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="bg-white border-t">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 max-w-[100px] truncate"
                    title={r.seviye}
                  >
                    {r.seviye}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={r.okul}
                  >
                    {r.okul}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={r.bolum}
                  >
                    {r.bolum}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={notSistemaText(r.notSistemi)}
                  >
                    {notSistemaText(r.notSistemi)}
                  </td>
                  <td className="px-4 py-3 text-gray-800 max-w-[100px] truncate">
                    {r.gano !== null && r.gano !== undefined
                      ? Number(r.gano).toFixed(2)
                      : "-"}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={formatDate(r.baslangic)}
                  >
                    {formatDate(r.baslangic)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={formatDate(r.bitis)}
                  >
                    {formatDate(r.bitis)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[180px] truncate"
                    title={r.diplomaDurum}
                  >
                    {r.diplomaDurum}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Düzenle"
                        onClick={() => openEdit(r)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        aria-label="Sil"
                        onClick={() => handleDelete(r)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (controlled) */}
      <EducationAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

// eslint-disable-next-line react-refresh/only-export-components
export function staticEducationDB() {
  const rows = [
    /* örnek başlangıç verisi eklemek istersen burayı aç */
  ];
  return rows;
}

export default EducationTable;
