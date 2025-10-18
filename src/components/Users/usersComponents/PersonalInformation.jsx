import { forwardRef, useImperativeHandle, useState } from "react";
import CountryCitySelect from "../Selected/CountryCitySelect";
import NationalitySelect from "../Selected/NationalitySelect";

const PersonalInformation = forwardRef(function PersonalInformation(_, ref) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsappPhone: "",
    address: "",
    gender: "",
    maritalStatus: "",
    birthDate: "",
    nationality: "",
    children: "",
  });

  const [, setBirth] = useState({ country: "", city: "" });
  const [, setResidence] = useState({ country: "", city: "" });
  const [, setNationality] = useState("");
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: value.trim() === "" }));
  };

  // 🔹 Ref ile dışarıdan kontrol fonksiyonu sağla
  useImperativeHandle(ref, () => ({
    isValid: () => {
      // Zorunlu alanlardan en az biri boşsa false döner
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "gender",
        "maritalStatus",
        "birthDate",
      ];

      return requiredFields.every(
        (key) => formData[key] && formData[key].trim() !== ""
      );
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ad */}
        <InputField
          label="Ad"
          name="firstName"
          value={formData.firstName}
          placeholder="Adınızı giriniz"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.firstName}
          maxLength={30}
        />

        {/* Soyad */}
        <InputField
          label="Soyad"
          name="lastName"
          value={formData.lastName}
          placeholder="Soyadınızı giriniz"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.lastName}
          maxLength={30}
        />

        {/* E-posta */}
        <InputField
          label="E-posta"
          name="email"
          type="email"
          value={formData.email}
          placeholder="ornek@mail.com"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.email}
          maxLength={50}
        />

        {/* Telefon */}
        <InputField
          label="Telefon"
          name="phone"
          type="tel"
          value={formData.phone}
          placeholder="05xx xxx xx xx"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.phone}
          maxLength={15}
        />

        {/* WhatsApp Telefon */}
        <InputField
          label="WhatsApp Telefon"
          name="whatsappPhone"
          type="tel"
          value={formData.whatsappPhone}
          placeholder="+90 5xx xxx xx xx"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.whatsappPhone}
          maxLength={15}
        />

        {/* Adres */}
        <InputField
          label="Adres"
          name="address"
          value={formData.address}
          placeholder="Mahalle / Cadde / No"
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.address}
          maxLength={80}
        />

        {/* Cinsiyet */}
        <SelectField
          label="Cinsiyet"
          name="gender"
          value={formData.gender}
          options={[
            { value: "female", label: "Kadın" },
            { value: "male", label: "Erkek" },
          ]}
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.gender}
        />

        {/* Medeni Durum */}
        <SelectField
          label="Medeni Durum"
          name="maritalStatus"
          value={formData.maritalStatus}
          options={[
            { value: "single", label: "Bekâr" },
            { value: "married", label: "Evli" },
            { value: "divorced", label: "Boşanmış" },
            { value: "widowed", label: "Dul" },
          ]}
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.maritalStatus}
        />

        {/* Doğum Tarihi */}
        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Doğum Tarihi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            required
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none transition cursor-pointer"
          />
          {touched.birthDate && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Zorunlu alan, lütfen doldurunuz.
            </p>
          )}
        </div>

        {/* Doğum Yeri */}
        <CountryCitySelect
          countryLabel="Ülke (Doğum)"
          cityLabel="Şehir (Doğum Yeri)"
          countryId="countryOfBirth"
          cityId="birthPlace"
          onChange={setBirth}
          required
        />

        {/* Yaşadığı Yer */}
        <CountryCitySelect
          countryLabel="Yaşadığı Ülke"
          cityLabel="Yaşadığı Şehir"
          countryId="residenceCountry"
          cityId="residenceCity"
          onChange={setResidence}
          required
        />

        {/* Uyruğu */}
        <NationalitySelect
          label="Uyruğu"
          id="nationality"
          name="nationality"
          defaultValue=""
          onChange={setNationality}
          required
        />

        {/* Çocuk Sayısı */}
        <SelectField
          label="Çocuk Sayısı"
          name="children"
          value={formData.children}
          options={[...Array(8)].map((_, i) => ({
            value: i === 7 ? "7+" : i,
            label: i === 7 ? "Daha Fazla" : i.toString(),
          }))}
          onChange={handleChange}
          onBlur={handleBlur}
          showError={touched.children}
        />
      </div>
    </div>
  );
});

/* --- Input Field --- */
function InputField({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  onBlur,
  showError,
  maxLength = 50,
}) {
  const remaining = maxLength - value.length;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required
        maxLength={maxLength}
        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition cursor-pointer"
      />

      <div className="flex justify-between items-center mt-1">
        {showError && (
          <p className="text-xs text-red-600 font-medium">
            Zorunlu alan, lütfen doldurunuz.
          </p>
        )}
        <p
          className={`text-xs ${
            remaining <= 5 ? "text-red-500" : "text-gray-400"
          }`}
        >
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}

/* --- Select Field --- */
function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  showError,
}) {
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
        onBlur={onBlur}
        required
        className="block w-full h-[43px] rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:outline-none transition cursor-pointer"
      >
        <option value="" disabled>
          Seçiniz
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {showError && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          Zorunlu alan, lütfen seçim yapınız.
        </p>
      )}
    </div>
  );
}

export default PersonalInformation;
