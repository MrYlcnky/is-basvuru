// components/Users/usersComponents/LanguageTable.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAddModal from "../addModals/LanguageAddModal";
import useCrudTable from "../modalHooks/useCrudTable";

const LanguageTable = forwardRef(function LanguageTable(_, ref) {
  const { t } = useTranslation();

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("languages.delete.title"),
      text: t("languages.delete.text", { language: (row.dil || "").trim() }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("common.deleteYes"),
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
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("languages.table.language")}</th>
                <th className="px-4 py-3">{t("languages.table.speaking")}</th>
                <th className="px-4 py-3">{t("languages.table.listening")}</th>
                <th className="px-4 py-3">{t("languages.table.reading")}</th>
                <th className="px-4 py-3">{t("languages.table.writing")}</th>
                <th className="px-4 py-3">{t("languages.table.learnedHow")}</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("languages.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="bg-white border-t">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 max-w-[120px] truncate"
                    title={(item.dil || "").trim()}
                  >
                    {(item.dil || "").trim()}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.konusma}
                  >
                    {item.konusma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.dinleme}
                  >
                    {item.dinleme}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.okuma}
                  >
                    {item.okuma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.yazma}
                  >
                    {item.yazma}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[200px] truncate"
                    title={item.ogrenilenKurum}
                  >
                    {item.ogrenilenKurum}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={t("actions.update")}
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        aria-label={t("actions.delete")}
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

      {/* Modal (controlled) */}
      <LanguageAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={closeModal}
        onSave={(payload) => {
          handleSave(payload);
          toast.success(t("toast.saved"));
        }}
        onUpdate={(payload) => {
          handleUpdate(payload);
          toast.success(t("toast.updated"));
        }}
      />
    </div>
  );
});

// eslint-disable-next-line react-refresh/only-export-components
export function staticLanguageTableDB() {
  const rows = [
    /* örnek:
    {
      id: 1,
      dil: "English",
      konusma: "B2",
      dinleme: "B2",
      okuma: "C1",
      yazma: "B2",
      ogrenilenKurum: "Udemy",
    }
    */
  ];
  return rows;
}

export default LanguageTable;
