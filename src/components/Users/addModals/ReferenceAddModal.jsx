// components/Users/addModals/ReferenceAddModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";

export default function ReferenceAddModal({
  open,
  mode = "create",
  initialData = null, // { id, calistigiKurum, referansAdi, referansSoyadi, referansIsYeri, referansGorevi, referansTelefon }
  onClose,
  onSave,
  onUpdate,
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    calistigiKurum: "",
    referansAdi: "",
    referansSoyadi: "",
    referansIsYeri: "",
    referansGorevi: "",
    referansTelefon: "",
  });

  // Modal açıldığında formu doldur / temizle
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        calistigiKurum: initialData.calistigiKurum ?? "",
        referansAdi: initialData.referansAdi ?? "",
        referansSoyadi: initialData.referansSoyadi ?? "",
        referansIsYeri: initialData.referansIsYeri ?? "",
        referansGorevi: initialData.referansGorevi ?? "",
        referansTelefon: initialData.referansTelefon ?? "",
      });
    } else {
      setFormData({
        calistigiKurum: "",
        referansAdi: "",
        referansSoyadi: "",
        referansIsYeri: "",
        referansGorevi: "",
        referansTelefon: "",
      });
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  // Validasyon
  const errors = useMemo(() => {
    const e = {};
    if (!formData.calistigiKurum.trim())
      e.calistigiKurum = "Çalıştığı kurum seçimi zorunlu.";
    if (!formData.referansAdi.trim()) e.referansAdi = "Ad zorunlu.";
    if (!formData.referansSoyadi.trim()) e.referansSoyadi = "Soyad zorunlu.";
    if (!formData.referansIsYeri.trim()) e.referansIsYeri = "İşyeri zorunlu.";
    if (!formData.referansGorevi.trim()) e.referansGorevi = "Görev zorunlu.";
    if (!formData.referansTelefon.trim())
      e.referansTelefon = "Telefon zorunlu.";
    return e;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;
  const disabledTip = !isValid ? Object.values(errors).join(" • ") : "";

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const payload = { ...formData };
    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    onClose?.();
  };

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
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-6 py-4">
          <h2 className="text-lg font-semibold truncate">
            {mode === "edit"
              ? "Referans Bilgisi Düzenle"
              : "Referans Bilgisi Ekle"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Çalıştığı Kurum */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Çalıştığı Kurum
                </label>
                <select
                  value={formData.calistigiKurum}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      calistigiKurum: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Bünyemizde / Grubumuzda">
                    Bünyemizde / Grubumuzda
                  </option>
                  <option value="Harici">Harici</option>
                </select>
                {errors.calistigiKurum && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.calistigiKurum}
                  </p>
                )}
              </div>

              {/* Referans Adı */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Adı</label>
                <input
                  type="text"
                  value={formData.referansAdi}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      referansAdi: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Mehmet"
                  required
                />
                {errors.referansAdi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referansAdi}
                  </p>
                )}
              </div>

              {/* Referans Soyadı */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Soyadı
                </label>
                <input
                  type="text"
                  value={formData.referansSoyadi}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      referansSoyadi: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Yalçınkaya"
                  required
                />
                {errors.referansSoyadi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referansSoyadi}
                  </p>
                )}
              </div>

              {/* İşyeri */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  İşyeri
                </label>
                <input
                  type="text"
                  value={formData.referansIsYeri}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      referansIsYeri: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Chamada Girne"
                  required
                />
                {errors.referansIsYeri && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referansIsYeri}
                  </p>
                )}
              </div>

              {/* Görev */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Görevi
                </label>
                <input
                  type="text"
                  value={formData.referansGorevi}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      referansGorevi: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: IT Uzmanı"
                  required
                />
                {errors.referansGorevi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referansGorevi}
                  </p>
                )}
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.referansTelefon}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      referansTelefon: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="+90..."
                  required
                />
                {errors.referansTelefon && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referansTelefon}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sabit alt aksiyon bar */}
          <div className="border-t bg-white px-6 py-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
            >
              İptal
            </button>

            {mode === "create" ? (
              <button
                type="submit"
                disabled={!isValid}
                title={disabledTip}
                className={`px-4 py-2 rounded-lg text-white transition ${
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
                className={`px-4 py-2 rounded-lg text-white transition ${
                  isValid
                    ? "bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 cursor-pointer"
                    : "bg-green-300 opacity-90 cursor-not-allowed"
                }`}
              >
                Güncelle
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
