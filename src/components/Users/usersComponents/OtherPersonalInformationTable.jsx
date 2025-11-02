// components/Users/tables/OtherPersonalInformationTable.jsx
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { z } from "zod";
import Select from "react-select";

/* -------------------- ZOD ŞEMASI -------------------- */
const oneOf = (vals) => (v) => vals.includes(v);
const ALNUM_TR = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u;

const EHLIYET_TURLERI = [
  "M",
  "A1",
  "A2",
  "A",
  "B1",
  "B",
  "BE",
  "C1",
  "C1E",
  "C",
  "CE",
  "D1",
  "D1E",
  "D",
  "DE",
  "F",
  "G",
];

const otherInfoSchema = z
  .object({
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
    davaDurumu: z.string().refine(oneOf(["Yok", "Var"]), "Dava durumu seçiniz"),
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
    rahatsizlikAciklama: z
      .string()
      .trim()
      .max(250, "En fazla 250 karakter yazabilirsiniz")
      .refine((v) => !v || ALNUM_TR.test(v), {
        message: "Sadece harf ve rakam kullanabilirsiniz",
      }),
    ehliyet: z.string().refine(oneOf(["Var", "Yok"]), "Ehliyet durumu seçiniz"),
    ehliyetTurleri: z
      .array(z.string().refine(oneOf(EHLIYET_TURLERI), "Geçersiz ehliyet türü"))
      .optional()
      .default([]),
    askerlik: z
      .string()
      .refine(
        oneOf(["Yapıldı", "Yapılmadı", "Tecilli", "Muaf"]),
        "Askerlik durumu seçiniz"
      ),
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
    if (data.davaDurumu === "Var") {
      if (!data.davaNedeni || data.davaNedeni.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["davaNedeni"],
          message: "Dava nedeni en az 3 karakter olmalıdır",
        });
      }
    }
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
    if (data.ehliyet === "Var") {
      if (!data.ehliyetTurleri || data.ehliyetTurleri.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ehliyetTurleri"],
          message: "En az bir ehliyet türü seçiniz",
        });
      }
    }
  });

/* -------------------- COMPONENT -------------------- */
const OtherPersonalInformationTable = forwardRef(
  function OtherPersonalInformationTable({ onValidChange }, ref) {
    const [formData, setFormData] = useState({
      kktcGecerliBelge: [],
      davaDurumu: "",
      davaNedeni: "",
      sigara: "",
      kaliciRahatsizlik: "",
      rahatsizlikAciklama: "",
      ehliyet: "",
      ehliyetTurleri: [],
      askerlik: "",
      boy: "",
      kilo: "",
    });

    const [errors, setErrors] = useState({});

    // 🔔 Form her değiştiğinde toplam geçerliliği parent’a bildir
    useEffect(() => {
      const ok = otherInfoSchema.safeParse(formData).success;
      onValidChange?.(ok);
    }, [formData, onValidChange]);

    const validateField = (name, value) => {
      const next = { ...formData, [name]: value };
      const result = otherInfoSchema.safeParse(next);

      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === name);
        setErrors((prev) => ({ ...prev, [name]: issue ? issue.message : "" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      // Koşullu alanlar için detay kontrol
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
      if (name === "ehliyet" || name === "ehliyetTurleri") {
        const r = otherInfoSchema.safeParse(next);
        const msg = !r.success
          ? r.error.issues.find((i) => i.path[0] === "ehliyetTurleri")
              ?.message || ""
          : "";
        setErrors((prev) => ({ ...prev, ehliyetTurleri: msg }));
      }
    };

    useImperativeHandle(ref, () => ({
      getData: () =>
        [formData].filter((d) =>
          Object.values(d).some((v) =>
            Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== ""
          )
        ),
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
      if (name === "ehliyet" && value !== "Var") {
        setFormData((prev) => ({ ...prev, ehliyetTurleri: [] }));
        validateField("ehliyetTurleri", []);
      }
    };

    const handleMultiSelect = (selected) => {
      const values = selected ? selected.map((opt) => opt.value) : [];
      setFormData((prev) => ({ ...prev, kktcGecerliBelge: values }));
      validateField("kktcGecerliBelge", values);
    };

    const handleEhliyetTurleri = (selected) => {
      const values = selected ? selected.map((opt) => opt.value) : [];
      setFormData((prev) => ({ ...prev, ehliyetTurleri: values }));
      validateField("ehliyetTurleri", values);
    };

    /* -------- react-select class'ları --------
       Sabit yükseklik: h-[43px]
       İçerik taşarsa: valueContainer h-[39px] + overflow-y-auto (iç scroll)
       Dış çerçeve büyümez, hover/focus: border siyah
    */
    const rsBaseControl =
      "w-full h-[43px] overflow-hidden rounded-lg border border-gray-300 px-3 bg-white " +
      "shadow-none focus:outline-none transition-none hover:border-black focus-within:border-black " +
      "flex items-start ";

    const rsClassNames = {
      container: () => "w-full",
      control: () => rsBaseControl,
      valueContainer: () =>
        "h-[39px] overflow-y-auto flex flex-wrap items-start gap-1 py-0 pr-1",
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

    const ehliyetTurOptions = EHLIYET_TURLERI.map((t) => ({
      value: t,
      label: t,
    }));

    return (
      <div className="bg-white p-6 rounded-b-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KKTC Geçerli Belge (multi) */}
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

          {/* Sigara & Askerlik aynı satır */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
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
            </div>
            <div>
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
            </div>
          </div>

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
          <div>
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
          </div>

          {/* Ehliyet Türleri (multi) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Ehliyet Türü{" "}
              {formData.ehliyet === "Var" ? (
                <span className="text-red-500">*</span>
              ) : null}
            </label>
            <Select
              options={ehliyetTurOptions}
              isMulti
              closeMenuOnSelect={false}
              placeholder="Türler"
              value={formData.ehliyetTurleri.map((v) => ({
                value: v,
                label: v,
              }))}
              onChange={handleEhliyetTurleri}
              unstyled
              classNames={{
                ...rsClassNames,
                control: () =>
                  `${rsBaseControl} ${
                    formData.ehliyet !== "Var"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`,
              }}
              isDisabled={formData.ehliyet !== "Var"}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
            />
            {errors.ehliyetTurleri && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {errors.ehliyetTurleri}
              </p>
            )}
          </div>

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
  const enabled =
    "bg-white border-gray-300 text-gray-900 hover:border-black focus:border-black";
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

/* --- SelectField (native) --- */
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
        className="block w-full min-h-[43px] rounded-lg border px-3 py-2 bg-white text-gray-900 focus:outline-none transition border-gray-300 hover:border-black focus:border-black"
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
