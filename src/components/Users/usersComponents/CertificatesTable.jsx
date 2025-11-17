// components/Users/usersComponents/CertificatesTable.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle } from "react";
import CertificatesAddModal from "../addModals/CertificatesAddModal";
import { formatDate } from "../modalHooks/dateUtils";
import useCrudTable from "../modalHooks/useCrudTable";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CertificateTable = forwardRef(function CertificateTable(_, ref) {
  const { t } = useTranslation();

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("certificates.delete.title"),
      text: t("certificates.delete.text", {
        name: row.ad,
        org: row.kurum,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("actions.delete"),
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
  } = useCrudTable(staticCertificatesDB, {
    confirmDelete,
    notify: (m) => notify(m || t("toast.saved")),
  });

  useImperativeHandle(ref, () => ({ openCreate }));

  const dash = t("common.dash");

  return (
    <div>
      {/* Tablo */}
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("certificates.table.name")}</th>
                <th className="px-4 py-3">{t("certificates.table.org")}</th>
                <th className="px-4 py-3">
                  {t("certificates.table.duration")}
                </th>
                <th className="px-4 py-3">
                  {t("certificates.table.issuedAt")}
                </th>
                <th className="px-4 py-3">
                  {t("certificates.table.validUntil")}
                </th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("certificates.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const issued = formatDate(item.verilisTarihi);
                const valid = formatDate(item.gecerlilikTarihi) || dash;

                return (
                  <tr key={item.id} className="bg-white border-t table-fixed">
                    <td
                      className="px-4 py-3 font-medium text-gray-800 max-w-[140px] truncate"
                      title={item.ad}
                    >
                      {item.ad}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-[140px] truncate"
                      title={item.kurum}
                    >
                      {item.kurum}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                      title={item.sure}
                    >
                      {item.sure}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                      title={issued || dash}
                    >
                      {issued || dash}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-[120px] truncate"
                      title={valid}
                    >
                      {valid}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (controlled) */}
      <CertificatesAddModal
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
export function staticCertificatesDB() {
  const rows = [
    // örnek satırları açık bırakabilirsin
  ];
  return rows;
}

export default CertificateTable;
