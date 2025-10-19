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
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [touched, setTouched] = useState({});

  const [, setBirth] = useState({ country: "", city: "" });
  const [, setResidence] = useState({ country: "", city: "" });
  const [, setNationality] = useState("");

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: value.trim() === "" }));
  };

  // 📸 Fotoğraf yükleme işlemi
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Lütfen yalnızca görüntü dosyası yükleyiniz (JPG, PNG).");
      setFormData((p) => ({ ...p, photo: null }));
      setPhotoPreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Fotoğraf boyutu 2 MB'den küçük olmalıdır.");
      setFormData((p) => ({ ...p, photo: null }));
      setPhotoPreview(null);
      return;
    }

    setPhotoError("");
    setFormData((prev) => ({ ...prev, photo: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔹 Ref ile dışarıdan kontrol fonksiyonu sağla
  useImperativeHandle(ref, () => ({
    isValid: () => {
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

      const basicValid = requiredFields.every(
        (key) => formData[key] && formData[key].trim() !== ""
      );

      const photoValid = !!formData.photo;

      // Eğer foto eksikse uyarıyı aktif et
      if (!photoValid && !photoError) {
        setPhotoError("Zorunlu alan, lütfen vesikalık yükleyiniz.");
      }

      return basicValid && photoValid;
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none">
      {/* --- Form Alanları --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* --- Vesikalık Fotoğraf Alanı --- */}
        <div className="flex flex-col sm:flex-row items-start gap-6 ">
          {/* Kare önizleme kutusu */}
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 bg-gray-100 shadow-md flex items-center justify-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Vesikalık"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                Fotoğraf Yok
              </span>
            )}
          </div>

          {/* Fotoğraf yükleme alanı */}
          <div className="flex flex-col">
            <label
              htmlFor="photo"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Vesikalık Fotoğraf <span className="text-red-500">*</span>
            </label>

            {/* Dosya input (Yükle butonlu) */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="photo"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
              >
                📤 {photoPreview ? "Değiştir" : "Yükle"}
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Hata veya bilgi mesajları */}
            {photoError && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {photoError}
              </p>
            )}
            {!formData.photo && !photoError && (
              <p className="text-xs text-gray-400 mt-1">
                * Maksimum 2 MB, JPG veya PNG olmalıdır.
              </p>
            )}
          </div>
        </div>
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
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none transition cursor-pointer"
          />
          {touched.birthDate && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Zorunlu alan, lütfen doldurunuz.
            </p>
          )}
        </div>

        <CountryCitySelect
          countryLabel="Ülke (Doğum)"
          cityLabel="Şehir (Doğum Yeri)"
          countryId="countryOfBirth"
          cityId="birthPlace"
          onChange={setBirth}
          required
        />

        <CountryCitySelect
          countryLabel="Yaşadığı Ülke"
          cityLabel="Yaşadığı Şehir"
          countryId="residenceCountry"
          cityId="residenceCity"
          onChange={setResidence}
          required
        />

        <NationalitySelect
          label="Uyruğu"
          id="nationality"
          name="nationality"
          defaultValue=""
          onChange={setNationality}
          required
        />

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
      <label htmlFor={name} className="block text-sm font-bold text-gray-700">
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
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900  focus:outline-none transition cursor-pointer"
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
        className="block w-full h-[43px] rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none transition cursor-pointer"
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
