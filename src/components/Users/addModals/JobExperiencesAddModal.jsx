// components/Users/addModals/JobExperiencesAddModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";
import CountryCitySelect from "../Selected/CountryCitySelect";

export default function JobExperiencesAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
  anotherActiveExists = false,
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    isAdi: "",
    departman: "",
    pozisyon: "",
    gorev: "",
    ucret: "",
    baslangicTarihi: null,
    bitisTarihi: null,
    ayrilisSebebi: "",
    isUlke: "",
    isSehir: "",
    halenCalisiyor: false,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setFormData({
        isAdi: initialData.isAdi ?? "",
        departman: initialData.departman ?? "",
        pozisyon: initialData.pozisyon ?? "",
        gorev: initialData.gorev ?? "",
        ucret: initialData.ucret ?? "",
        baslangicTarihi: toDateSafe(initialData.baslangicTarihi ?? ""),
        bitisTarihi: toDateSafe(initialData.bitisTarihi ?? ""),
        ayrilisSebebi: initialData.ayrilisSebebi ?? "",
        isUlke: initialData.isUlke ?? "",
        isSehir: initialData.isSehir ?? "",
        halenCalisiyor:
          initialData.halenCalisiyor === true ||
          !initialData.bitisTarihi ||
          initialData.bitisTarihi === "",
      });
    } else {
      setFormData({
        isAdi: "",
        departman: "",
        pozisyon: "",
        gorev: "",
        ucret: "",
        baslangicTarihi: null,
        bitisTarihi: null,
        ayrilisSebebi: "",
        isUlke: "",
        isSehir: "",
        halenCalisiyor: false,
      });
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  const errors = useMemo(() => {
    const e = {};
    if (!formData.isAdi.trim()) e.isAdi = "Şirket / İş adı zorunlu.";
    if (!formData.pozisyon.trim()) e.pozisyon = "Pozisyon zorunlu.";
    if (!formData.departman.trim()) e.departman = "Departman zorunlu.";
    if (!formData.gorev.trim()) e.gorev = "Görev zorunlu.";
    if (!formData.ucret.trim()) e.ucret = "Ücret zorunlu.";
    if (!formData.ayrilisSebebi.trim())
      e.ayrilisSebebi = "Ayrılış sebebi zorunlu.";
    if (!formData.baslangicTarihi)
      e.baslangicTarihi = "Başlangıç tarihi zorunlu.";

    // Ülke/Şehir zorunlu
    if (!formData.isUlke.trim()) e.isUlke = "İş ülkesi zorunlu.";
    if (!formData.isSehir.trim()) e.isSehir = "İş şehri zorunlu.";

    if (anotherActiveExists && formData.halenCalisiyor) {
      e.halenCalisiyor =
        "Zaten halen çalıştığınız bir iş var. Bu kaydı aktif yapamazsınız.";
    }

    if (!formData.halenCalisiyor) {
      if (!formData.bitisTarihi) {
        e.bitisTarihi = "Bitiş tarihi zorunlu.";
      } else if (
        formData.baslangicTarihi &&
        formData.bitisTarihi.getTime() < formData.baslangicTarihi.getTime()
      ) {
        e.bitisTarihi = "Bitiş, başlangıçtan önce olamaz.";
      }
    }

    if (
      formData.ucret !== "" &&
      isNaN(Number(String(formData.ucret).replace(",", ".")))
    ) {
      e.ucret = "Ücret sayısal olmalıdır.";
    }

    return e;
  }, [formData, anotherActiveExists]);

  const isValid = Object.keys(errors).length === 0;
  const disabledTip = !isValid ? Object.values(errors).join(" • ") : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const bitis =
      formData.halenCalisiyor || !formData.bitisTarihi
        ? ""
        : toISODate(formData.bitisTarihi);

    const payload = {
      isAdi: formData.isAdi.trim(),
      departman: formData.departman.trim(),
      pozisyon: formData.pozisyon.trim(),
      gorev: formData.gorev.trim(),
      ucret: formData.ucret === "" ? "" : String(formData.ucret),
      baslangicTarihi: toISODate(formData.baslangicTarihi),
      bitisTarihi: bitis,
      ayrilisSebebi: formData.ayrilisSebebi.trim(),
      isUlke: formData.isUlke.trim(),
      isSehir: formData.isSehir.trim(),
      halenCalisiyor: !!formData.halenCalisiyor,
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    onClose?.();
  };

  const toggleHalenCalisiyor = (checked) => {
    setFormData((p) => ({
      ...p,
      halenCalisiyor: checked,
      bitisTarihi: checked ? null : p.bitisTarihi,
    }));
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
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit" ? "İş Deneyimi Düzenle" : "İş Deneyimi Ekle"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 1. Satır: Şirket / Departman */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Şirket / İş Adı *
                </label>
                <input
                  type="text"
                  value={formData.isAdi}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isAdi: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: ABC Teknoloji A.Ş."
                  required
                />
                {errors.isAdi && (
                  <p className="mt-1 text-xs text-red-600">{errors.isAdi}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Departman *
                </label>
                <input
                  type="text"
                  value={formData.departman}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, departman: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Yazılım"
                  required
                />
                {errors.departman && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.departman}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Satır: Pozisyon / Görev */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Pozisyon *
                </label>
                <input
                  type="text"
                  value={formData.pozisyon}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, pozisyon: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Full Stack Developer"
                  required
                />
                {errors.pozisyon && (
                  <p className="mt-1 text-xs text-red-600">{errors.pozisyon}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Görev *
                </label>
                <input
                  type="text"
                  value={formData.gorev}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, gorev: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Web geliştirme"
                  required
                />
                {errors.gorev && (
                  <p className="mt-1 text-xs text-red-600">{errors.gorev}</p>
                )}
              </div>
            </div>

            {/* 3. Satır: Ücret + Ülke/Şehir */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Ücret *
                </label>
                <input
                  type="text"
                  value={formData.ucret}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, ucret: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: 2500"
                  required
                />
                {errors.ucret && (
                  <p className="mt-1 text-xs text-red-600">{errors.ucret}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CountryCitySelect
                    countryLabel="Ülke (İş) *"
                    cityLabel="Şehir (İş) *"
                    countryId="jobCountry"
                    cityId="jobCity"
                    // Create modunda boş; Edit modunda mevcut değerler
                    defaultCountry={mode === "edit" ? formData.isUlke : ""}
                    defaultCity={mode === "edit" ? formData.isSehir : ""}
                    countryPlaceholder="Seçiniz"
                    cityPlaceholder="Seçiniz"
                    onChange={({ country, city }) =>
                      setFormData((p) => ({
                        ...p,
                        isUlke: country,
                        isSehir: city,
                      }))
                    }
                  />
                </div>
                {(errors.isUlke || errors.isSehir) && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.isUlke || errors.isSehir}
                  </p>
                )}
              </div>
            </div>

            {/* 3.5 Satır: Hâlen çalışıyorum */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="halenCalisiyorum"
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={formData.halenCalisiyor}
                onChange={(e) => toggleHalenCalisiyor(e.target.checked)}
                disabled={anotherActiveExists && !formData.halenCalisiyor}
                title={
                  anotherActiveExists && !formData.halenCalisiyor
                    ? "Zaten aktif bir iş var. Bu kaydı aktif yapamazsınız."
                    : ""
                }
              />
              <label
                htmlFor="halenCalisiyorum"
                className="text-sm text-gray-700 select-none"
              >
                Hâlen çalışıyorum
              </label>
              {errors.halenCalisiyor && (
                <span className="text-xs text-red-600 ml-2">
                  {errors.halenCalisiyor}
                </span>
              )}
            </div>

            {/* 4. Satır: Başlangıç / Bitiş */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Başlangıç Tarihi *
                </label>
                <input
                  type="date"
                  value={toISODate(formData.baslangicTarihi)}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      baslangicTarihi: toDateSafe(e.target.value),
                    }))
                  }
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                  required
                />
                {errors.baslangicTarihi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.baslangicTarihi}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bitiş Tarihi{" "}
                  {formData.halenCalisiyor ? "(Devam ediyor)" : "*"}
                </label>
                <input
                  type="date"
                  value={toISODate(formData.bitisTarihi)}
                  min={toISODate(formData.baslangicTarihi) || undefined}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      bitisTarihi: toDateSafe(e.target.value),
                    }))
                  }
                  disabled={formData.halenCalisiyor}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    formData.halenCalisiyor
                      ? "bg-gray-100 cursor-not-allowed opacity-70"
                      : "cursor-pointer [::-webkit-calendar-picker-indicator]:cursor-pointer"
                  }`}
                />
                {errors.bitisTarihi && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.bitisTarihi}
                  </p>
                )}
              </div>
            </div>

            {/* 5. Satır: Ayrılış Sebebi */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ayrılış Sebebi *
              </label>
              <input
                type="text"
                value={formData.ayrilisSebebi}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, ayrilisSebebi: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Örn: Eğitim / taşınma / proje bitişi..."
                required
              />
              {errors.ayrilisSebebi && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.ayrilisSebebi}
                </p>
              )}
            </div>
          </div>

          {/* Alt aksiyon bar */}
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
