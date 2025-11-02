// components/Users/PersonalInformation.jsx
import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import MuiDateStringField from "../Date/MuiDateStringField";
import ScrollSelect from "../Selected/ScrollSelect";

/* -------------------- Sabit Veriler -------------------- */
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

// Ülke -> Uyruk eşleşmesi (select’te göstereceğiz)
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

/* -------------------- Yardımcı -------------------- */
const onlyLettersTR = (s) => s.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");

/* -------------------- Zod Şema -------------------- */
const schema = z.object({
  ad: z
    .string()
    .min(1, "Ad gerekli")
    .max(30, "Ad en fazla 30 karakter olabilir")
    .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "Ad yalnızca harflerden oluşmalı"),
  soyad: z
    .string()
    .min(1, "Soyad gerekli")
    .max(30, "Soyad en fazla 30 karakter olabilir")
    .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "Soyad yalnızca harflerden oluşmalı"),
  eposta: z.string().email("Geçerli bir e-posta adresi giriniz"),
  telefon: z
    .string()
    .min(1, "Telefon gerekli")
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine((v) => /^\+[1-9]\d{6,14}$/.test(v), {
      message: "Telefon numarasını ülke kodu ile yazın (örn: +905XXXXXXXXX).",
    }),
  whatsapp: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/[\s()-]/g, "") : v))
    .refine((v) => !v || /^\+[1-9]\d{6,14}$/.test(v), {
      message: "WhatsApp numarasını ülke kodu ile yazın (örn: +905XXXXXXXXX).",
    }),
  adres: z
    .string()
    .min(5, "Adres en az 5 karakter olmalıdır")
    .max(90, "Adres en fazla 90 karakter olabilir"),
  cinsiyet: z.string().min(1, "Cinsiyet seçiniz"),
  medeniDurum: z.string().min(1, "Medeni durum seçiniz"),
  dogumTarihi: z
    .string()
    .min(1, "Doğum tarihi gerekli")
    .refine((date) => {
      if (!date) return false;
      const d = new Date(date);
      const min = new Date("1950-01-01");
      const today = new Date();
      return d >= min && d <= today;
    }, "Doğum tarihi 1950'den önce veya bugünden ileri olamaz")
    .refine((date) => {
      const d = new Date(date + "T00:00:00");
      if (Number.isNaN(d.getTime())) return false;
      const yBirth = d.getFullYear();
      const now = new Date();
      const yNow = now.getFullYear();
      const yearDiff = yNow - yBirth;
      return yearDiff >= 15;
    }, "En az 15 yaşında olmalısınız."),
  cocukSayisi: z.string().optional(),

  dogumUlke: z.string().min(1, "Doğum ülkesi zorunlu"),
  dogumSehir: z.string().min(1, "Doğum yeri (İl/İlçe) zorunlu"),
  ikametUlke: z.string().min(1, "Yaşadığı ülke zorunlu"),
  ikametSehir: z.string().min(1, "Yaşadığı şehir (İl/İlçe) zorunlu"),

  uyruk: z.string().min(1, "Uyruğu seçiniz"),
});

/* -------------------- Bileşen -------------------- */
const PersonalInformation = forwardRef(function PersonalInformation(_, ref) {
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

    dogumUlke: "Türkiye",
    dogumSehir: "",
    ikametUlke: "Türkiye",
    ikametSehir: "",
  });

  const [errors, setErrors] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoError, setFotoError] = useState("");

  /* ---------- Doğum ---------- */
  const [birthCountry, setBirthCountry] = useState("Türkiye");
  const [birthCountryOther, setBirthCountryOther] = useState("");
  const [birthProvince, setBirthProvince] = useState("");
  const [birthDistrict, setBirthDistrict] = useState("");
  const [birthPlaceOther, setBirthPlaceOther] = useState("");

  /* ---------- İkamet ---------- */
  const [resCountry, setResCountry] = useState("Türkiye");
  const [resCountryOther, setResCountryOther] = useState("");
  const [resProvince, setResProvince] = useState("");
  const [resDistrict, setResDistrict] = useState("");
  const [resPlaceOther, setResPlaceOther] = useState("");

  /* ---------- Uyruk ---------- */
  const NATIONALITY_OPTIONS = Object.values(NATIONALITY_MAP);
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

  /* -------------------- Fotoğraf -------------------- */
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFotoError("Lütfen yalnızca JPG veya PNG dosyası yükleyiniz");
      setFormData((p) => ({ ...p, foto: null }));
      setFotoPreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFotoError("Fotoğraf boyutu 2 MB'den küçük olmalıdır");
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

  /* -------------------- Ref API -------------------- */
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
      if (!fotoValid && !fotoError)
        setFotoError("Zorunlu alan, lütfen vesikalık yükleyiniz");
      return result.success && fotoValid;
    },
  }));

  /* -------------------- Generic change -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

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

  /* -------------------- Options Helpers -------------------- */
  const countryOptions = COUNTRY_OPTIONS.map((c) => ({ value: c, label: c }));
  const genderOptions = [
    { value: "", label: "Seçiniz" },
    { value: "Kadın", label: "Kadın" },
    { value: "Erkek", label: "Erkek" },
  ];
  const maritalOptions = [
    { value: "", label: "Seçiniz" },
    { value: "Bekâr", label: "Bekâr" },
    { value: "Evli", label: "Evli" },
    { value: "Boşanmış", label: "Boşanmış" },
    { value: "Dul", label: "Dul" },
  ];
  const childOptions = [...Array(8)].map((_, i) => ({
    value: i === 7 ? "7+" : String(i),
    label: i === 7 ? "Daha Fazla" : String(i),
  }));
  const ilOptions = Object.keys(TR_IL_ILCE).map((il) => ({
    value: il,
    label: il,
  }));
  const ilceOptions = (il) =>
    (TR_IL_ILCE[il] || []).map((ilce) => ({ value: ilce, label: ilce }));

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none overscroll-contain">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* --- Foto --- */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 bg-gray-100 shadow-md flex items-center justify-center">
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Vesikalık"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                Fotoğraf Yok
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="foto"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Vesikalık Fotoğraf <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="foto"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
              >
                📤 {fotoPreview ? "Değiştir" : "Yükle"}
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
                * Maksimum 2 MB, JPG veya PNG olmalıdır.
              </p>
            )}
          </div>
        </div>

        {/* Ad / Soyad */}
        <InputField
          label="Ad"
          name="ad"
          value={formData.ad}
          placeholder="Adınızı giriniz"
          onChange={handleChange}
          error={errors.ad}
          max={30}
        />
        <InputField
          label="Soyad"
          name="soyad"
          value={formData.soyad}
          placeholder="Soyadınızı giriniz"
          onChange={handleChange}
          error={errors.soyad}
          max={30}
        />

        {/* E-posta / Telefon / WhatsApp */}
        <InputField
          label="E-posta"
          name="eposta"
          type="email"
          value={formData.eposta}
          placeholder="ornek@mail.com"
          onChange={handleChange}
          error={errors.eposta}
        />
        <InputField
          label="Telefon"
          name="telefon"
          type="tel"
          value={formData.telefon}
          placeholder="+XX XXXXXXXX"
          onChange={handleChange}
          error={errors.telefon}
        />
        <InputField
          label="WhatsApp Telefon"
          name="whatsapp"
          type="tel"
          value={formData.whatsapp}
          placeholder="+XX XXXXXXXX"
          onChange={handleChange}
          error={errors.whatsapp}
        />

        {/* Adres */}
        <InputField
          label="Adres"
          name="adres"
          value={formData.adres}
          placeholder="Mahalle / Cadde / No"
          onChange={handleChange}
          error={errors.adres}
          max={90}
        />
        {/* Doğum Tarihi (MUI) */}
        <div className="shadow-none outline-none">
          <MuiDateStringField
            label="Doğum Tarihi"
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

        {/* Cinsiyet / Medeni Durum (ScrollSelect) */}
        <ScrollSelect
          label="Cinsiyet"
          name="cinsiyet"
          value={formData.cinsiyet}
          options={genderOptions}
          onChange={handleChange}
          error={errors.cinsiyet}
        />
        <ScrollSelect
          label="Medeni Durum"
          name="medeniDurum"
          value={formData.medeniDurum}
          options={maritalOptions}
          onChange={handleChange}
          error={errors.medeniDurum}
        />

        {/* Çocuk Sayısı (ScrollSelect) */}
        <ScrollSelect
          label="Çocuk Sayısı"
          name="cocukSayisi"
          value={formData.cocukSayisi}
          onChange={handleChange}
          options={childOptions}
          error={errors.cocukSayisi}
        />

        {/* -------------------- UYRUĞU (ScrollSelect + Diğer input) -------------------- */}
        <div className="lg:col-span-1 mt-1">
          <label className="block text-sm font-bold text-gray-700 ">
            Uyruğu <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sol: ScrollSelect */}
            <ScrollSelect
              name="uyrukSelect"
              value={nationalitySel}
              onChange={(e) => {
                const v = e.target.value;
                setNationalitySel(v);
                if (v !== "Diğer") setNationalityOther("");
                syncNationalityToForm(v, v === "Diğer" ? nationalityOther : "");
              }}
              options={[
                { value: "", label: "Seçiniz" },
                ...Object.values(NATIONALITY_MAP).map((n) => ({
                  value: n,
                  label: n,
                })),
              ]}
              placeholder="Seçiniz"
            />

            {/* Sağ: “Diğer” input (sadece Diğer seçiliyse aktif) */}
            <input
              type="text"
              placeholder="Uyruğu (Diğer)"
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
            Ülke (Doğum) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ScrollSelect
              name="dogumUlke"
              value={birthCountry}
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
              options={[{ value: "", label: "Seçiniz" }, ...countryOptions]}
              placeholder="Seçiniz"
              error={errors.dogumUlke}
              showError={false}
            />

            <input
              type="text"
              placeholder="Ülke adı (Diğer)"
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
            Şehir (Doğum Yeri) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {birthCountry === "Türkiye" ? (
              <>
                <ScrollSelect
                  name="dogumIl"
                  value={birthProvince}
                  onChange={(e) => {
                    setBirthProvince(e.target.value);
                    setBirthDistrict("");
                    syncBirthToForm();
                  }}
                  options={[{ value: "", label: "İl Seçiniz" }, ...ilOptions]}
                  placeholder="İl Seçiniz"
                />

                <ScrollSelect
                  name="dogumIlce"
                  value={birthDistrict}
                  onChange={(e) => {
                    setBirthDistrict(e.target.value);
                    syncBirthToForm();
                  }}
                  options={[
                    {
                      value: "",
                      label: birthProvince ? "İlçe Seçiniz" : "Önce il seçiniz",
                    },
                    ...(birthProvince ? ilceOptions(birthProvince) : []),
                  ]}
                  placeholder={
                    birthProvince ? "İlçe Seçiniz" : "Önce il seçiniz"
                  }
                  disabled={!birthProvince}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="İl / İlçe"
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
            Yaşadığı Ülke <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ScrollSelect
              name="ikametUlke"
              value={resCountry}
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
              options={[{ value: "", label: "Seçiniz" }, ...countryOptions]}
              placeholder="Seçiniz"
              error={errors.ikametUlke}
              showError={false}
            />

            <input
              type="text"
              placeholder="Ülke adı (Diğer)"
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
            Yaşadığı Şehir <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resCountry === "Türkiye" ? (
              <>
                <ScrollSelect
                  name="ikametIl"
                  value={resProvince}
                  onChange={(e) => {
                    setResProvince(e.target.value);
                    setResDistrict("");
                    syncResToForm();
                  }}
                  options={[{ value: "", label: "İl Seçiniz" }, ...ilOptions]}
                  placeholder="İl Seçiniz"
                />

                <ScrollSelect
                  name="ikametIlce"
                  value={resDistrict}
                  onChange={(e) => {
                    setResDistrict(e.target.value);
                    syncResToForm();
                  }}
                  options={[
                    {
                      value: "",
                      label: resProvince ? "İlçe Seçiniz" : "Önce il seçiniz",
                    },
                    ...(resProvince ? ilceOptions(resProvince) : []),
                  ]}
                  placeholder={resProvince ? "İlçe Seçiniz" : "Önce il seçiniz"}
                  disabled={!resProvince}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="İl / İlçe"
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

/* -------------------- Alt Bileşenler -------------------- */
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
        // ❗ Hata olsa da kırmızı border yok: sabit gri kenarlık kullanıyoruz
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
