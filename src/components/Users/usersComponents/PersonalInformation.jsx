import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import CountryCitySelect from "../Selected/CountryCitySelect";
import NationalitySelect from "../Selected/NationalitySelect";

// Zod doğrulama şeması
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
    .transform((v) => v.replace(/[\s()-]/g, "")) // boşluk, parantez, tire temizle
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
    .refine((d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cutoff = new Date(
        today.getFullYear() - 15,
        today.getMonth(),
        today.getDate()
      );
      return d <= cutoff; // en az 15 yaş
    }, "En az 15 yaşında olmalısınız."),
  cocukSayisi: z.string().optional(),
});

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
  });

  const [errors, setErrors] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoError, setFotoError] = useState("");
  const [, setDogumYeri] = useState({ country: "", city: "" });
  const [, setIkamet] = useState({ country: "", city: "" });
  const [, setUyruk] = useState("");

  // Zod doğrulaması
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

  // Fotoğraf yükleme işlemi
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

  // Ref ile dışarıdan kontrol fonksiyonu
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

  // Her değişiklikte anlık doğrulama
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vesikalık Fotoğraf Alanı */}
        <div className="flex flex-col sm:flex-row items-start gap-6 ">
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

        <InputField
          label="Ad"
          name="ad"
          value={formData.ad}
          placeholder="Adınızı giriniz"
          onChange={handleChange}
          error={errors.ad}
        />

        <InputField
          label="Soyad"
          name="soyad"
          value={formData.soyad}
          placeholder="Soyadınızı giriniz"
          onChange={handleChange}
          error={errors.soyad}
        />

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

        <InputField
          label="Adres"
          name="adres"
          value={formData.adres}
          placeholder="Mahalle / Cadde / No"
          onChange={handleChange}
          error={errors.adres}
        />

        <SelectField
          label="Cinsiyet"
          name="cinsiyet"
          value={formData.cinsiyet}
          options={[
            { value: "", label: "Seçiniz" },
            { value: "Kadın", label: "Kadın" },
            { value: "Erkek", label: "Erkek" },
          ]}
          onChange={handleChange}
          error={errors.cinsiyet}
        />

        <SelectField
          label="Medeni Durum"
          name="medeniDurum"
          value={formData.medeniDurum}
          options={[
            { value: "", label: "Seçiniz" },
            { value: "Bekâr", label: "Bekâr" },
            { value: "Evli", label: "Evli" },
            { value: "Boşanmış", label: "Boşanmış" },
            { value: "Dul", label: "Dul" },
          ]}
          onChange={handleChange}
          error={errors.medeniDurum}
        />

        <InputField
          label="Doğum Tarihi"
          name="dogumTarihi"
          type="date"
          value={formData.dogumTarihi}
          onChange={handleChange}
          error={errors.dogumTarihi}
        />

        <CountryCitySelect
          countryLabel="Ülke (Doğum)"
          cityLabel="Şehir (Doğum Yeri)"
          countryId="dogumUlke"
          cityId="dogumSehir"
          onChange={setDogumYeri}
          required
        />

        <CountryCitySelect
          countryLabel="Yaşadığı Ülke"
          cityLabel="Yaşadığı Şehir"
          countryId="ikametUlke"
          cityId="ikametSehir"
          onChange={setIkamet}
          required
        />

        <NationalitySelect
          label="Uyruğu"
          id="uyruk"
          name="uyruk"
          defaultValue=""
          onChange={setUyruk}
          required
        />

        <SelectField
          label="Çocuk Sayısı"
          name="cocukSayisi"
          value={formData.cocukSayisi}
          options={[...Array(8)].map((_, i) => ({
            value: i === 7 ? "7+" : i,
            label: i === 7 ? "Daha Fazla" : i.toString(),
          }))}
          onChange={handleChange}
          error={errors.cocukSayisi}
        />
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
}) {
  return (
    <div>
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
        className="block w-full  rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none transition"
      />

      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}

function SelectField({ label, name, value, options, onChange, error }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full h-[43px] rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}

export default PersonalInformation;
