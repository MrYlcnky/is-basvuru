// components/Users/addModals/ComputerInformationAddModal.jsx
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { z } from "zod";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";

// Zod şeması
const schema = z.object({
  programAdi: z
    .string()
    .trim()
    .min(1, "Program adı zorunlu.")
    .max(60, "Program adı en fazla 60 karakter olabilir."),
  yetkinlik: z.string().min(1, "Yetkinlik zorunlu."),
});

// Ortak alan stilleri (hover: siyah, focus: siyah)
const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black focus:border-black";

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

  const [errors, setErrors] = useState({}); // { programAdi?: string, yetkinlik?: string }

  /* ---------- SCROLL LOCK ---------- */
  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [open]);

  // onClose'u unlock ile saran tek kapatma fonksiyonu
  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  // Modal her açıldığında formu doldur/temizle
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        programAdi: initialData.programAdi ?? "",
        yetkinlik: initialData.yetkinlik ?? "",
      });
      setErrors({});
    } else {
      setFormData({ programAdi: "", yetkinlik: "" });
      setErrors({});
    }
  }, [open, mode, initialData]);

  // Dış alan tıklamasıyla kapatma
  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  // Tek alan anlık doğrulama
  const validateField = (name, value) => {
    const candidate = { ...formData, [name]: value };
    const result = schema.safeParse(candidate);

    if (!result.success) {
      const fieldIssue = result.error.issues.find((i) => i.path[0] === name);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldIssue ? fieldIssue.message : "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form genel geçerliliği
  const isValid = schema.safeParse(formData).success;
  const disabledTip = !isValid
    ? (() => {
        const r = schema.safeParse(formData);
        if (!r.success) return r.error.issues.map((i) => i.message).join(" • ");
        return "";
      })()
    : "";

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      // Tüm hataları state'e yaz
      const next = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0];
        if (key) next[key] = i.message;
      });
      setErrors(next);
      return;
    }

    const payload = parsed.data; // trim uygulanmış halde
    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    handleClose(); // kapatırken scroll’u geri getir
  };

  // Modal Açık Değilse Render Etme
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  p-4"
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
            onClick={handleClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Scroll olan içerik */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Program Adı - Yetkinlik */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Program Adı
                </label>
                <input
                  type="text"
                  value={formData.programAdi}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((p) => ({ ...p, programAdi: v }));
                    validateField("programAdi", v);
                  }}
                  className={FIELD_BASE}
                  placeholder="Örn: Excel Programları, Photoshop"
                  maxLength={60}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.programAdi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.programAdi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.programAdi.length >= 54
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.programAdi.length}/60
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Yetkinlik
                </label>
                <select
                  value={formData.yetkinlik}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((p) => ({ ...p, yetkinlik: v }));
                    validateField("yetkinlik", v);
                  }}
                  className={`${FIELD_BASE} h-[42px]`}
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
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
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
