// components/Users/addModals/EducationAddModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils"; // yolunu kendi projene göre düzelt
import MuiDateStringField from "../Date/MuiDateStringField";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";

/* -------------------- Yardımcı -------------------- */
const isValidISODate = (s) => {
  if (!s) return false;
  const d = new Date(s + "T00:00:00");
  return !Number.isNaN(d.getTime());
};
const toDate = (s) => (s ? new Date(s + "T00:00:00") : null);

/* -------------------- Ortak Alan Sınıfları -------------------- */
const BASE_FIELD =
  "w-full rounded-lg border px-3 py-2 transition border-gray-300 hover:border-black focus:outline-none";
const BASE_SELECT =
  "w-full h-[43px] rounded-lg border px-3 py-2 transition border-gray-300 hover:border-black focus:outline-none cursor-pointer";

/* -------------------- ZOD ŞEMASI (tarihler string) -------------------- */
/* BİTİŞ TARİHİ KURALI:
   - Mezun veya Ara Verdi => bitiş ZORUNLU
   - Devam veya Terk       => bitiş İSTENMEZ (UI’de disable, şemada da gereksiz) */
const eduSchema = z
  .object({
    seviye: z.string().min(1, "Seviye zorunlu."),
    okul: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
        "Okul yalnızca harflerden ve rakamlardan oluşmalı"
      )
      .min(5, "Okul adı zorunlu.")
      .max(100, "Okul adı 150 karakteri geçemez."),
    bolum: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
        "Bölüm yalnızca harf ve rakam içermeli"
      )
      .min(5, "Bölüm adı zorunlu.")
      .max(100, "Bölüm adı 150 karakteri geçemez."),
    notSistemi: z.enum(["4", "100"], {
      errorMap: () => ({ message: "Not sistemi seçiniz" }),
    }),
    gano: z
      .string()
      .optional()
      .refine((v) => v === "" || (!isNaN(v) && Number(v) >= 0), {
        message: "Geçerli bir sayı giriniz",
      }),
    baslangic: z.string().min(1, "Başlangıç tarihi zorunlu."),
    bitis: z.string().optional().default(""),
    diplomaDurum: z
      .string()
      .min(1, "Diploma durumu zorunlu.")
      .refine(
        (v) => ["Mezun", "Devam", "Ara Verdi", "Terk"].includes(v),
        "Geçerli diploma durumu seçiniz"
      ),
  })
  .superRefine((data, ctx) => {
    // Başlangıç kontrolleri
    if (!isValidISODate(data.baslangic)) {
      ctx.addIssue({
        path: ["baslangic"],
        code: z.ZodIssueCode.custom,
        message: "Başlangıç tarihi geçersiz.",
      });
      return;
    }
    const start = toDate(data.baslangic);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start > today) {
      ctx.addIssue({
        path: ["baslangic"],
        code: z.ZodIssueCode.custom,
        message: "Başlangıç tarihi bugünden ileri olamaz.",
      });
    }

    const requiresEnd = ["Mezun", "Ara Verdi"].includes(data.diplomaDurum);

    // Bitiş gerektiren durumlar
    if (requiresEnd) {
      if (!data.bitis || data.bitis.trim() === "") {
        ctx.addIssue({
          path: ["bitis"],
          code: z.ZodIssueCode.custom,
          message: "Bitiş tarihi zorunlu.",
        });
        return;
      }
      if (!isValidISODate(data.bitis)) {
        ctx.addIssue({
          path: ["bitis"],
          code: z.ZodIssueCode.custom,
          message: "Bitiş tarihi geçersiz.",
        });
        return;
      }
      const end = toDate(data.bitis);

      if (end > today) {
        ctx.addIssue({
          path: ["bitis"],
          code: z.ZodIssueCode.custom,
          message: "Bitiş tarihi bugünden ileri olamaz.",
        });
      }
      if (start && end) {
        if (
          start.getFullYear() === end.getFullYear() &&
          start.getMonth() === end.getMonth() &&
          start.getDate() === end.getDate()
        ) {
          ctx.addIssue({
            path: ["bitis"],
            code: z.ZodIssueCode.custom,
            message: "Başlangıç ve bitiş aynı gün olamaz.",
          });
        }
        if (end.getTime() < start.getTime()) {
          ctx.addIssue({
            path: ["bitis"],
            code: z.ZodIssueCode.custom,
            message: "Bitiş, başlangıçtan önce olamaz.",
          });
        }
      }
    }

    // GANO kontrolleri
    if (data.gano && data.gano !== "") {
      const n = Number(data.gano);
      const max = data.notSistemi === "100" ? 100 : 4;
      if (n > max) {
        ctx.addIssue({
          path: ["gano"],
          code: z.ZodIssueCode.custom,
          message: `GANO 0 ile ${max} arasında olmalı.`,
        });
      }
      if (data.notSistemi === "4" && String(n).includes(".")) {
        const decimals = String(n).split(".")[1];
        if (decimals && decimals.length > 2) {
          ctx.addIssue({
            path: ["gano"],
            code: z.ZodIssueCode.custom,
            message: "4'lük sistemde en fazla 2 ondalık basamak giriniz.",
          });
        }
      }
    }
  });

/* -------------------- COMPONENT -------------------- */
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
    baslangic: "",
    bitis: "",
    diplomaDurum: "",
  });
  const [errors, setErrors] = useState({});

  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
  }, []);
  const todayISO = toISODate(today);

  /* ---------- SCROLL LOCK ---------- */
  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [open]);

  // Tüm kapatma yollarını tek yerden geçir: unlock + onClose
  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

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
        baslangic: initialData.baslangic
          ? toISODate(toDateSafe(initialData.baslangic))
          : "",
        bitis: initialData.bitis
          ? toISODate(toDateSafe(initialData.bitis))
          : "",
        diplomaDurum: initialData.diplomaDurum ?? "",
      });
      setErrors({});
    } else {
      setFormData({
        seviye: "",
        okul: "",
        bolum: "",
        notSistemi: "4",
        gano: "",
        baslangic: "",
        bitis: "",
        diplomaDurum: "",
      });
      setErrors({});
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...formData, [name]: value };

    // Diploma durumu Devam/Terk → bitişi temizle ve disable edeceğiz
    if (name === "diplomaDurum") {
      if (value === "Devam" || value === "Terk") {
        next.bitis = "";
        setErrors((p) => ({ ...p, bitis: "" }));
      }
    }

    setFormData(next);

    const parsed = eduSchema.safeParse(next);
    if (!parsed.success) {
      const issue =
        parsed.error.issues.find((i) => i.path[0] === name) ||
        (name === "diplomaDurum" &&
          parsed.error.issues.find((i) => i.path[0] === "bitis"));
      setErrors((p) => ({
        ...p,
        [issue?.path?.[0] || name]: issue ? issue.message : "",
      }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
      if (name === "diplomaDurum") {
        setErrors((p) => ({ ...p, bitis: "" }));
      }
    }
  };

  const isValid = eduSchema.safeParse(formData).success;
  const disabledTip = !isValid ? "Tüm zorunlu alanları doğru doldurunuz." : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = eduSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrs = {};
      parsed.error.issues.forEach((i) => {
        newErrs[i.path[0]] = i.message;
      });
      setErrors(newErrs);
      return;
    }

    const payload = {
      ...parsed.data,
      baslangic: toDate(parsed.data.baslangic),
      bitis:
        parsed.data.bitis && parsed.data.bitis !== ""
          ? toDate(parsed.data.bitis)
          : null,
      gano:
        parsed.data.gano === "" || parsed.data.gano == null
          ? null
          : Number(parsed.data.gano),
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);
    handleClose(); // kapatırken scroll’u geri getir
  };

  if (!open) return null;

  const isEndDisabled =
    formData.diplomaDurum === "Devam" || formData.diplomaDurum === "Terk";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
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
            onClick={handleClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Seviye */}
            <div className="grid grid-cols-1  sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Seviye *
                </label>
                <select
                  name="seviye"
                  value={formData.seviye}
                  onChange={handleChange}
                  className={BASE_SELECT}
                >
                  <option value="">Seçiniz</option>
                  <option value="Lise">Lise</option>
                  <option value="Ön Lisans">Ön Lisans</option>
                  <option value="Lisans">Lisans</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                  <option value="Diğer">Diğer</option>
                </select>
                {errors.seviye && (
                  <p className="mt-1 text-xs text-red-600">{errors.seviye}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Okul Adı *
                </label>
                <input
                  type="text"
                  name="okul"
                  maxLength={100}
                  value={formData.okul}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder="Örn: Erciyes Üniversitesi"
                />
                <div className="flex justify-between mt-1">
                  {errors.okul ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.okul}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.okul.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.okul.length}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Bölüm & Diploma */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Bölüm *
                </label>
                <input
                  type="text"
                  name="bolum"
                  maxLength={100}
                  value={formData.bolum}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder="Örn: Bilgisayar Mühendisliği"
                />
                <div className="flex justify-between mt-1">
                  {errors.bolum ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.bolum}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.bolum.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.bolum.length}/100
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Diploma Durumu *
                </label>
                <select
                  name="diplomaDurum"
                  value={formData.diplomaDurum}
                  onChange={handleChange}
                  className={BASE_SELECT}
                >
                  <option value="">Seçiniz</option>
                  <option value="Mezun">Mezun</option>
                  <option value="Devam">Devam Ediyor</option>
                  <option value="Ara Verdi">Ara Verdi</option>
                  <option value="Terk">Terk</option>
                </select>
                {errors.diplomaDurum && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.diplomaDurum}
                  </p>
                )}
              </div>
            </div>

            {/* Not Sistemi & GANO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Not Sistemi *
                </label>
                <select
                  name="notSistemi"
                  value={formData.notSistemi}
                  onChange={handleChange}
                  className={BASE_SELECT}
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
                  value={formData.gano}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder={
                    formData.notSistemi === "100" ? "0 - 100" : "0.00 - 4.00"
                  }
                />
                {errors.gano && (
                  <p className="mt-1 text-xs text-red-600">{errors.gano}</p>
                )}
              </div>
            </div>

            {/* Tarihler (MUI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="shadow-none outline-none">
                <MuiDateStringField
                  label="Başlangıç Tarihi"
                  name="baslangic"
                  value={formData.baslangic}
                  onChange={handleChange}
                  required
                  error={errors.baslangic}
                  min="1950-01-01"
                  max={todayISO}
                />
              </div>
              <div className="shadow-none outline-none">
                <MuiDateStringField
                  label="Bitiş Tarihi"
                  name="bitis"
                  value={formData.bitis}
                  onChange={handleChange}
                  required={false}
                  error={errors.bitis}
                  min={formData.baslangic || "1950-01-01"}
                  max={todayISO}
                  disabled={isEndDisabled}
                />
                {isEndDisabled && (
                  <p className="mt-1 text-xs text-gray-500">
                    Devam Ediyor / Terk durumunda bitiş tarihi girilmez.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Alt butonlar */}
          <div className="border-t bg-white px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
              >
                İptal
              </button>
              {mode === "edit" ? (
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
              ) : (
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
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
