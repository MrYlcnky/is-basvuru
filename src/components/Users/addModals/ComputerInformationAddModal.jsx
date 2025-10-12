// components/Users/addModals/ComputerInformationAddModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";

export default function ComputerInformationAddModal({
  open,
  mode = "create",
  initialData = null, // { id, programAdi, yetkinlik }
  onClose,
  onSave, // (payload) => void
  onUpdate, // (payload) => void
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    programAdi: "",
    yetkinlik: "",
  });

  // Modal her açıldığında formu doldur/temizle
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        programAdi: initialData.programAdi ?? "",
        yetkinlik: initialData.yetkinlik ?? "",
      });
    } else {
      setFormData({
        programAdi: "",
        yetkinlik: "",
      });
    }
  }, [open, mode, initialData]);
  //modal kapatma
  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);
  // Validasyon
  const errors = useMemo(() => {
    const e = {};
    if (!formData.programAdi.trim()) e.programAdi = "Program adı zorunlu.";
    if (!formData.yetkinlik) e.yetkinlik = "Yetkinlik zorunlu.";
    return e;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;
  const disabledTip = !isValid ? Object.values(errors).join(" • ") : "";

  //Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const payload = {
      ...formData,
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    onClose?.();
  };

  // Modal Açık Değilse Render Etme
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit"
              ? "Bilgisayar Bilgisi Düzenle"
              : "Bilgisayar Bilgisi Ekle"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form (flex column; içerik scroll, alt bar sabit) */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Scroll olan içerik */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/*1 Program Adı - Yetkinlik */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Program Adı
                </label>
                <input
                  type="text"
                  value={formData.programAdi}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, programAdi: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Excel Programları, Photoshop"
                  required
                />
                {errors.programAdi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.programAdi}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Yetkinlik
                </label>
                <select
                  name="Yetkinlik"
                  value={formData.yetkinlik}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, yetkinlik: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Çok Zayıf">Çok Zayıf</option>
                  <option value="Zayıf">Zayıf</option>
                  <option value="Orta">Orta</option>
                  <option value="İyi">İyi</option>
                  <option value="Çok İyi">Çok İyi</option>
                </select>
                {errors.yetkinlik && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.yetkinlik}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sabit alt aksiyon bar */}
          <div className="border-t bg-white px-6 py-3">
            {" "}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
              >
                İptal
              </button>

              {mode === "create" ? (
                <button
                  type="submit"
                  disabled={!isValid}
                  title={disabledTip}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                    isValid
                      ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 cursor-pointer"
                      : "bg-blue-300 opacity-90 cursor-not-allowed"
                  }`}
                >
                  Kaydet
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid}
                  title={disabledTip}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                    isValid
                      ? "bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 cursor-pointer"
                      : "bg-green-300 opacity-90 cursor-not-allowed"
                  }`}
                >
                  Güncelle
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
