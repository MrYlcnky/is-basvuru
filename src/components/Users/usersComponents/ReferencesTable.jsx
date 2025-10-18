import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle } from "react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReferenceAddModal from "../addModals/ReferenceAddModal";
import useCrudTable from "../modalHooks/useCrudTable";

const ReferencesTable = forwardRef(function ReferencesTable(_, ref) {
  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Emin misin?",
      text: `“${row.referansAdi} - ${row.referansSoyadi}” kaydını silmek istiyor musun?`,
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
  } = useCrudTable(staticReferencesDB, { confirmDelete, notify });
  useImperativeHandle(ref, () => ({ openCreate }));

  return (
    <div className="space-y-3">
      {/* Tablo */}
      <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Çalıştığı Kurum</th>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Soyad</th>
              <th className="px-4 py-3">İşyeri</th>
              <th className="px-4 py-3">Görev</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="bg-white border-t table-fixed">
                <td
                  className="px-4 py-3 font-medium text-gray-800 max-w-[130px] truncate"
                  title={item.calistigiKurum}
                >
                  {item.calistigiKurum}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.referansAdi}
                >
                  {item.referansAdi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.referansSoyadi}
                >
                  {item.referansSoyadi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                  title={item.referansIsYeri}
                >
                  {item.referansIsYeri}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                  title={item.referansGorevi}
                >
                  {item.referansGorevi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[140px] truncate"
                  title={item.referansTelefon}
                >
                  {item.referansTelefon}
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

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Referans bilgisi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (controlled) */}
      <ReferenceAddModal
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
export function staticReferencesDB() {
  const rows = [
    {
      id: 1,
      calistigiKurum: "Bünyemizde / Grubumuzda",
      referansAdi: "Mehmet",
      referansSoyadi: "Yalçınkaya",
      referansIsYeri: "Chamada Girne",
      referansGorevi: "IT",
      referansTelefon: "+905488583819",
    },
    {
      id: 2,
      calistigiKurum: "Harici",
      referansAdi: "Mehmet",
      referansSoyadi: "Yalçınkaya",
      referansIsYeri: "Yalçınkaya A.Ş",
      referansGorevi: "Yazılım Geliştirici",
      referansTelefon: "+905488583819",
    },
    {
      id: 3,
      calistigiKurum: "Harici",
      referansAdi: "Mehmet",
      referansSoyadi: "Yalçınkaya",
      referansIsYeri: "Yalçınkaya A.Ş",
      referansGorevi: "Yazılım Geliştirici",
      referansTelefon: "+905488583819",
    },
  ];
  return rows;
}

export default ReferencesTable;
