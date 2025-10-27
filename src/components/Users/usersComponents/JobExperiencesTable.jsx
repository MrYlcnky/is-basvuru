// components/Users/usersComponents/JobExperiencesTable.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle } from "react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useCrudTable from "../modalHooks/useCrudTable";
import JobExperiencesAddModal from "../addModals/JobExperiencesAddModal";

const JobExperiencesTable = forwardRef(function JobExperiencesTable(_, ref) {
  // Silme onayı
  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: "Emin misin?",
      text: `“${row.isAdi} – ${row.pozisyon}” kaydını silmek istiyor musun?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "İptal",
      confirmButtonText: "Evet, sil!",
    });
    return res.isConfirmed;
  };

  // bildirim
  const notify = (msg) => toast.success(msg);

  // CRUD hook
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
  } = useCrudTable(staticJobExperiencesTableDB, { confirmDelete, notify });

  // parent'tan butonla modal açmak için
  useImperativeHandle(ref, () => ({ openCreate }));

  // tabloda başka aktif iş var mı? (bitisTarihi boş/null veya explicit halenCalisiyor:true)
  const anyActive = rows.some(
    (r) => r?.halenCalisiyor === true || !r?.bitisTarihi
  );
  const editingRowIsActive =
    selectedRow &&
    (selectedRow?.halenCalisiyor === true || !selectedRow?.bitisTarihi);

  // create modunda: başka aktif varsa aktif yeni kayıt olmasın
  // edit modunda: başka aktif varken bu kaydı aktif yapma (sadece kendi aktifliğini koruyabilir)
  const anotherActiveExists =
    modalOpen && modalMode
      ? modalMode === "create"
        ? anyActive
        : anyActive && !editingRowIsActive
      : false;

  return (
    <div className="space-y-3">
      {/* Tablo */}
      <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 ">Şirket / İş Adı</th>
              <th className="px-4 py-3 ">Departman</th>
              <th className="px-4 py-3 ">Pozisyon</th>
              <th className="px-4 py-3 ">Görev</th>
              <th className="px-4 py-3 ">Ücret</th>
              <th className="px-4 py-3 ">Başlangıç</th>
              <th className="px-4 py-3 ">Bitiş</th>
              <th className="px-4 py-3 ">Ayrılış Sebebi</th>
              <th className="px-4 py-3 ">Ülke</th>
              <th className="px-4 py-3 ">Şehir</th>
              <th className="px-4 py-3 text-right ">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="bg-white border-t">
                <td
                  className="px-4 py-3 font-medium text-gray-900 max-w-[150px] truncate"
                  title={item.isAdi}
                >
                  {item.isAdi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.departman}
                >
                  {item.departman}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[150px] truncate"
                  title={item.pozisyon}
                >
                  {item.pozisyon}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                  title={item.gorev}
                >
                  {item.gorev}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.ucret}
                >
                  {item.ucret}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.baslangicTarihi}
                >
                  {item.baslangicTarihi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={
                    item.bitisTarihi || (item.halenCalisiyor ? "Devam" : "")
                  }
                >
                  {item.halenCalisiyor ? "Devam" : item.bitisTarihi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.ayrilisSebebi}
                >
                  {item.ayrilisSebebi}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.isUlke}
                >
                  {item.isUlke}
                </td>
                <td
                  className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                  title={item.isSehir}
                >
                  {item.isSehir}
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
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (controlled) */}
      <JobExperiencesAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
        anotherActiveExists={anotherActiveExists}
      />
    </div>
  );
});

// eslint-disable-next-line react-refresh/only-export-components
export function staticJobExperiencesTableDB() {
  const rows = [
    /* {
      id: 1,
      isAdi:
        "Şahin Bilgisayar Yazılım A.Ş. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaa",
      departman: "Yazılım",
      pozisyon: "Junior Full Stack Developer",
      gorev: "Web geliştiricisi",
      ucret: "2500",
      baslangicTarihi: "2023-10-19",
      bitisTarihi: "2024-02-07",
      ayrilisSebebi: "Ders Yoğunluğu",
      isUlke: "Turkey",
      isSehir: "Kayseri",
    },
    {
      id: 2,
      isAdi: "Şahin Bilgisayar Yazılım A.Ş.",
      departman: "Yazılım",
      pozisyon: "Junior Full Stack Developer",
      gorev: "Web geliştiricisi",
      ucret: "2500",
      baslangicTarihi: "2023-10-19",
      bitisTarihi: "2024-02-07",
      ayrilisSebebi: "Ders Yoğunluğu",
      isUlke: "Turkey",
      isSehir: "Kayseri",
    },
    {
      id: 3,
      isAdi: "Şahin Bilgisayar Yazılım A.Ş.",
      departman: "Yazılım",
      pozisyon: "Junior Full Stack Developer",
      gorev: "Web geliştiricisi",
      ucret: "2500",
      baslangicTarihi: "2023-10-19",
      bitisTarihi: "2024-02-07",
      ayrilisSebebi: "Ders Yoğunluğu",
      isUlke: "Turkey",
      isSehir: "Kayseri",
    },*/
  ];
  return rows;
}

export default JobExperiencesTable;
