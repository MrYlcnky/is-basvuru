// components/Users/addModals/EducationAddModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";

export default function EducationAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    seviye: "",
    okul: "",
    bolum: "",
    notSistemi: "4",
    gano: "",
    baslangic: null, // Date
    bitis: null, // Date
    diplomaDurum: "",
  });

  // "bugün" (max) sınırı — başlangıç ve bitiş bugünü aşamaz
  const today = useMemo(() => {
    const t = new Date();
    // sadece tarih kısmı
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
  }, []);
  const todayISO = toISODate(today);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setFormData({
        seviye: initialData.seviye ?? "",
        okul: initialData.okul ?? "",
        bolum: initialData.bolum ?? "",
        notSistemi: initialData.notSistemi ?? "4",
        gano:
          initialData.gano === null || initialData.gano === undefined
            ? ""
            : String(initialData.gano),
        // gelen değer string "YYYY-MM-DD" olabilir; Date'e çevir
        baslangic: toDateSafe(initialData.baslangic),
        bitis: toDateSafe(initialData.bitis),
        diplomaDurum: initialData.diplomaDurum ?? "",
      });
    } else {
      setFormData({
        seviye: "",
        okul: "",
        bolum: "",
        notSistemi: "4",
        gano: "",
        baslangic: null,
        bitis: null,
        diplomaDurum: "",
      });
    }
  }, [open, mode, initialData]);

  //modal kapatma
  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  const ganoMax = useMemo(
    () => (formData.notSistemi === "100" ? 100 : 4),
    [formData.notSistemi]
  );
  const ganoStep = "0.01";

  const handleBasicChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const errors = useMemo(() => {
    const e = {};
    if (!formData.seviye) e.seviye = "Seviye zorunlu.";
    if (!formData.okul.trim()) e.okul = "Okul adı zorunlu.";
    if (!formData.bolum.trim()) e.bolum = "Bölüm zorunlu.";
    if (!formData.diplomaDurum) e.diplomaDurum = "Diploma durumu zorunlu.";
    if (!formData.baslangic) e.baslangic = "Başlangıç tarihi zorunlu.";
    if (!formData.bitis) e.bitis = "Bitiş tarihi zorunlu.";

    if (formData.baslangic && formData.bitis) {
      if (formData.bitis.getTime() < formData.baslangic.getTime()) {
        e.bitis = "Bitiş, başlangıçtan önce olamaz.";
      }
    }

    // Tarihler bugün'ü aşamaz
    if (formData.baslangic && formData.baslangic.getTime() > today.getTime()) {
      e.baslangic = "Başlangıç tarihi bugünden ileri olamaz.";
    }
    if (formData.bitis && formData.bitis.getTime() > today.getTime()) {
      e.bitis = "Bitiş tarihi bugünden ileri olamaz.";
    }

    if (formData.gano !== "") {
      const n = Number(formData.gano);
      if (Number.isNaN(n) || n < 0 || n > ganoMax) {
        e.gano = `GANO 0 ile ${ganoMax} arasında olmalı.`;
      }
      if (formData.notSistemi === "4" && !e.gano) {
        const decimals = String(formData.gano).split(".")[1];
        if (decimals && decimals.length > 2) {
          e.gano = "4'lük sistemde en fazla 2 ondalık basamak giriniz.";
        }
      }
    }
    return e;
  }, [formData, ganoMax, today]);

  const isValid = Object.keys(errors).length === 0;
  const disabledTip = !isValid ? Object.values(errors).join(" • ") : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    let ganoValue = formData.gano === "" ? null : Number(formData.gano);
    if (ganoValue !== null && !isNaN(ganoValue)) {
      ganoValue = Number(ganoValue.toFixed(2));
    }

    const payload = { ...formData, gano: ganoValue };
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
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit" ? "Eğitim Bilgisi Düzenle" : "Eğitim Bilgisi Ekle"}
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
            {/* Seviye & Okul */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Seviye *
                </label>
                <select
                  name="seviye"
                  value={formData.seviye}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Lise">Lise</option>
                  <option value="Ön Lisans">Ön Lisans</option>
                  <option value="Lisans">Lisans</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Okul Adı *
                </label>
                <input
                  type="text"
                  name="okul"
                  value={formData.okul}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Erciyes Üniversitesi"
                  required
                />
              </div>
            </div>

            {/* Bölüm & Durum */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Bölüm *
                </label>
                <input
                  type="text"
                  name="bolum"
                  value={formData.bolum}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Diploma Durumu *
                </label>
                <select
                  name="diplomaDurum"
                  value={formData.diplomaDurum}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Mezun">Mezun</option>
                  <option value="Devam">Devam Ediyor</option>
                  <option value="Ara Verdi">Ara Verdi</option>
                  <option value="Terk">Terk</option>
                </select>
              </div>
            </div>

            {/* Not & GANO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Not Sistemi *
                </label>
                <select
                  name="notSistemi"
                  value={formData.notSistemi}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="4">4'lük</option>
                  <option value="100">100'lük</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">GANO</label>
                <input
                  type="number"
                  name="gano"
                  inputMode="decimal"
                  min="0"
                  max={ganoMax}
                  step={ganoStep}
                  value={formData.gano}
                  onChange={handleBasicChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder={
                    formData.notSistemi === "100" ? "0 - 100" : "0.00 - 4.00"
                  }
                />
                {errors.gano && (
                  <p className="mt-1 text-xs text-red-600">{errors.gano}</p>
                )}
              </div>
            </div>

            {/* Tarihler (tam tarih) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Başlangıç Tarihi *
                </label>
                <input
                  type="date"
                  value={toISODate(formData.baslangic)}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      baslangic: toDateSafe(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                  // max: bitiş (varsa) ile bugün'ün küçük olanı
                  max={
                    formData.bitis
                      ? toISODate(
                          new Date(
                            Math.min(formData.bitis.getTime(), today.getTime())
                          )
                        )
                      : todayISO
                  }
                  required
                />
                {errors.baslangic && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.baslangic}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bitiş Tarihi *
                </label>
                <input
                  type="date"
                  value={toISODate(formData.bitis)}
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      bitis: toDateSafe(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                  // min: başlangıç (varsa), yoksa undefined
                  min={
                    formData.baslangic
                      ? toISODate(formData.baslangic)
                      : undefined
                  }
                  // max: bugün
                  max={todayISO}
                  required
                />
                {errors.bitis && (
                  <p className="mt-1 text-xs text-red-600">{errors.bitis}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sabit alt aksiyon bar */}
          <div className="border-t bg-white px-6 py-3">
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
