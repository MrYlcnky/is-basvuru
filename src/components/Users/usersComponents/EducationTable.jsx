import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EducationAddModal from "../addModals/EducationAddModal";
import { formatDate } from "../modalHooks/dateUtils";
import useCrudTable from "../modalHooks/useCrudTable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const EducationTable = forwardRef(function EducationTable(
  { onValidChange },
  ref
) {
  const { t } = useTranslation();
  const notSistemaText = (val) =>
    val === "100"
      ? t("education.gradeSystem.hundred")
      : val === "4"
      ? t("education.gradeSystem.four")
      : String(val ?? t("common.dash"));

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("education.delete.title"),
      text: t("education.delete.text", { school: row.okul, dept: row.bolum }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("actions.delete"),
    });
    return res.isConfirmed;
  };
  const notify = (msg) => toast.success(msg || t("toast.deleted"));

  const {
    rows,
    setRows,
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

  useEffect(() => {
    onValidChange?.(rows.length > 0);
  }, [rows, onValidChange]);

  useImperativeHandle(ref, () => ({
    openCreate,
    getData: () => rows,
    hasAnyRow: () => rows.length > 0,
    fillData: (data) => {
      if (Array.isArray(data)) {
        setRows(data);
      }
    },
  }));

  return (
    <div>
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("education.table.level")}</th>
                <th className="px-4 py-3">{t("education.table.school")}</th>
                <th className="px-4 py-3">{t("education.table.department")}</th>
                <th className="px-4 py-3">
                  {t("education.table.gradeSystem")}
                </th>
                <th className="px-4 py-3">{t("education.table.gpa")}</th>
                <th className="px-4 py-3">{t("education.table.start")}</th>
                <th className="px-4 py-3">{t("education.table.end")}</th>
                <th className="px-4 py-3">
                  {t("education.table.diplomaStatus")}
                </th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("education.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="bg-white border-t">
                  <td className="px-4 py-3 truncate" title={r.seviye}>
                    {r.seviye}
                  </td>
                  <td className="px-4 py-3 truncate" title={r.okul}>
                    {r.okul}
                  </td>
                  <td className="px-4 py-3 truncate" title={r.bolum}>
                    {r.bolum}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {notSistemaText(r.notSistemi)}
                  </td>
                  <td className="px-4 py-3 truncate">{r.gano}</td>
                  <td className="px-4 py-3 truncate">
                    {formatDate(r.baslangic)}
                  </td>
                  <td className="px-4 py-3 truncate">{formatDate(r.bitis)}</td>
                  <td className="px-4 py-3 truncate">{r.diplomaDurum}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

function staticEducationDB() {
  return [];
}
export default EducationTable;
