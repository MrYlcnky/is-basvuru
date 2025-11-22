import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

import ComputerInformationAddModal from "../addModals/ComputerInformationAddModal";
import useCrudTable from "../modalHooks/useCrudTable";

const ComputerInformationTable = forwardRef(function ComputerInformationTable(
  { onValidChange },
  ref
) {
  const { t } = useTranslation();

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("computer.delete.title"),
      text: t("computer.delete.text", { name: row.programAdi }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("actions.delete"),
    });
    return res.isConfirmed;
  };

  const notify = (msg) => toast.success(msg || t("toast.saved"));

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
  } = useCrudTable(staticComputerInformationDB, { confirmDelete, notify });

  useEffect(() => {
    onValidChange?.(rows.length > 0);
  }, [rows, onValidChange]);

  useImperativeHandle(ref, () => ({
    openCreate,
    getData: () => rows,
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
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("computer.table.program")}</th>
                <th className="px-4 py-3">{t("computer.table.level")}</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("computer.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="bg-white border-t table-fixed">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 max-w-[140px] truncate"
                    title={item.programAdi}
                  >
                    {item.programAdi}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.yetkinlik}
                  >
                    {item.yetkinlik}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={t("actions.update")}
                        title={t("actions.update")}
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        aria-label={t("actions.delete")}
                        title={t("actions.delete")}
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

      <ComputerInformationAddModal
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

function staticComputerInformationDB() {
  const rows = [];
  return rows;
}

export default ComputerInformationTable;
