// components/Users/addModals/CertificatesAddModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";
import MuiDateStringField from "../Date/MuiDateStringField";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";

/* -------------------- Regex -------------------- */
const ALNUM_TR = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u;

/* -------------------- Input base (hover: black) -------------------- */
const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black";

/* -------------------- ZOD ŞEMASI -------------------- */
const certSchema = z
  .object({
    ad: z
      .string()
      .trim()
      .min(1, "Sertifika / Eğitim adı zorunlu.")
      .max(100, "En fazla 100 karakter yazabilirsiniz.")
      .regex(ALNUM_TR, "Yalnızca harf, rakam ve boşluk kullanılabilir."),
    kurum: z
      .string()
      .trim()
      .min(1, "Kurum / Organizasyon adı zorunlu.")
      .max(100, "En fazla 100 karakter yazabilirsiniz.")
      .regex(ALNUM_TR, "Yalnızca harf, rakam ve boşluk kullanılabilir."),
    sure: z
      .string()
      .trim()
      .min(1, "Süre zorunlu.")
      .max(50, "En fazla 50 karakter yazabilirsiniz.")
      .regex(ALNUM_TR, "Yalnızca harf, rakam ve boşluk kullanılabilir."),

    // Veriliş tarihi (zorunlu, null kabul eder ama boşsa uyarı verir)
    verilisTarihi: z.preprocess(
      (v) => (v ? new Date(v) : null),
      z.date({ required_error: "Veriliş tarihi zorunlu." }).nullable()
    ),

    // Geçerlilik tarihi (opsiyonel)
    gecerlilikTarihi: z.preprocess(
      (v) => (v ? new Date(v) : null),
      z.date().nullable()
    ),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!data.verilisTarihi) {
      ctx.addIssue({
        path: ["verilisTarihi"],
        code: z.ZodIssueCode.custom,
        message: "Veriliş tarihi zorunlu.",
      });
      return;
    }

    if (data.verilisTarihi > today) {
      ctx.addIssue({
        path: ["verilisTarihi"],
        code: z.ZodIssueCode.custom,
        message: "Veriliş tarihi bugünden ileri olamaz.",
      });
    }

    if (data.verilisTarihi && data.gecerlilikTarihi) {
      if (data.gecerlilikTarihi < data.verilisTarihi) {
        ctx.addIssue({
          path: ["gecerlilikTarihi"],
          code: z.ZodIssueCode.custom,
          message: "Geçerlilik tarihi verilişten önce olamaz.",
        });
      }
      if (
        data.gecerlilikTarihi.toDateString() ===
        data.verilisTarihi.toDateString()
      ) {
        ctx.addIssue({
          path: ["gecerlilikTarihi"],
          code: z.ZodIssueCode.custom,
          message: "Veriliş ve geçerlilik tarihi aynı gün olamaz.",
        });
      }
    }
  });

/* -------------------- COMPONENT -------------------- */
export default function CertificatesAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    ad: "",
    kurum: "",
    sure: "",
    verilisTarihi: null,
    gecerlilikTarihi: null,
  });
  const [errors, setErrors] = useState({});

  /* ---------- SCROLL LOCK ---------- */
  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [open]);

  // onClose'u unlock ile sarmalayan tek kapatma fonksiyonu
  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  /* ---------- Modal reset ---------- */
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
    setErrors({});
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
  }, []);
  const todayISO = toISODate(today);

  const handleChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    const parsed = certSchema.safeParse(updated);
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === key);
      setErrors((p) => ({ ...p, [key]: issue ? issue.message : "" }));
    } else {
      setErrors((p) => ({ ...p, [key]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = certSchema.safeParse(formData);
    if (!parsed.success) {
      const newErr = {};
      parsed.error.issues.forEach((i) => {
        newErr[i.path[0]] = i.message;
      });
      setErrors(newErr);
      return;
    }

    const payload = {
      ...parsed.data,
      verilisTarihi: toISODate(parsed.data.verilisTarihi),
      gecerlilikTarihi: parsed.data.gecerlilikTarihi
        ? toISODate(parsed.data.gecerlilikTarihi)
        : null,
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    handleClose(); // kapatırken scroll’u geri getir
  };

  const parsed = certSchema.safeParse(formData);
  const isValid = parsed.success;
  const disabledTip = !isValid
    ? parsed.error?.issues?.map((i) => i.message).join(" • ")
    : "";

  const CharCounter = ({ value, max }) => {
    const len = value?.length || 0;
    return (
      <span
        className={`text-xs ${
          len >= max * 0.9 ? "text-red-500" : "text-gray-400"
        }`}
      >
        {len}/{max}
      </span>
    );
  };

  const toStr = (d) => (typeof d === "string" ? d : d ? toISODate(d) : "");

  // MUI onChange: string (YYYY-MM-DD) gelir → formda saklamak için handleChange'e pasla
  const handleMuiString = ({ target: { name, value } }) =>
    handleChange(name, value || null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
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
            {mode === "edit"
              ? "Sertifika ve Eğitim Bilgisi Düzenle"
              : "Sertifika ve Eğitim Bilgisi Ekle"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 focus:outline-none"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Sertifika / Eğitim Adı ve Kurum */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Ad */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Sertifika / Eğitim Adı *
                </label>
                <input
                  type="text"
                  value={formData.ad}
                  maxLength={100}
                  onChange={(e) => handleChange("ad", e.target.value)}
                  className={FIELD_BASE}
                  placeholder="Örn: React Bootcamp"
                />
                <div className="flex justify-between mt-1">
                  {errors.ad ? (
                    <p className="text-xs text-red-600">{errors.ad}</p>
                  ) : (
                    <span />
                  )}
                  <CharCounter value={formData.ad} max={100} />
                </div>
              </div>

              {/* Kurum */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Kurum / Organizasyon *
                </label>
                <input
                  type="text"
                  value={formData.kurum}
                  maxLength={100}
                  onChange={(e) => handleChange("kurum", e.target.value)}
                  className={FIELD_BASE}
                  placeholder="Örn: BTK Akademi"
                />
                <div className="flex justify-between mt-1">
                  {errors.kurum ? (
                    <p className="text-xs text-red-600">{errors.kurum}</p>
                  ) : (
                    <span />
                  )}
                  <CharCounter value={formData.kurum} max={100} />
                </div>
              </div>
            </div>

            {/* Süre & Veriliş Tarihi */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Süre */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Süresi *
                </label>
                <input
                  type="text"
                  value={formData.sure}
                  maxLength={50}
                  onChange={(e) => handleChange("sure", e.target.value)}
                  className={FIELD_BASE}
                  placeholder="Örn: 3 Ay"
                />
                <div className="flex justify-between mt-1">
                  {errors.sure ? (
                    <p className="text-xs text-red-600">{errors.sure}</p>
                  ) : (
                    <span />
                  )}
                  <CharCounter value={formData.sure} max={50} />
                </div>
              </div>

              {/* Veriliş Tarihi */}
              <div className="sm:col-span-2">
                <MuiDateStringField
                  label="Veriliş Tarihi"
                  name="verilisTarihi"
                  value={toStr(formData.verilisTarihi)}
                  onChange={handleMuiString}
                  required
                  error={errors.verilisTarihi}
                  min="1950-01-01"
                  max={todayISO}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                  }}
                />
              </div>
            </div>

            {/* Geçerlilik Tarihi */}
            <div className="sm:col-span-2">
              <MuiDateStringField
                label="Geçerlilik Tarihi (Opsiyonel)"
                name="gecerlilikTarihi"
                value={toStr(formData.gecerlilikTarihi)}
                onChange={handleMuiString}
                required={false}
                error={errors.gecerlilikTarihi}
                min={toStr(formData.verilisTarihi) || undefined}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                }}
              />
            </div>
          </div>

          {/* Alt Butonlar */}
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
