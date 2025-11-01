// components/Users/addModals/JobExperiencesAddModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { toDateSafe, toISODate } from "../modalHooks/dateUtils";
import { z } from "zod";
import ScrollSelect from "../Selected/ScrollSelect";
import MuiDateStringField from "../Date/MuiDateStringField";

/* -------------------- REGEX -------------------- */
// Harf (TR dâhil), rakam, boşluk ve . & ( ) ' / - karakterleri
const NAME_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.&()'/]+$/u;
// Harf (TR dâhil), rakam, boşluk ve . , % & ( ) ' / - karakterleri
const TEXT_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.,&()'/%]+$/u;

/* -------------------- Ülke / İl seçenekleri -------------------- */
const TR_IL_ILCE = {
  İstanbul: ["Kadıköy", "Üsküdar", "Beşiktaş", "Bakırköy", "Sarıyer"],
  Ankara: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Sincan"],
  İzmir: ["Konak", "Karşıyaka", "Bornova", "Buca", "Bayraklı"],
  Çorum: ["Merkez", "Sungurlu", "Osmancık", "İskilip", "Uğurludağ"],
  Kayseri: ["Kocasinan", "Melikgazi", "Talas", "Develi", "İncesu"],
  Antalya: ["Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat"],
};

const COUNTRY_OPTIONS = [
  "Türkiye",
  "Türkmenistan",
  "Pakistan",
  "Azerbaycan",
  "Kazakistan",
  "Kırgızistan",
  "Özbekistan",
  "Kuzey Kıbrıs (KKTC)",
  "Bangladeş",
  "Rusya",
  "Diğer",
];

const onlyLettersTR = (s) => s.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");

/* -------------------- ORTAK SINIF -------------------- */
const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black";

/* -------------------- ŞEMA -------------------- */
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
      // aktifken zorunlu değil; pasifken zorunlu
      ayrilisSebebi: z
        .string()
        .trim()
        .max(150, "En fazla 150 karakter.")
        .regex(
          TEXT_RE,
          "Ayrılış sebebi yalnızca harf, rakam, boşluk ve . , % & ( ) ' / içerebilir."
        )
        .optional()
        .or(z.literal("")),
      ucret: z
        .string()
        .trim()
        .min(1, "Ücret zorunlu.")
        .refine(
          (v) => !isNaN(Number(String(v).replace(",", "."))),
          "Ücret sayısal olmalıdır."
        ),
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
      if (anotherActiveExists && data.halenCalisiyor) {
        ctx.addIssue({
          path: ["halenCalisiyor"],
          code: z.ZodIssueCode.custom,
          message:
            "Zaten halen çalıştığınız bir iş var. Bu kaydı aktif yapamazsınız.",
        });
      }
      // Pasif ise bitiş ve ayrılış sebebi zorunlu
      if (!data.halenCalisiyor) {
        if (!data.bitisTarihi) {
          ctx.addIssue({
            path: ["bitisTarihi"],
            code: z.ZodIssueCode.custom,
            message: "Bitiş tarihi zorunlu.",
          });
        }
        if (!data.ayrilisSebebi || data.ayrilisSebebi.trim().length === 0) {
          ctx.addIssue({
            path: ["ayrilisSebebi"],
            code: z.ZodIssueCode.custom,
            message: "Ayrılış sebebi zorunlu.",
          });
        }
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

  /* --------- Ülke/Şehir --------- */
  const [jobCountry, setJobCountry] = useState("Türkiye");
  const [jobCountryOther, setJobCountryOther] = useState("");
  const [jobProvince, setJobProvince] = useState(""); // SADECE İL (ilçe yok)
  const [jobPlaceOther, setJobPlaceOther] = useState("");

  const countryOptions = COUNTRY_OPTIONS.map((c) => ({ value: c, label: c }));
  const ilOptions = Object.keys(TR_IL_ILCE).map((il) => ({
    value: il,
    label: il,
  }));

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [disabledTip, setDisabledTip] = useState("");

  const schema = useMemo(
    () => makeSchema(anotherActiveExists),
    [anotherActiveExists]
  );
  const shape = schema.shape;

  const syncField = (patch) => {
    setFormData((p) => {
      const next = { ...p, ...patch };
      Object.entries(patch).forEach(([name, value]) =>
        validateOne(name, value)
      );
      return next;
    });
  };

  const syncJobToForm = () => {
    const country = jobCountry === "Diğer" ? jobCountryOther : jobCountry;
    const city =
      jobCountry === "Türkiye" ? jobProvince || "" : jobPlaceOther || "";
    syncField({ isUlke: country || "", isSehir: city || "" });
  };

  const parseInitialCountryCity = (ulkeVal, sehirVal) => {
    if (!ulkeVal) {
      setJobCountry("Türkiye");
      setJobCountryOther("");
      setJobProvince("");
      setJobPlaceOther("");
      return;
    }
    if (COUNTRY_OPTIONS.includes(ulkeVal)) {
      setJobCountry(ulkeVal);
      setJobCountryOther("");
    } else {
      setJobCountry("Diğer");
      setJobCountryOther(ulkeVal);
    }
    if (ulkeVal === "Türkiye") {
      setJobProvince(sehirVal || "");
      setJobPlaceOther("");
    } else {
      setJobProvince("");
      setJobPlaceOther(sehirVal || "");
    }
  };

  // Modal reset
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      const next = {
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
      };
      setFormData(next);
      parseInitialCountryCity(next.isUlke, next.isSehir);
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
      setJobCountry("Türkiye");
      setJobCountryOther("");
      setJobProvince("");
      setJobPlaceOther("");
      setErrors({});
      setIsValid(true);
      setDisabledTip("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, onClose, dialogRef);

  /* -------------------- Doğrulayıcılar -------------------- */
  const validateOne = (name, value) => {
    if (!shape[name]) return;
    const res = shape[name].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: res.success ? "" : res.error.issues[0]?.message || "",
    }));
  };

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
  const onInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const next = { ...p, [name]: value };
      validateOne(name, value);
      return next;
    });
  };

  const onDateChange = (name, value) => {
    setFormData((p) => {
      const next = { ...p, [name]: value ? toDateSafe(value) : null };
      validateCross(next);
      return next;
    });
  };

  const toggleHalenCalisiyor = (checked) => {
    setFormData((p) => {
      const next = {
        ...p,
        halenCalisiyor: checked,
        bitisTarihi: checked ? null : p.bitisTarihi,
        ayrilisSebebi: checked ? "" : p.ayrilisSebebi,
      };
      validateCross(next);
      return next;
    });
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    syncJobToForm();

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
      ayrilisSebebi: (d.ayrilisSebebi || "").trim(),
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 overflow-visible">
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
                  className={FIELD_BASE}
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
                  className={FIELD_BASE}
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
                  className={FIELD_BASE}
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
                  className={FIELD_BASE}
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

            {/* 3. Satır: Ücret + Ülke */}
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
                  className={FIELD_BASE}
                  placeholder="Örn: 2500"
                  required
                />
                {errors.ucret && (
                  <p className="mt-1 text-xs text-red-600">{errors.ucret}</p>
                )}
              </div>

              {/* Ülke (İş) */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Ülke (İş) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ScrollSelect
                    name="isUlkeSelect"
                    value={jobCountry}
                    onChange={(e) => {
                      const v = e.target.value;
                      setJobCountry(v);
                      setJobCountryOther("");
                      setJobProvince("");
                      setJobPlaceOther("");
                      syncField({
                        isUlke: v === "Diğer" ? "" : v,
                        isSehir: "",
                      });
                    }}
                    options={[
                      { value: "", label: "Seçiniz" },
                      ...countryOptions,
                    ]}
                    placeholder="Seçiniz"
                    showError={false}
                    className="transition-none"
                    menuClassName="transition-none"
                  />
                  <input
                    type="text"
                    placeholder="Ülke adı (Diğer)"
                    value={jobCountryOther}
                    onChange={(e) => {
                      const v = onlyLettersTR(e.target.value);
                      setJobCountryOther(v);
                      syncJobToForm();
                    }}
                    disabled={jobCountry !== "Diğer"}
                    className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                      jobCountry === "Diğer"
                        ? "bg-white border-gray-300 text-gray-900 hover:border-black"
                        : "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
                    }`}
                  />
                </div>
                {errors.isUlke && (
                  <p className="mt-1 text-xs text-red-600">{errors.isUlke}</p>
                )}
              </div>
            </div>

            {/* 3.5 Satır: Şehir (İl) */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Şehir (İş) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jobCountry === "Türkiye" ? (
                  <>
                    <ScrollSelect
                      name="isIl"
                      value={jobProvince}
                      onChange={(e) => {
                        setJobProvince(e.target.value);
                        syncJobToForm();
                      }}
                      options={[
                        { value: "", label: "İl Seçiniz" },
                        ...ilOptions,
                      ]}
                      placeholder="İl Seçiniz"
                      className="transition-none"
                      menuClassName="transition-none"
                    />
                    <div className="hidden sm:block" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="İl / Şehir"
                      value={jobPlaceOther}
                      onChange={(e) => {
                        const v = onlyLettersTR(e.target.value);
                        setJobPlaceOther(v);
                        syncJobToForm();
                      }}
                      disabled={
                        !jobCountry ||
                        (jobCountry === "Diğer" && !jobCountryOther)
                      }
                      className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                        !jobCountry ||
                        (jobCountry === "Diğer" && !jobCountryOther)
                          ? "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-900 hover:border-black"
                      }`}
                    />
                    <div className="hidden sm:block" />
                  </>
                )}
              </div>
              {errors.isSehir && (
                <p className="mt-1 text-xs text-red-600">{errors.isSehir}</p>
              )}
            </div>

            {/* Hâlen çalışıyorum */}
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

            {/* 4. Satır: Başlangıç / Bitiş (MUI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="shadow-none">
                <MuiDateStringField
                  label="Başlangıç Tarihi"
                  name="baslangicTarihi"
                  value={toISODate(formData.baslangicTarihi)}
                  onChange={(e) =>
                    onDateChange("baslangicTarihi", e.target.value)
                  }
                  required
                  min="1950-01-01"
                  max="2099-12-31"
                  size="small"
                  error={errors.baslangicTarihi}
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
              <div className="shadow-none">
                <MuiDateStringField
                  label={`Bitiş Tarihi ${
                    formData.halenCalisiyor ? "(Devam ediyor)" : "*"
                  }`}
                  name="bitisTarihi"
                  value={toISODate(formData.bitisTarihi)}
                  onChange={(e) => onDateChange("bitisTarihi", e.target.value)}
                  min={toISODate(formData.baslangicTarihi) || undefined}
                  max="2099-12-31"
                  size="small"
                  disabled={formData.halenCalisiyor}
                  error={errors.bitisTarihi}
                  sx={{
                    // normal/hov/focus border
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },

                    //  disable iken gri arkaplan + daha soluk yazı
                    "& .MuiInputBase-root.Mui-disabled": {
                      backgroundColor: "#f3f4f6",
                    }, // tailwind gray-100
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6b7280",
                    }, // gray-500
                  }}
                />
              </div>
            </div>

            {/* 5. Satır: Ayrılış Sebebi (aktifken disable) */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Ayrılış Sebebi{" "}
                {formData.halenCalisiyor ? "(Devam ediyor)" : "*"}
              </label>
              <input
                type="text"
                name="ayrilisSebebi"
                value={formData.ayrilisSebebi}
                onChange={onInput}
                maxLength={150}
                disabled={formData.halenCalisiyor}
                className={`rounded-lg px-3 py-2 focus:outline-none border ${
                  formData.halenCalisiyor
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
                    : "bg-white border-gray-300 hover:border-black"
                } w-full`}
                placeholder="Örn: Eğitim / taşınma / proje bitişi..."
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
                    (formData.ayrilisSebebi || "").length >= 140
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {(formData.ayrilisSebebi || "").length}/150
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
