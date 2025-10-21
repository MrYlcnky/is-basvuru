// components/Users/addModals/EducationAddModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";

/* -------------------- ZOD ŞEMASI -------------------- */
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
        "Okul yalnızca harflerden ve rakamlardan oluşmalı"
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
    baslangic: z.date({ required_error: "Başlangıç tarihi zorunlu." }),
    bitis: z.date({ required_error: "Bitiş tarihi zorunlu." }),
    diplomaDurum: z
      .string()
      .min(1, "Diploma durumu zorunlu.")
      .refine(
        (v) => ["Mezun", "Devam", "Ara Verdi", "Terk"].includes(v),
        "Geçerli diploma durumu seçiniz"
      ),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tarihler kontrol
    if (data.baslangic && data.bitis) {
      // aynı gün kontrolü
      if (
        data.baslangic.getFullYear() === data.bitis.getFullYear() &&
        data.baslangic.getMonth() === data.bitis.getMonth() &&
        data.baslangic.getDate() === data.bitis.getDate()
      ) {
        ctx.addIssue({
          path: ["bitis"],
          code: z.ZodIssueCode.custom,
          message: "Başlangıç ve bitiş aynı gün olamaz.",
        });
      }

      // bitiş < başlangıç
      if (data.bitis.getTime() < data.baslangic.getTime()) {
        ctx.addIssue({
          path: ["bitis"],
          code: z.ZodIssueCode.custom,
          message: "Bitiş, başlangıçtan önce olamaz.",
        });
      }
    }

    // bugünden ileri olamaz
    if (data.baslangic > today) {
      ctx.addIssue({
        path: ["baslangic"],
        code: z.ZodIssueCode.custom,
        message: "Başlangıç tarihi bugünden ileri olamaz.",
      });
    }
    if (data.bitis > today) {
      ctx.addIssue({
        path: ["bitis"],
        code: z.ZodIssueCode.custom,
        message: "Bitiş tarihi bugünden ileri olamaz.",
      });
    }

    // GANO kontrol
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
    baslangic: null,
    bitis: null,
    diplomaDurum: "",
  });
  const [errors, setErrors] = useState({});

  // tarih sınırı (bugün)
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
  }, []);
  const todayISO = toISODate(today);

  // modal reset
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
      setErrors({});
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  // alan değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    const parsed = eduSchema.safeParse(next);
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      setErrors((p) => ({ ...p, [name]: issue ? issue.message : "" }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handleDateChange = (name, value) => {
    const next = { ...formData, [name]: value ? toDateSafe(value) : null };
    setFormData(next);
    const parsed = eduSchema.safeParse(next);
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      setErrors((p) => ({ ...p, [name]: issue ? issue.message : "" }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
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

    const payload = parsed.data;
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Seviye */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Seviye *
                </label>
                <select
                  name="seviye"
                  value={formData.seviye}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
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

            {/* Tarihler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Başlangıç Tarihi *
                </label>
                <input
                  type="date"
                  value={
                    formData.baslangic ? toISODate(formData.baslangic) : ""
                  }
                  max={todayISO}
                  onChange={(e) =>
                    handleDateChange("baslangic", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
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
                  value={formData.bitis ? toISODate(formData.bitis) : ""}
                  min={formData.baslangic ? toISODate(formData.baslangic) : ""}
                  max={todayISO}
                  onChange={(e) => handleDateChange("bitis", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                />
                {errors.bitis && (
                  <p className="mt-1 text-xs text-red-600">{errors.bitis}</p>
                )}
              </div>
            </div>
          </div>

          {/* Alt butonlar */}
          <div className="border-t bg-white px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={!isValid}
                title={disabledTip}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                  isValid
                    ? mode === "edit"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {mode === "edit" ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
