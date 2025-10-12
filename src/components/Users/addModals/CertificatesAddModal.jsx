// components/Users/addModals/CetificatesAddModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";

export default function CertificatesAddModal({
  open,
  mode = "create",
  initialData = null, // { id, ad, kurum, sure, verilisTarihi, gecerlilikTarihi }
  onClose,
  onSave, // (payload) => void
  onUpdate, // (payload) => void
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    ad: "",
    kurum: "",
    sure: "",
    verilisTarihi: null,
    gecerlilikTarihi: null,
  });

  // Modal her açıldığında formu doldur/temizle
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        ad: initialData.ad ?? "",
        kurum: initialData.kurum ?? "",
        sure: initialData.sure ?? "",
        verilisTarihi: toDateSafe(initialData.verilisTarihi),
        gecerlilikTarihi: toDateSafe(initialData.gecerlilikTarihi),
      });
    } else {
      setFormData({
        ad: "",
        kurum: "",
        sure: "",
        verilisTarihi: null,
        gecerlilikTarihi: null,
      });
    }
  }, [open, mode, initialData]);

  //modal kapatma
  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0); // yerel 00:00
  }, []);
  const todayISO = toISODate(today);

  // Validasyon
  const errors = useMemo(() => {
    const e = {};
    if (!formData.ad.trim()) e.ad = "Sertifika / Eğitim adı zorunlu.";
    if (!formData.kurum.trim()) e.kurum = "Kurum / Organizasyon adı zorunlu.";
    if (!formData.sure.trim()) e.sure = "Süre zorunlu.";
    if (!formData.verilisTarihi) e.verilisTarihi = "Veriliş tarihi zorunlu.";

    //  Veriliş ileri tarih olamaz
    if (
      formData.verilisTarihi &&
      formData.verilisTarihi.getTime() > today.getTime()
    ) {
      e.verilisTarihi = "Veriliş tarihi bugünden ileri olamaz.";
    }

    if (formData.verilisTarihi && formData.gecerlilikTarihi) {
      if (
        formData.gecerlilikTarihi.getTime() < formData.verilisTarihi.getTime()
      ) {
        e.gecerlilikTarihi = "Geçerlilik tarihi verilişten önce olamaz.";
      }
    }
    return e;
  }, [
    formData.ad,
    formData.gecerlilikTarihi,
    formData.kurum,
    formData.sure,
    formData.verilisTarihi,
    today,
  ]);

  const isValid = Object.keys(errors).length === 0;
  const disabledTip = !isValid ? Object.values(errors).join(" • ") : "";

  //Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const payload = {
      ...formData,
      verilisTarihi: toISODate(formData.verilisTarihi),
      gecerlilikTarihi: formData.gecerlilikTarihi
        ? toISODate(formData.gecerlilikTarihi)
        : null,
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
              ? "Sertifika ve Eğitim Bilgisi Düzenle"
              : "Sertifika ve Eğitim Bilgisi Ekle"}
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
            {/*1 sertifika /eğitim adı - kurum / organizasyon */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sertifika / Eğitim Adı
                </label>
                <input
                  type="text"
                  value={formData.ad}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, ad: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Dil, Kurs"
                  required
                />
                {errors.ad && (
                  <p className="mt-1 text-xs text-red-600">{errors.ad}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Kurum / Organizasyon
                </label>
                <input
                  type="text"
                  value={formData.kurum}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, kurum: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: BTK Akademi, Udemy, Course"
                  required
                />
                {errors.kurum && (
                  <p className="mt-1 text-xs text-red-600">{errors.kurum}</p>
                )}
              </div>
            </div>
            {/*2 Eğitim Süresi - Veriliş Tarihi*/}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Süresi
                </label>
                <input
                  type="text"
                  value={formData.sure}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, sure: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: 13 Gün, 3 Ay"
                  required
                />
                {errors.sure && (
                  <p className="mt-1 text-xs text-red-600">{errors.sure}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Veriliş Tarihi
                </label>
                <input
                  type="date"
                  value={toISODate(formData.verilisTarihi)}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      verilisTarihi: toDateSafe(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                  max={todayISO}
                />
                {errors.verilisTarihi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.verilisTarihi}
                  </p>
                )}
              </div>
            </div>
            {/*3 Geçerlilik Tarihi*/}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Geçerlilik Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={toISODate(formData.gecerlilikTarihi)}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      gecerlilikTarihi: toDateSafe(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                {errors.gecerlilikTarihi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.gecerlilikTarihi}
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
