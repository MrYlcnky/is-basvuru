import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useCrudTable from "../modalHooks/useCrudTable";
import JobExperiencesAddModal from "../addModals/JobExperiencesAddModal";
import { formatDate } from "../modalHooks/dateUtils";

const formatMoney = (val) => {
  if (val == null || val === "") return "-";
  const n = Number(String(val).replace(",", "."));
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const JobExperiencesTable = forwardRef(function JobExperiencesTable(
  { onValidChange },
  ref
) {
  const { t } = useTranslation();

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("jobExp.confirm.title"),
      text: t("jobExp.confirm.text", {
        company: row.isAdi,
        role: row.pozisyon,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("common.cancel"),
      confirmButtonText: t("common.deleteYes"),
    });
    return res.isConfirmed;
  };

  const notify = (msg) => toast.success(msg);

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
  } = useCrudTable(staticJobExperiencesTableDB, { confirmDelete, notify });

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

  const anyActive = rows.some(
    (r) => r?.halenCalisiyor === true || !r?.bitisTarihi
  );
  const editingRowIsActive =
    selectedRow &&
    (selectedRow?.halenCalisiyor === true || !selectedRow?.bitisTarihi);

  const anotherActiveExists =
    modalOpen && modalMode
      ? modalMode === "create"
        ? anyActive
        : anyActive && !editingRowIsActive
      : false;

  return (
    <div className="">
      {/* Tablo */}
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 ">{t("jobExp.cols.company")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.department")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.position")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.duty")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.salary")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.start")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.end")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.leaveReason")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.country")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.city")}</th>
                <th className="px-4 py-3 text-right ">{t("common.actions")}</th>
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
                    title={formatMoney(item.ucret)}
                  >
                    {formatMoney(item.ucret)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={formatDate(item.baslangicTarihi)}
                  >
                    {formatDate(item.baslangicTarihi)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[100px] truncate"
                    title={
                      item.halenCalisiyor
                        ? t("jobExp.badges.ongoing")
                        : formatDate(item.bitisTarihi) || ""
                    }
                  >
                    {item.halenCalisiyor
                      ? t("jobExp.badges.ongoing")
                      : formatDate(item.bitisTarihi)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                    title={item.ayrilisSebebi}
                  >
                    {item.ayrilisSebebi || "-"}
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
                        aria-label={t("common.edit")}
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        aria-label={t("common.delete")}
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

function staticJobExperiencesTableDB() {
  const rows = [];
  return rows;
}

export default JobExperiencesTable;
