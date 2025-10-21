// components/Users/tables/OtherPersonalInformationTable.jsx
import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import Select from "react-select";

/* -------------------- ZOD ŞEMASI (PersonalInformation stili: string + refine) -------------------- */
const oneOf = (vals) => (v) => vals.includes(v);
const ALNUM_TR = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u;

const otherInfoSchema = z
  .object({
    // Multi-select: listedekilerden olmalı ve en az 1 seçim yapılmalı
    kktcGecerliBelge: z
      .array(
        z
          .string()
          .refine(
            oneOf([
              "Vatandaşlık",
              "Çalışma İzni",
              "Öğrenci Belgesi",
              "Belge Yok",
            ]),
            "KKTC Geçerli Belge seçiniz"
          )
      )
      .min(1, "KKTC Geçerli Belge seçiniz"),

    // Select’ler
    davaDurumu: z.string().refine(oneOf(["Yok", "Var"]), "Dava durumu seçiniz"),

    // Varsa: yalnızca harf/rakam/boşluk; yoksa sorun yok
    davaNedeni: z
      .string()
      .trim()
      .max(250, "En fazla 250 karakter yazabilirsiniz")
      .refine((v) => !v || ALNUM_TR.test(v), {
        message: "Sadece harf ve rakam kullanabilirsiniz",
      }),

    sigara: z
      .string()
      .refine(oneOf(["Evet", "Hayır"]), "Sigara için Evet veya Hayır seçiniz"),

    kaliciRahatsizlik: z
      .string()
      .refine(
        oneOf(["Evet", "Hayır"]),
        "Kalıcı rahatsızlık için Evet veya Hayır seçiniz"
      ),

    // Varsa: yalnızca harf/rakam/boşluk; yoksa sorun yok
    rahatsizlikAciklama: z
      .string()
      .trim()
      .max(250, "En fazla 250 karakter yazabilirsiniz")
      .refine((v) => !v || ALNUM_TR.test(v), {
        message: "Sadece harf ve rakam kullanabilirsiniz",
      }),

    ehliyet: z.string().refine(oneOf(["Var", "Yok"]), "Ehliyet durumu seçiniz"),

    askerlik: z
      .string()
      .refine(
        oneOf(["Yapıldı", "Yapılmadı", "Tecilli", "Muaf"]),
        "Askerlik durumu seçiniz"
      ),

    // Sayısal alanlar (string -> number dönüştür, aralık doğrula)
    boy: z.coerce
      .number({ invalid_type_error: "Boy sayı olmalıdır" })
      .int("Boy tam sayı olmalıdır")
      .min(120, "Boy en az 120 cm olmalıdır")
      .max(230, "Boy en fazla 230 cm olabilir"),

    kilo: z.coerce
      .number({ invalid_type_error: "Kilo sayı olmalıdır" })
      .int("Kilo tam sayı olmalıdır")
      .min(30, "Kilo en az 30 kg olmalıdır")
      .max(250, "Kilo en fazla 250 kg olabilir"),
  })
  .superRefine((data, ctx) => {
    // Dava = Var ise neden zorunlu ve min 3
    if (data.davaDurumu === "Var") {
      if (!data.davaNedeni || data.davaNedeni.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["davaNedeni"],
          message: "Dava nedeni en az 3 karakter olmalıdır",
        });
      }
    }
    // Kalıcı rahatsızlık = Evet ise açıklama zorunlu ve min 10
    if (data.kaliciRahatsizlik === "Evet") {
      if (
        !data.rahatsizlikAciklama ||
        data.rahatsizlikAciklama.trim().length < 10
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rahatsizlikAciklama"],
          message: "Rahatsızlık açıklaması en az 10 karakter olmalıdır",
        });
      }
    }
  });

/* -------------------- COMPONENT -------------------- */
const OtherPersonalInformationTable = forwardRef(
  function OtherPersonalInformationTable(_, ref) {
    const [formData, setFormData] = useState({
      kktcGecerliBelge: [],
      davaDurumu: "",
      davaNedeni: "",
      sigara: "",
      kaliciRahatsizlik: "",
      rahatsizlikAciklama: "",
      ehliyet: "",
      askerlik: "",
      boy: "",
      kilo: "",
    });

    const [errors, setErrors] = useState({});

    // Alan bazlı doğrulama (PersonalInformation.jsx ile uyumlu)
    const validateField = (name, value) => {
      const next = { ...formData, [name]: value };
      const result = otherInfoSchema.safeParse(next);

      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === name);
        setErrors((prev) => ({ ...prev, [name]: issue ? issue.message : "" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      // Koşullu alanları senkron tut (davaNedeni / rahatsizlikAciklama)
      if (name === "davaDurumu" || name === "davaNedeni") {
        const r = otherInfoSchema.safeParse(next);
        const msg = !r.success
          ? r.error.issues.find((i) => i.path[0] === "davaNedeni")?.message ||
            ""
          : "";
        setErrors((prev) => ({ ...prev, davaNedeni: msg }));
      }
      if (name === "kaliciRahatsizlik" || name === "rahatsizlikAciklama") {
        const r = otherInfoSchema.safeParse(next);
        const msg = !r.success
          ? r.error.issues.find((i) => i.path[0] === "rahatsizlikAciklama")
              ?.message || ""
          : "";
        setErrors((prev) => ({ ...prev, rahatsizlikAciklama: msg }));
      }
    };

    useImperativeHandle(ref, () => ({
      getData: () =>
        [formData].filter((d) =>
          Object.values(d).some((v) =>
            Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== ""
          )
        ),
      // Submit öncesi toplu doğrulama
      isValid: () => {
        const res = otherInfoSchema.safeParse(formData);
        const newErrors = {};
        if (!res.success) {
          res.error.issues.forEach((i) => {
            newErrors[i.path[0]] = i.message;
          });
          setErrors(newErrors);
        } else {
          setErrors({});
        }
        return res.success;
      },
    }));

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    };

    const handleMultiSelect = (selected) => {
      const values = selected ? selected.map((opt) => opt.value) : [];
      setFormData((prev) => ({ ...prev, kktcGecerliBelge: values }));
      validateField("kktcGecerliBelge", values);
    };

    // react-select (sadece kktcGecerliBelge için)
    const rsClassNames = {
      container: () => "w-full",
      control: () =>
        "w-full h-[43px] rounded-lg border border-gray-300 px-3 bg-white shadow-none focus:outline-none transition-none",
      valueContainer: () => "py-1 gap-1",
      placeholder: () => "text-gray-400",
      multiValue: () => "bg-gray-100 text-gray-800 rounded px-2 py-[2px]",
      multiValueLabel: () => "text-sm font-medium",
      multiValueRemove: () => "text-gray-600 hover:text-red-600 cursor-pointer",
      indicatorsContainer: () => "gap-1",
      indicatorSeparator: () => "hidden",
      dropdownIndicator: () => "text-gray-500 transition-none",
      menu: () =>
        "mt-1 border border-gray-200 rounded-md bg-white shadow-none overflow-hidden z-[999]",
      menuList: () => "max-h-56 overflow-auto",
      option: ({ isFocused, isSelected }) =>
        [
          "px-3 py-2 cursor-pointer",
          isSelected
            ? "bg-gray-200 text-gray-800"
            : isFocused
            ? "bg-gray-100"
            : "",
        ].join(" "),
    };

    const belgeOptions = [
      { value: "Vatandaşlık", label: "Vatandaşlık" },
      { value: "Çalışma İzni", label: "Çalışma İzni" },
      { value: "Öğrenci Belgesi", label: "Öğrenci Belgesi" },
      { value: "Belge Yok", label: "Belge Yok" },
    ];

    return (
      <div className="bg-white p-6 rounded-b-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KKTC Geçerli Belge */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              KKTC Geçerli Belge <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: "disabled", label: "Seçiniz", isDisabled: true },
                ...belgeOptions,
              ]}
              isMulti
              closeMenuOnSelect={false}
              placeholder="Seçiniz"
              value={formData.kktcGecerliBelge.map((v) => ({
                value: v,
                label: v,
              }))}
              onChange={handleMultiSelect}
              unstyled
              classNames={rsClassNames}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
            />
            {errors.kktcGecerliBelge && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {errors.kktcGecerliBelge}
              </p>
            )}
          </div>

          {/* Dava Durumu */}
          <SelectField
            label="Dava Durumu"
            name="davaDurumu"
            value={formData.davaDurumu}
            onChange={handleChange}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Yok", label: "Yok" },
              { value: "Var", label: "Var" },
            ]}
            error={errors.davaDurumu}
          />

          {/* Dava Nedeni */}
          <InputField
            label="Dava Nedeni"
            name="davaNedeni"
            maxLength={250}
            value={formData.davaNedeni}
            onChange={handleChange}
            placeholder="Dava nedenini yazınız"
            disabled={formData.davaDurumu !== "Var"}
            error={errors.davaNedeni}
          />

          {/* Sigara */}
          <SelectField
            label="Sigara Kullanımı"
            name="sigara"
            value={formData.sigara}
            onChange={handleChange}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Evet", label: "Evet" },
              { value: "Hayır", label: "Hayır" },
            ]}
            error={errors.sigara}
          />

          {/* Kalıcı Rahatsızlık */}
          <SelectField
            label="Kalıcı Rahatsızlık"
            name="kaliciRahatsizlik"
            value={formData.kaliciRahatsizlik}
            onChange={handleChange}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Evet", label: "Evet" },
              { value: "Hayır", label: "Hayır" },
            ]}
            error={errors.kaliciRahatsizlik}
          />

          {/* Rahatsızlık Açıklama */}
          <InputField
            label="Rahatsızlık Açıklaması"
            name="rahatsizlikAciklama"
            maxLength={250}
            value={formData.rahatsizlikAciklama}
            onChange={handleChange}
            placeholder="Rahatsızlığınızı açıklayınız"
            disabled={formData.kaliciRahatsizlik !== "Evet"}
            error={errors.rahatsizlikAciklama}
          />

          {/* Ehliyet */}
          <SelectField
            label="Ehliyet Durumu"
            name="ehliyet"
            value={formData.ehliyet}
            onChange={handleChange}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Var", label: "Var" },
              { value: "Yok", label: "Yok" },
            ]}
            error={errors.ehliyet}
          />

          {/* Askerlik */}
          <SelectField
            label="Askerlik Durumu"
            name="askerlik"
            value={formData.askerlik}
            onChange={handleChange}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Yapıldı", label: "Yapıldı" },
              { value: "Yapılmadı", label: "Yapılmadı" },
              { value: "Tecilli", label: "Tecilli" },
              { value: "Muaf", label: "Muaf" },
            ]}
            error={errors.askerlik}
          />

          {/* Boy / Kilo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Boy (cm)"
                name="boy"
                type="number"
                value={formData.boy}
                onChange={handleChange}
                placeholder="Örn. 173"
                error={errors.boy}
              />
            </div>
            <div>
              <InputField
                label="Kilo (kg)"
                name="kilo"
                type="number"
                value={formData.kilo}
                onChange={handleChange}
                placeholder="Örn. 82"
                error={errors.kilo}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

/* --- InputField --- */
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error,
  maxLength,
}) {
  const base =
    "block w-full rounded-lg border px-3 py-2 transition focus:outline-none focus:ring-0";
  const enabled = "bg-white border-gray-300 text-gray-900";
  const disabledCls =
    "bg-gray-200 border-gray-300 text-gray-500 placeholder:text-gray-400 cursor-not-allowed opacity-80";

  const charCount = value?.length || 0;

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        maxLength={maxLength}
        aria-disabled={disabled}
        aria-invalid={!!error}
        tabIndex={disabled ? -1 : 0}
        className={`${base} ${disabled ? disabledCls : enabled}`}
      />

      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p
            className={`text-xs ${
              charCount >= maxLength * 0.9 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

/* --- SelectField --- */
function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full h-[43px] rounded-lg border px-3 py-2 bg-white text-gray-900 focus:outline-none transition border-gray-300"
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

export default OtherPersonalInformationTable;
