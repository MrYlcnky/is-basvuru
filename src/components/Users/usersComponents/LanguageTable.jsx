import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle } from "react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAddModal from "../addModals/LanguageAddModal";
import useCrudTable from "../modalHooks/useCrudTable";

const LanguageTable = forwardRef(function LanguageTable(_, ref) {
  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Emin misin?",
      text: `“${row.dil} ” kaydını silmek istiyor musun?`,
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
  } = useCrudTable(staticLanguageTableDB, { confirmDelete, notify });
  useImperativeHandle(ref, () => ({ openCreate }));

  return (
    <div className="">
      {/* Tablo */}
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Dil</th>
                <th className="px-4 py-3">Konuşma Seviyesi</th>
                <th className="px-4 py-3">Dinleme Seviyesi</th>
                <th className="px-4 py-3">Okuma Seviyesi</th>
                <th className="px-4 py-3">Yazma Seviyesi</th>
                <th className="px-4 py-3">Nasıl Öğrenildi</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="bg-white border-t table-fixed">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 max-w-[100px] truncate"
                    title={item.dil}
                  >
                    {item.dil}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={item.konusma}
                  >
                    {item.konusma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={item.yazma}
                  >
                    {item.yazma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={item.dinleme}
                  >
                    {item.dinleme}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={item.okuma}
                  >
                    {item.okuma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={item.ogrenilenKurum}
                  >
                    {item.ogrenilenKurum}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Düzenle"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        aria-label="Sil"
                        onClick={() => handleDelete(item)}
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
      {/* Modal (controlled)*/}
      <LanguageAddModal
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
export function staticLanguageTableDB() {
  const rows = [
    /* {
      id: 1,
      dil: "İngilizce ",
      konusma: "A1",
      yazma: "B2",
      okuma: "B2",
      dinleme: "B1",
      ogrenilenKurum: "Udemy",
    },
    {
      id: 2,
      dil: "Almanca ",
      konusma: "A1",
      yazma: "B2",
      okuma: "B2",
      dinleme: "B1",
      ogrenilenKurum: "Udemy",
    },
    {
      id: 3,
      dil: "Türkçe ",
      konusma: "A1",
      yazma: "B2",
      okuma: "B2",
      dinleme: "B1",
      ogrenilenKurum: "Udemy",
    },*/
  ];
  return rows;
}

export default LanguageTable;
