import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import MuiDateStringField from "../Date/MuiDateStringField";
import SearchSelect from "../Selected/SearchSelect";

/* -------------------- Sabit Veriler (TR iller/ilçeler) -------------------- */
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

// Ülke -> Uyruk eşleşmesi (etiket gösterimi)
const NATIONALITY_MAP = {
  Türkiye: "Türk",
  Türkmenistan: "Türkmen",
  Pakistan: "Pakistanlı",
  Azerbaycan: "Azerbaycanlı",
  Kazakistan: "Kazak",
  Kırgızistan: "Kırgız",
  Özbekistan: "Özbek",
  "Kuzey Kıbrıs (KKTC)": "Kıbrıslı Türk",
  Bangladeş: "Bangladeşli",
  Rusya: "Rus",
  Diğer: "Diğer",
};

const onlyLettersTR = (s) => s.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");

const PersonalInformation = forwardRef(function PersonalInformation(
  { onValidChange },
  ref
) {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    eposta: "",
    telefon: "",
    whatsapp: "",
    adres: "",
    cinsiyet: "",
    medeniDurum: "",
    dogumTarihi: "",
    uyruk: "",
    cocukSayisi: "",
    foto: null,

    dogumUlke: "",
    dogumSehir: "",
    ikametUlke: "",
    ikametSehir: "",
  });
  const [errors, setErrors] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoError, setFotoError] = useState("");

  /* ---------- i18n-derived options ---------- */
  const genderOptions = useMemo(
    () => [
      { value: "", label: t("personal.placeholders.select") },
      {
        value: t("personal.options.gender.female"),
        label: t("personal.options.gender.female"),
      },
      {
        value: t("personal.options.gender.male"),
        label: t("personal.options.gender.male"),
      },
    ],
    [i18n.language]
  );
  const maritalOptions = useMemo(
    () => [
      { value: "", label: t("personal.placeholders.select") },
      {
        value: t("personal.options.marital.single"),
        label: t("personal.options.marital.single"),
      },
      {
        value: t("personal.options.marital.married"),
        label: t("personal.options.marital.married"),
      },
      {
        value: t("personal.options.marital.divorced"),
        label: t("personal.options.marital.divorced"),
      },
      {
        value: t("personal.options.marital.widowed"),
        label: t("personal.options.marital.widowed"),
      },
    ],
    [i18n.language]
  );
  const childOptions = useMemo(() => {
    const base = [{ value: "", label: t("personal.placeholders.select") }];
    for (let i = 0; i <= 6; i++)
      base.push({ value: String(i), label: String(i) });
    base.push({ value: "7+", label: t("personal.options.childrenMore") });
    return base;
  }, [i18n.language]);

  const countryOptions = useMemo(
    () =>
      [{ value: "", label: t("personal.placeholders.select") }].concat(
        COUNTRY_OPTIONS.map((c) => ({ value: c, label: c }))
      ),
    [i18n.language]
  );

  const ilOptions = useMemo(
    () =>
      [{ value: "", label: t("personal.labels.selectProvince") }].concat(
        Object.keys(TR_IL_ILCE).map((il) => ({ value: il, label: il }))
      ),
    [i18n.language]
  );
  const ilceOptions = (il) =>
    [
      {
        value: "",
        label: il
          ? t("personal.labels.selectDistrict")
          : t("personal.labels.selectProvince"),
      },
    ].concat(
      (TR_IL_ILCE[il] || []).map((ilce) => ({ value: ilce, label: ilce }))
    );

  /* ---------- Seçimler (Doğum/İkamet/Uyruk) ---------- */
  const [birthCountry, setBirthCountry] = useState("");
  const [birthCountryOther, setBirthCountryOther] = useState("");
  const [birthProvince, setBirthProvince] = useState("");
  const [birthDistrict, setBirthDistrict] = useState("");
  const [birthPlaceOther, setBirthPlaceOther] = useState("");

  const [resCountry, setResCountry] = useState("");
  const [resCountryOther, setResCountryOther] = useState("");
  const [resProvince, setResProvince] = useState("");
  const [resDistrict, setResDistrict] = useState("");
  const [resPlaceOther, setResPlaceOther] = useState("");

  const [nationalitySel, setNationalitySel] = useState("");
  const [nationalityOther, setNationalityOther] = useState("");

  const syncField = (patch) => {
    setFormData((p) => ({ ...p, ...patch }));
    Object.entries(patch).forEach(([k, v]) => validateField(k, v));
  };

  const syncBirthToForm = () => {
    const country = birthCountry === "Diğer" ? birthCountryOther : birthCountry;
    const city =
      birthCountry === "Türkiye"
        ? (birthProvince &&
            birthDistrict &&
            `${birthProvince}/${birthDistrict}`) ||
          birthProvince ||
          ""
        : birthPlaceOther || "";
    syncField({ dogumUlke: country || "", dogumSehir: city || "" });
  };

  const syncResToForm = () => {
    const country = resCountry === "Diğer" ? resCountryOther : resCountry;
    const city =
      resCountry === "Türkiye"
        ? (resProvince && resDistrict && `${resProvince}/${resDistrict}`) ||
          resProvince ||
          ""
        : resPlaceOther || "";
    syncField({ ikametUlke: country || "", ikametSehir: city || "" });
  };

  const syncNationalityToForm = (
    sel = nationalitySel,
    other = nationalityOther
  ) => {
    const val = sel === "Diğer" ? other || "" : sel || "";
    syncField({ uyruk: val });
  };

  /* ---------- Fotoğraf ---------- */
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFotoError(t("personal.photo.typeErr"));
      setFormData((p) => ({ ...p, foto: null }));
      setFotoPreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFotoError(t("personal.photo.sizeErr"));
      setFormData((p) => ({ ...p, foto: null }));
      setFotoPreview(null);
      return;
    }
    setFotoError("");
    setFormData((prev) => ({ ...prev, foto: file }));
    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------- Zod Şema (i18n’li) ---------- */
  const schema = useMemo(() => {
    return z.object({
      ad: z
        .string()
        .min(1, t("personal.errors.firstName.required"))
        .max(30, t("personal.errors.firstName.max"))
        .regex(
          /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/,
          t("personal.errors.firstName.regex")
        ),
      soyad: z
        .string()
        .min(1, t("personal.errors.lastName.required"))
        .max(30, t("personal.errors.lastName.max"))
        .regex(
          /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/,
          t("personal.errors.lastName.regex")
        ),
      eposta: z.string().email(t("personal.errors.email.invalid")),
      telefon: z
        .string()
        .min(1, t("personal.errors.phone.required"))
        .transform((v) => v.replace(/[\s()-]/g, ""))
        .refine((v) => /^\+[1-9]\d{6,14}$/.test(v), {
          message: t("personal.errors.phone.format"),
        }),
      // --- DÜZELTME BAŞLANGICI ---
      whatsapp: z
        .string()
        .min(1, t("personal.errors.whatsapp.required")) // Zorunlu hale getirildi
        .transform((v) => v.replace(/[\s()-]/g, ""))
        .refine((v) => /^\+[1-9]\d{6,14}$/.test(v), {
          message: t("personal.errors.whatsapp.format"),
        }),
      // --- DÜZELTME BİTİŞİ ---
      adres: z
        .string()
        .min(5, t("personal.errors.address.min"))
        .max(90, t("personal.errors.address.max")),
      cinsiyet: z.string().min(1, t("personal.errors.gender.required")),
      medeniDurum: z.string().min(1, t("personal.errors.marital.required")),
      dogumTarihi: z
        .string()
        .min(1, t("personal.errors.birthDate.required"))
        .refine((date) => {
          if (!date) return false;
          const d = new Date(date);
          const min = new Date("1950-01-01");
          const today = new Date();
          return d >= min && d <= today;
        }, t("personal.errors.birthDate.range"))
        .refine((date) => {
          const d = new Date(date + "T00:00:00");
          if (Number.isNaN(d.getTime())) return false;
          const yBirth = d.getFullYear();
          const now = new Date();
          const yNow = now.getFullYear();
          return yNow - yBirth >= 15;
        }, t("personal.errors.birthDate.minAge")),
      cocukSayisi: z.string().optional(),
      dogumUlke: z.string().min(1, t("personal.errors.birthCountry")),
      dogumSehir: z.string().min(1, t("personal.errors.birthCity")),
      ikametUlke: z.string().min(1, t("personal.errors.resCountry")),
      ikametSehir: z.string().min(1, t("personal.errors.resCity")),
      uyruk: z.string().min(1, t("personal.errors.nationality")),
    });
  }, [i18n.language, t]);

  useImperativeHandle(ref, () => ({
    isValid: () => {
      const result = schema.safeParse(formData);
      const newErrors = {};
      if (!result.success) {
        result.error.issues.forEach((i) => {
          newErrors[i.path[0]] = i.message;
        });
        setErrors(newErrors);
      }
      const fotoValid = !!formData.foto;
      if (!fotoValid && !fotoError) setFotoError(t("personal.photo.required"));
      return result.success && fotoValid;
    },
  }));

  useEffect(() => {
    const ok = schema.safeParse(formData).success && !!formData.foto;
    onValidChange?.(ok);
  }, [formData, schema, onValidChange]);

  const validateField = (name, value) => {
    const result = schema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === name);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError ? fieldError.message : "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none overscroll-contain">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Foto */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 bg-gray-100 shadow-md flex items-center justify-center">
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt={t("personal.labels.photo")}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                {t("personal.placeholders.noPhoto")}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="foto"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              {t("personal.labels.photo")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="foto"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
              >
                📤{" "}
                {fotoPreview
                  ? t("personal.placeholders.replace")
                  : t("personal.placeholders.upload")}
              </label>
              <input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handleFotoUpload}
                className="hidden"
              />
            </div>
            {fotoError && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {fotoError}
              </p>
            )}
            {!formData.foto && !fotoError && (
              <p className="text-xs text-gray-400 mt-1">
                {t("personal.photo.hint")}
              </p>
            )}
          </div>
        </div>

        {/* Ad / Soyad */}
        <InputField
          label={t("personal.labels.firstName")}
          name="ad"
          value={formData.ad}
          placeholder={t("personal.placeholders.firstName")}
          onChange={handleChange}
          error={errors.ad}
          max={30}
        />
        <InputField
          label={t("personal.labels.lastName")}
          name="soyad"
          value={formData.soyad}
          placeholder={t("personal.placeholders.lastName")}
          onChange={handleChange}
          error={errors.soyad}
          max={30}
        />

        {/* E-posta / Telefon / WhatsApp */}
        <InputField
          label={t("personal.labels.email")}
          name="eposta"
          type="email"
          value={formData.eposta}
          placeholder={t("personal.placeholders.email")}
          onChange={handleChange}
          error={errors.eposta}
        />
        <InputField
          label={t("personal.labels.phone")}
          name="telefon"
          type="tel"
          value={formData.telefon}
          placeholder={t("personal.placeholders.phone")}
          onChange={handleChange}
          error={errors.telefon}
        />
        <InputField
          label={t("personal.labels.whatsapp")}
          name="whatsapp"
          type="tel"
          value={formData.whatsapp}
          placeholder={t("personal.placeholders.whatsapp")}
          onChange={handleChange}
          error={errors.whatsapp}
        />

        {/* Adres */}
        <InputField
          label={t("personal.labels.address")}
          name="adres"
          value={formData.adres}
          placeholder={t("personal.placeholders.address")}
          onChange={handleChange}
          error={errors.adres}
          max={90}
        />

        {/* Doğum Tarihi */}
        <div className="shadow-none outline-none">
          <MuiDateStringField
            label={t("personal.labels.birthDate")}
            name="dogumTarihi"
            value={formData.dogumTarihi}
            onChange={handleChange}
            required
            error={errors.dogumTarihi}
            min="1950-01-01"
            max="2025-12-31"
            size="small"
          />
        </div>

        {/* Cinsiyet / Medeni / Çocuk */}
        <SearchSelect
          label={t("personal.labels.gender")}
          name="cinsiyet"
          value={formData.cinsiyet}
          options={genderOptions}
          onChange={handleChange}
          placeholder={t("personal.placeholders.select")}
          menuPortalTarget={portalTarget}
        />
        <SearchSelect
          label={t("personal.labels.marital")}
          name="medeniDurum"
          value={formData.medeniDurum}
          options={maritalOptions}
          onChange={handleChange}
          placeholder={t("personal.placeholders.select")}
          menuPortalTarget={portalTarget}
        />
        <SearchSelect
          label={t("personal.labels.children")}
          name="cocukSayisi"
          value={formData.cocukSayisi}
          options={childOptions}
          onChange={handleChange}
          placeholder={t("personal.placeholders.select")}
          menuPortalTarget={portalTarget}
        />

        {/* Uyruk */}
        <div className="lg:col-span-1 mt-1">
          <label className="block text-sm font-bold text-gray-700 ">
            {t("personal.labels.nationality")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchSelect
              name="uyrukSelect"
              value={nationalitySel}
              onChange={(e) => {
                const v = e.target.value;
                setNationalitySel(v);
                if (v !== "Diğer") setNationalityOther("");
                syncNationalityToForm(v, v === "Diğer" ? nationalityOther : "");
              }}
              options={[
                { value: "", label: t("personal.placeholders.select") },
                ...Object.values(NATIONALITY_MAP).map((n) => ({
                  value: n,
                  label: n,
                })),
              ]}
              placeholder={t("personal.placeholders.select")}
              menuPortalTarget={portalTarget}
            />
            <input
              type="text"
              placeholder={t("personal.placeholders.countryOther")}
              value={nationalityOther}
              onChange={(e) => {
                const v = onlyLettersTR(e.target.value);
                setNationalityOther(v);
                syncNationalityToForm("Diğer", v);
              }}
              disabled={nationalitySel !== "Diğer"}
              className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                nationalitySel === "Diğer"
                  ? "bg-white border-gray-300 text-gray-900 hover:border-black"
                  : "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
              }`}
            />
          </div>
          {errors.uyruk && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.uyruk}
            </p>
          )}
        </div>

        {/* Ülke (Doğum) */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.birthCountry")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchSelect
              name="dogumUlke"
              value={birthCountry}
              options={countryOptions}
              onChange={(e) => {
                const v = e.target.value;
                setBirthCountry(v);
                setBirthCountryOther("");
                setBirthProvince("");
                setBirthDistrict("");
                setBirthPlaceOther("");
                syncField({
                  dogumUlke: v === "Diğer" ? "" : v,
                  dogumSehir: "",
                });
              }}
              placeholder={t("personal.placeholders.countrySearch")}
              menuPortalTarget={portalTarget}
            />
            <input
              type="text"
              placeholder={t("personal.placeholders.countryOther")}
              value={birthCountryOther}
              onChange={(e) => {
                const v = onlyLettersTR(e.target.value);
                setBirthCountryOther(v);
                syncBirthToForm();
              }}
              disabled={birthCountry !== "Diğer"}
              className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                birthCountry === "Diğer"
                  ? "bg-white border-gray-300 text-gray-900 hover:border-black"
                  : "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
              }`}
            />
          </div>
          {errors.dogumUlke && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.dogumUlke}
            </p>
          )}
        </div>

        {/* Şehir (Doğum Yeri) */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.birthCity")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {birthCountry === "Türkiye" ? (
              <>
                <SearchSelect
                  name="dogumIl"
                  value={birthProvince}
                  onChange={(e) => {
                    setBirthProvince(e.target.value);
                    setBirthDistrict("");
                    syncBirthToForm();
                  }}
                  options={ilOptions}
                  placeholder={t("personal.labels.selectProvince")}
                  menuPortalTarget={portalTarget}
                />
                <SearchSelect
                  name="dogumIlce"
                  value={birthDistrict}
                  onChange={(e) => {
                    setBirthDistrict(e.target.value);
                    syncBirthToForm();
                  }}
                  options={ilceOptions(birthProvince)}
                  placeholder={
                    birthProvince
                      ? t("personal.labels.selectDistrict")
                      : t("personal.labels.selectProvince")
                  }
                  menuPortalTarget={portalTarget}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder={t("personal.placeholders.cityOther")}
                  value={birthPlaceOther}
                  onChange={(e) => {
                    const v = onlyLettersTR(e.target.value);
                    setBirthPlaceOther(v);
                    syncBirthToForm();
                  }}
                  disabled={
                    !birthCountry ||
                    (birthCountry === "Diğer" && !birthCountryOther)
                  }
                  className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                    !birthCountry ||
                    (birthCountry === "Diğer" && !birthCountryOther)
                      ? "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-900 hover:border-black"
                  }`}
                />
                <div className="hidden sm:block" />
              </>
            )}
          </div>
          {errors.dogumSehir && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.dogumSehir}
            </p>
          )}
        </div>

        {/* Yaşadığı Ülke */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.resCountry")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchSelect
              name="ikametUlke"
              value={resCountry}
              options={countryOptions}
              onChange={(e) => {
                const v = e.target.value;
                setResCountry(v);
                setResCountryOther("");
                setResProvince("");
                setResDistrict("");
                setResPlaceOther("");
                syncField({
                  ikametUlke: v === "Diğer" ? "" : v,
                  ikametSehir: "",
                });
              }}
              placeholder={t("personal.placeholders.countrySearch")}
              menuPortalTarget={portalTarget}
            />
            <input
              type="text"
              placeholder={t("personal.placeholders.countryOther")}
              value={resCountryOther}
              onChange={(e) => {
                const v = onlyLettersTR(e.target.value);
                setResCountryOther(v);
                syncResToForm();
              }}
              disabled={resCountry !== "Diğer"}
              className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                resCountry === "Diğer"
                  ? "bg-white border-gray-300 text-gray-900 hover:border-black"
                  : "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
              }`}
            />
          </div>
          {errors.ikametUlke && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.ikametUlke}
            </p>
          )}
        </div>

        {/* Yaşadığı Şehir */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.resCity")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resCountry === "Türkiye" ? (
              <>
                <SearchSelect
                  name="ikametIl"
                  value={resProvince}
                  onChange={(e) => {
                    setResProvince(e.target.value);
                    setResDistrict("");
                    syncResToForm();
                  }}
                  options={ilOptions}
                  placeholder={t("personal.labels.selectProvince")}
                  menuPortalTarget={portalTarget}
                />
                <SearchSelect
                  name="ikametIlce"
                  value={resDistrict}
                  onChange={(e) => {
                    setResDistrict(e.target.value);
                    syncResToForm();
                  }}
                  options={ilceOptions(resProvince)}
                  placeholder={
                    resProvince
                      ? t("personal.labels.selectDistrict")
                      : t("personal.labels.selectProvince")
                  }
                  menuPortalTarget={portalTarget}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder={t("personal.placeholders.cityOther")}
                  value={resPlaceOther}
                  onChange={(e) => {
                    const v = onlyLettersTR(e.target.value);
                    setResPlaceOther(v);
                    syncResToForm();
                  }}
                  disabled={
                    !resCountry || (resCountry === "Diğer" && !resCountryOther)
                  }
                  className={`block w-full h-[43px] rounded-lg border px-3 py-2 focus:outline-none transition ${
                    !resCountry || (resCountry === "Diğer" && !resCountryOther)
                      ? "bg-gray-200 border-gray-300 text-gray-500 disabled:cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-900 hover:border-black"
                  }`}
                />
                <div className="hidden sm:block" />
              </>
            )}
          </div>
          {errors.ikametSehir && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.ikametSehir}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

function InputField({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  error,
  max,
}) {
  const length = typeof value === "string" ? value.length : 0;
  return (
    <div className="mt-0.5">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full h-[43px] rounded-lg border mt-0.5 px-3 py-2 bg-white text-gray-900 focus:outline-none transition border-gray-300 hover:border-black"
      />
      {typeof max === "number" ? (
        <div className="mt-1 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          ) : (
            <span />
          )}
          <p
            className={`text-xs ${
              length >= max ? "text-red-500" : "text-gray-400"
            }`}
          >
            {length}/{max}
          </p>
        </div>
      ) : (
        error && (
          <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
        )
      )}
    </div>
  );
}

export default PersonalInformation;
