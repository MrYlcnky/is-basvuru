// components/Users/addModals/JobExperiencesAddModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";
import CountryCitySelect from "../Selected/CountryCitySelect";
import { z } from "zod";

/* -------------------- REGEX (ESLint no-useless-escape uyumlu) -------------------- */
// Harf (TR dâhil), rakam, boşluk ve . & ( ) ' / - karakterleri
const NAME_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.&()'/]+$/u;
// Harf (TR dâhil), rakam, boşluk ve . , % & ( ) ' / - karakterleri
const TEXT_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.,&()'/%]+$/u;

/* -------------------- ŞEMA (prop bağımlılığı için fabrika) -------------------- */
const makeSchema = (anotherActiveExists) =>
  z
    .object({
      isAdi: z
        .string()
        .trim()
        .regex(
          NAME_RE,
          "Şirket / İş adı yalnızca harf, rakam, boşluk ve . & ( ) ' / içerebilir."
        )
        .min(1, "Şirket / İş adı zorunlu.")
        .max(100, "En fazla 100 karakter."),
      departman: z
        .string()
        .trim()
        .regex(
          NAME_RE,
          "Departman yalnızca harf, rakam, boşluk ve . & ( ) ' / içerebilir."
        )
        .min(1, "Departman zorunlu.")
        .max(100, "En fazla 100 karakter."),
      pozisyon: z
        .string()
        .trim()
        .regex(
          NAME_RE,
          "Pozisyon yalnızca harf, rakam, boşluk ve . & ( ) ' / içerebilir."
        )
        .min(1, "Pozisyon zorunlu.")
        .max(100, "En fazla 100 karakter."),
      gorev: z
        .string()
        .trim()
        .regex(
          NAME_RE,
          "Görev yalnızca harf, rakam, boşluk ve . & ( ) ' / içerebilir."
        )
        .min(1, "Görev zorunlu.")
        .max(120, "En fazla 120 karakter."),
      ayrilisSebebi: z
        .string()
        .trim()
        .regex(
          TEXT_RE,
          "Ayrılış sebebi yalnızca harf, rakam, boşluk ve . , % & ( ) ' / içerebilir."
        )
        .min(1, "Ayrılış sebebi zorunlu.")
        .max(150, "En fazla 150 karakter."),
      ucret: z
        .string()
        .trim()
        .min(1, "Ücret zorunlu.")
        .refine(
          (v) => !isNaN(Number(String(v).replace(",", "."))),
          "Ücret sayısal olmalıdır."
        ),
      // null -> undefined çeviriyoruz ki required_error tetiklensin
      baslangicTarihi: z.preprocess(
        (v) => (v === null ? undefined : v),
        z.date({ required_error: "Başlangıç tarihi zorunlu." })
      ),
      bitisTarihi: z.preprocess(
        (v) => (v === null ? undefined : v),
        z.date().optional()
      ),
      isUlke: z.string().trim().min(1, "İş ülkesi zorunlu."),
      isSehir: z.string().trim().min(1, "İş şehri zorunlu."),
      halenCalisiyor: z.boolean(),
    })
    .superRefine((data, ctx) => {
      // Yalnızca 1 aktif iş
      if (anotherActiveExists && data.halenCalisiyor) {
        ctx.addIssue({
          path: ["halenCalisiyor"],
          code: z.ZodIssueCode.custom,
          message:
            "Zaten halen çalıştığınız bir iş var. Bu kaydı aktif yapamazsınız.",
        });
      }
      // Aktif değilse bitiş zorunlu
      if (!data.halenCalisiyor && !data.bitisTarihi) {
        ctx.addIssue({
          path: ["bitisTarihi"],
          code: z.ZodIssueCode.custom,
          message: "Bitiş tarihi zorunlu.",
        });
      }
      // Başlangıç <= Bitiş
      if (data.baslangicTarihi && data.bitisTarihi) {
        if (data.bitisTarihi.getTime() < data.baslangicTarihi.getTime()) {
          ctx.addIssue({
            path: ["bitisTarihi"],
            code: z.ZodIssueCode.custom,
            message: "Bitiş, başlangıçtan önce olamaz.",
          });
        }
      }
    });

/* -------------------- COMPONENT -------------------- */
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

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [disabledTip, setDisabledTip] = useState("");

  const schema = useMemo(
    () => makeSchema(anotherActiveExists),
    [anotherActiveExists]
  );
  const shape = schema.shape;

  // Modal reset
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
      setErrors({});
      setIsValid(true);
      setDisabledTip("");
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
      setErrors({});
      setIsValid(true);
      setDisabledTip("");
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  /* -------------------- Doğrulayıcılar -------------------- */
  // Sadece değişen alanı kontrol et (performans için)
  const validateOne = (name, value) => {
    if (!shape[name]) return;
    const res = shape[name].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: res.success ? "" : res.error.issues[0]?.message || "",
    }));
  };

  // Çapraz kurallar (tarih/aktif iş) için form tamamını doğrula
  const validateCross = (nextForm) => {
    const res = schema.safeParse(nextForm);
    if (!res.success) {
      const next = {};
      res.error.issues.forEach((i) => {
        if (i.path[0]) next[i.path[0]] = i.message;
      });
      setErrors(next);
      setIsValid(false);
      setDisabledTip(res.error.issues.map((i) => i.message).join(" • "));
    } else {
      setErrors({});
      setIsValid(true);
      setDisabledTip("");
    }
  };

  /* -------------------- Handlers -------------------- */
  // Metin/select alanları
  const onInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const next = { ...p, [name]: value };
      validateOne(name, value);
      return next;
    });
  };

  // Tarihler
  const onDateChange = (name, value) => {
    setFormData((p) => {
      const next = { ...p, [name]: value ? toDateSafe(value) : null };
      validateCross(next); // çapraz kurallar
      return next;
    });
  };

  // Hâlen çalışıyorum
  const toggleHalenCalisiyor = (checked) => {
    setFormData((p) => {
      const next = {
        ...p,
        halenCalisiyor: checked,
        bitisTarihi: checked ? null : p.bitisTarihi,
      };
      validateCross(next); // çapraz kurallar
      return next;
    });
  };

  // Ülke/Şehir
  const onCountryCityChange = ({ country, city }) => {
    setFormData((p) => {
      const next = { ...p, isUlke: country, isSehir: city };
      validateOne("isUlke", country);
      validateOne("isSehir", city);
      return next;
    });
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      const newErrs = {};
      parsed.error.issues.forEach((i) => {
        newErrs[i.path[0]] = i.message;
      });
      setErrors(newErrs);
      setIsValid(false);
      setDisabledTip(parsed.error.issues.map((i) => i.message).join(" • "));
      return;
    }

    const d = parsed.data;
    const payload = {
      isAdi: d.isAdi.trim(),
      departman: d.departman.trim(),
      pozisyon: d.pozisyon.trim(),
      gorev: d.gorev.trim(),
      ucret: d.ucret === "" ? "" : String(d.ucret),
      baslangicTarihi: toISODate(d.baslangicTarihi),
      bitisTarihi:
        d.halenCalisiyor || !d.bitisTarihi ? "" : toISODate(d.bitisTarihi),
      ayrilisSebebi: d.ayrilisSebebi.trim(),
      isUlke: d.isUlke.trim(),
      isSehir: d.isSehir.trim(),
      halenCalisiyor: !!d.halenCalisiyor,
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);
    onClose?.();
  };

  if (!open) return null;

  /* -------------------- RENDER -------------------- */
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
                  name="isAdi"
                  value={formData.isAdi}
                  onChange={onInput}
                  maxLength={100}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: ABC Teknoloji A.Ş."
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.isAdi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.isAdi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.isAdi.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.isAdi.length}/100
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Departman *
                </label>
                <input
                  type="text"
                  name="departman"
                  value={formData.departman}
                  onChange={onInput}
                  maxLength={100}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Yazılım"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.departman ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.departman}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.departman.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.departman.length}/100
                  </p>
                </div>
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
                  name="pozisyon"
                  value={formData.pozisyon}
                  onChange={onInput}
                  maxLength={100}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Full Stack Developer"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.pozisyon ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.pozisyon}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.pozisyon.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.pozisyon.length}/100
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Görev *
                </label>
                <input
                  type="text"
                  name="gorev"
                  value={formData.gorev}
                  onChange={onInput}
                  maxLength={120}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Örn: Web geliştirme"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.gorev ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.gorev}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.gorev.length >= 110
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.gorev.length}/120
                  </p>
                </div>
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
                  name="ucret"
                  value={formData.ucret}
                  onChange={onInput}
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
                    defaultCountry={mode === "edit" ? formData.isUlke : ""}
                    defaultCity={mode === "edit" ? formData.isSehir : ""}
                    countryPlaceholder="Seçiniz"
                    cityPlaceholder="Seçiniz"
                    onChange={onCountryCityChange}
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
                    onDateChange("baslangicTarihi", e.target.value)
                  }
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
                  onChange={(e) => onDateChange("bitisTarihi", e.target.value)}
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
                name="ayrilisSebebi"
                value={formData.ayrilisSebebi}
                onChange={onInput}
                maxLength={150}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Örn: Eğitim / taşınma / proje bitişi..."
                required
              />
              <div className="flex justify-between items-center mt-1">
                {errors.ayrilisSebebi ? (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.ayrilisSebebi}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  className={`text-xs ${
                    formData.ayrilisSebebi.length >= 140
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.ayrilisSebebi.length}/150
                </p>
              </div>
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
