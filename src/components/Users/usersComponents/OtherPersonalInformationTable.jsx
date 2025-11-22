import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import { z } from "zod";
import Select from "react-select";
import { useTranslation } from "react-i18next";

/* -------------------- Sabitler -------------------- */
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
const ALNUM_TR = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u;

// Stil sabiti
const rsBaseControl =
  "w-full h-[43px] overflow-hidden rounded-lg border border-gray-300 px-3 bg-white shadow-none focus:outline-none transition-none hover:border-black focus-within:border-black flex items-start";

const OtherPersonalInformationTable = forwardRef(
  function OtherPersonalInformationTable({ onValidChange }, ref) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
      kktcGecerliBelge: "",
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

    /* ---------- i18n options ---------- */
    // Seçenekleri sadece UI için kullanıyoruz, validasyon için zorunlu tutmuyoruz.
    const belgeOptions = useMemo(
      () =>
        (t("otherInfo.options.kktcDoc", { returnObjects: true }) || []).map(
          (v) => ({ value: v, label: v })
        ),
      [t]
    );
    const yesNo = useMemo(
      () => ({
        yes: t("otherInfo.options.yesNo.yes"),
        no: t("otherInfo.options.yesNo.no"),
      }),
      [t]
    );
    const licenseOpts = useMemo(
      () => ({
        have: t("otherInfo.options.license.have"),
        none: t("otherInfo.options.license.none"),
      }),
      [t]
    );
    const lawsuitOpts = useMemo(
      () => ({
        have: t("otherInfo.options.lawsuit.have"),
        none: t("otherInfo.options.lawsuit.none"),
      }),
      [t]
    );
    const militaryOpts = useMemo(
      () => ({
        done: t("otherInfo.options.military.done"),
        notDone: t("otherInfo.options.military.notDone"),
        postponed: t("otherInfo.options.military.postponed"),
        exempt: t("otherInfo.options.military.exempt"),
      }),
      [t]
    );

    const rsClassNames = useMemo(
      () => ({
        container: () => "w-full",
        control: () => rsBaseControl,
        valueContainer: () =>
          "h-[39px] overflow-y-auto flex flex-wrap items-start gap-1 py-0 pr-1",
        placeholder: () => "text-gray-400",
        multiValue: () => "bg-gray-100 text-gray-800 rounded px-2 py-[2px]",
        multiValueLabel: () => "text-sm font-medium",
        multiValueRemove: () =>
          "text-gray-600 hover:text-red-600 cursor-pointer",
        indicatorsContainer: () => "gap-1",
        indicatorSeparator: () => "hidden",
        dropdownIndicator: () => "text-gray-500 transition-none",
        menu: () =>
          "mt-1 border border-gray-200 rounded-md bg-white shadow-none overflow-hidden z-[999]",
        menuList: () => "max-h-56 overflow-auto",
        option: ({ isFocused, isSelected }) =>
          `px-3 py-2 cursor-pointer ${
            isSelected
              ? "bg-gray-200 text-gray-800"
              : isFocused
              ? "bg-gray-100"
              : ""
          }`,
      }),
      []
    );

    const ehliyetTurOptions = useMemo(
      () => EHLIYET_TURLERI.map((t_) => ({ value: t_, label: t_ })),
      []
    );

    /* ---------- Zod Schema (ESNEK VALIDASYON) ---------- */
    const otherInfoSchema = useMemo(() => {
      // Sadece boş olup olmadığını kontrol ediyoruz. "Listede var mı" kontrolünü (.refine) kaldırdık.
      // Böylece veritabanından "Var" gelse, liste "Evet" olsa bile hata vermez.
      const reqMsg = (key) => ({
        invalid_type_error: t(`otherInfo.errors.${key}`),
        required_error: t(`otherInfo.errors.${key}`),
      });

      return z
        .object({
          kktcGecerliBelge: z
            .string(reqMsg("kktcDoc"))
            .min(1, t("otherInfo.errors.kktcDoc")),
          davaDurumu: z
            .string(reqMsg("lawsuit"))
            .min(1, t("otherInfo.errors.lawsuit")),

          // Dava nedeni sadece dava durumu "Evet" benzeri bir şeyse zorunlu olsun
          davaNedeni: z
            .string()
            .trim()
            .max(250, t("otherInfo.errors.lawsuitReason"))
            .optional(),

          sigara: z.string(reqMsg("smoke")).min(1, t("otherInfo.errors.smoke")),
          kaliciRahatsizlik: z
            .string(reqMsg("permanentDisease"))
            .min(1, t("otherInfo.errors.permanentDisease")),
          rahatsizlikAciklama: z
            .string()
            .trim()
            .max(250, t("otherInfo.errors.diseaseDesc"))
            .optional(),
          ehliyet: z
            .string(reqMsg("license"))
            .min(1, t("otherInfo.errors.license")),
          ehliyetTurleri: z.array(z.string()).optional().default([]),
          askerlik: z
            .string(reqMsg("military"))
            .min(1, t("otherInfo.errors.military")),
          boy: z.coerce
            .number({ invalid_type_error: t("otherInfo.errors.heightNum") })
            .int()
            .min(50)
            .max(250),
          kilo: z.coerce
            .number({ invalid_type_error: t("otherInfo.errors.weightNum") })
            .int()
            .min(20)
            .max(300),
        })
        .superRefine((data, ctx) => {
          // Manuel Mantık Kontrolü (Esnek Eşleştirme)
          // "Evet", "Yes", "Var" veya "Have" içeriyorsa pozitiftir.
          const isPositive = (val) =>
            ["evet", "yes", "var", "have"].includes(
              String(val || "").toLowerCase()
            );

          if (
            isPositive(data.davaDurumu) &&
            (!data.davaNedeni || data.davaNedeni.trim().length < 3)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["davaNedeni"],
              message: t("otherInfo.errors.lawsuitReason"),
            });
          }
          if (
            isPositive(data.kaliciRahatsizlik) &&
            (!data.rahatsizlikAciklama ||
              data.rahatsizlikAciklama.trim().length < 5)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["rahatsizlikAciklama"],
              message: t("otherInfo.errors.diseaseDesc"),
            });
          }
          if (
            isPositive(data.ehliyet) &&
            (!data.ehliyetTurleri || data.ehliyetTurleri.length < 1)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["ehliyetTurleri"],
              message: t("otherInfo.errors.licenseTypes"),
            });
          }
        });
    }, [t]);

    // --- EXPOSE METHODS ---
    useImperativeHandle(ref, () => ({
      getData: () =>
        [formData].filter((d) =>
          Object.values(d).some((v) =>
            Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== ""
          )
        ),

      isValid: () => {
        // Validasyon sonucunu döndür
        return otherInfoSchema.safeParse(formData).success;
      },

      fillData: (data) => {
        if (!data) return;

        // Gelen veriyi normalize et (UI'da düzgün görünsün diye)
        const normalized = { ...data };
        const mapToCurrent = (val, positiveOption, negativeOption) => {
          if (!val) return "";
          const lower = String(val).toLowerCase();
          if (["var", "yes", "evet", "have"].includes(lower))
            return positiveOption;
          if (["yok", "no", "hayır", "none"].includes(lower))
            return negativeOption;
          return val;
        };

        if (normalized.davaDurumu)
          normalized.davaDurumu = mapToCurrent(
            normalized.davaDurumu,
            lawsuitOpts.have,
            lawsuitOpts.none
          );
        if (normalized.sigara)
          normalized.sigara = mapToCurrent(
            normalized.sigara,
            yesNo.yes,
            yesNo.no
          );
        if (normalized.kaliciRahatsizlik)
          normalized.kaliciRahatsizlik = mapToCurrent(
            normalized.kaliciRahatsizlik,
            yesNo.yes,
            yesNo.no
          );
        if (normalized.ehliyet)
          normalized.ehliyet = mapToCurrent(
            normalized.ehliyet,
            licenseOpts.have,
            licenseOpts.none
          );

        setFormData((prev) => ({ ...prev, ...normalized }));
      },
    }));

    // Form datası her değiştiğinde validasyonu çalıştır ve üst bileşene bildir
    useEffect(() => {
      const result = otherInfoSchema.safeParse(formData);
      const ok = result.success;
      onValidChange?.(ok);

      // Hata ayıklama için konsola yaz (Geliştirme aşamasında)
      // if (!ok) console.log("OtherInfo Validation Errors:", result.error.issues);
    }, [formData, otherInfoSchema, onValidChange]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const next = { ...prev, [name]: value };

        // Yan etki temizliği (Örn: Dava yok dendiğinde nedeni sil)
        const isPositive = (val) =>
          ["evet", "yes", "var", "have"].includes(
            String(val || "").toLowerCase()
          );

        if (name === "davaDurumu" && !isPositive(value)) next.davaNedeni = "";
        if (name === "kaliciRahatsizlik" && !isPositive(value))
          next.rahatsizlikAciklama = "";
        if (name === "ehliyet" && !isPositive(value)) next.ehliyetTurleri = [];
        return next;
      });
    };

    const handleSingleSelect = (selected) => {
      setFormData((p) => ({ ...p, kktcGecerliBelge: selected?.value || "" }));
    };
    const handleEhliyetTurleri = (selected) => {
      setFormData((p) => ({
        ...p,
        ehliyetTurleri: selected ? selected.map((opt) => opt.value) : [],
      }));
    };

    const placeholderSelect = {
      value: "",
      label: t("personal.placeholders.select"),
      isDisabled: true,
    };

    const kktcValueObj = useMemo(() => {
      const found = belgeOptions.find(
        (opt) => opt.value === formData.kktcGecerliBelge
      );
      if (found) return found;
      // Listede yoksa bile göster (Validasyon artık buna izin veriyor)
      return formData.kktcGecerliBelge
        ? { label: formData.kktcGecerliBelge, value: formData.kktcGecerliBelge }
        : null;
    }, [formData.kktcGecerliBelge, belgeOptions]);

    const ehliyetValueObj = useMemo(() => {
      return formData.ehliyetTurleri.map(
        (val) =>
          ehliyetTurOptions.find((o) => o.value === val) || {
            label: val,
            value: val,
          }
      );
    }, [formData.ehliyetTurleri, ehliyetTurOptions]);

    // Dava Durumu vb. için helper check
    const isLawsuitYes = ["evet", "yes", "var", "have"].includes(
      String(formData.davaDurumu || "").toLowerCase()
    );
    const isDiseaseYes = ["evet", "yes", "var", "have"].includes(
      String(formData.kaliciRahatsizlik || "").toLowerCase()
    );
    const isLicenseYes = ["evet", "yes", "var", "have"].includes(
      String(formData.ehliyet || "").toLowerCase()
    );

    return (
      <div className="bg-white p-6 rounded-b-lg border border-gray-200">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* KKTC Belge */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {t("otherInfo.labels.kktcDoc")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                options={[placeholderSelect, ...belgeOptions]}
                isMulti={false}
                closeMenuOnSelect
                placeholder={t("personal.placeholders.select")}
                value={kktcValueObj}
                onChange={handleSingleSelect}
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

            <SelectField
              label={t("otherInfo.labels.lawsuit")}
              name="davaDurumu"
              value={formData.davaDurumu}
              onChange={handleChange}
              options={[
                { value: "", label: t("personal.placeholders.select") },
                { value: lawsuitOpts.none, label: lawsuitOpts.none },
                { value: lawsuitOpts.have, label: lawsuitOpts.have },
              ]}
              error={errors.davaDurumu}
            />
            <InputField
              label={t("otherInfo.labels.lawsuitReason")}
              name="davaNedeni"
              maxLength={250}
              value={formData.davaNedeni}
              onChange={handleChange}
              placeholder={t("otherInfo.placeholders.lawsuitReason")}
              disabled={!isLawsuitYes}
              error={errors.davaNedeni}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label={t("otherInfo.labels.smoke")}
                name="sigara"
                value={formData.sigara}
                onChange={handleChange}
                options={[
                  { value: "", label: t("personal.placeholders.select") },
                  { value: yesNo.yes, label: yesNo.yes },
                  { value: yesNo.no, label: yesNo.no },
                ]}
                error={errors.sigara}
              />
              <SelectField
                label={t("otherInfo.labels.military")}
                name="askerlik"
                value={formData.askerlik}
                onChange={handleChange}
                options={[
                  { value: "", label: t("personal.placeholders.select") },
                  { value: militaryOpts.done, label: militaryOpts.done },
                  { value: militaryOpts.notDone, label: militaryOpts.notDone },
                  {
                    value: militaryOpts.postponed,
                    label: militaryOpts.postponed,
                  },
                  { value: militaryOpts.exempt, label: militaryOpts.exempt },
                ]}
                error={errors.askerlik}
              />
            </div>

            <SelectField
              label={t("otherInfo.labels.permanentDisease")}
              name="kaliciRahatsizlik"
              value={formData.kaliciRahatsizlik}
              onChange={handleChange}
              options={[
                { value: "", label: t("personal.placeholders.select") },
                { value: yesNo.yes, label: yesNo.yes },
                { value: yesNo.no, label: yesNo.no },
              ]}
              error={errors.kaliciRahatsizlik}
            />
            <InputField
              label={t("otherInfo.labels.diseaseDesc")}
              name="rahatsizlikAciklama"
              maxLength={250}
              value={formData.rahatsizlikAciklama}
              onChange={handleChange}
              placeholder={t("otherInfo.placeholders.diseaseDesc")}
              disabled={!isDiseaseYes}
              error={errors.rahatsizlikAciklama}
            />

            <SelectField
              label={t("otherInfo.labels.license")}
              name="ehliyet"
              value={formData.ehliyet}
              onChange={handleChange}
              options={[
                { value: "", label: t("personal.placeholders.select") },
                { value: licenseOpts.have, label: licenseOpts.have },
                { value: licenseOpts.none, label: licenseOpts.none },
              ]}
              error={errors.ehliyet}
            />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {t("otherInfo.labels.licenseTypes")}{" "}
                {isLicenseYes ? <span className="text-red-500">*</span> : null}
              </label>
              <Select
                options={ehliyetTurOptions}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Türler"
                value={ehliyetValueObj}
                onChange={handleEhliyetTurleri}
                unstyled
                classNames={rsClassNames}
                isDisabled={!isLicenseYes}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label={t("otherInfo.labels.height")}
                name="boy"
                type="number"
                value={formData.boy}
                onChange={handleChange}
                placeholder={t("otherInfo.placeholders.height")}
                error={errors.boy}
              />
              <InputField
                label={t("otherInfo.labels.weight")}
                name="kilo"
                type="number"
                value={formData.kilo}
                onChange={handleChange}
                placeholder={t("otherInfo.placeholders.weight")}
                error={errors.kilo}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

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
        className={`block w-full rounded-lg border px-3 py-2 transition focus:outline-none focus:ring-0 ${
          disabled
            ? "bg-gray-200 border-gray-300 text-gray-500"
            : "bg-white border-gray-300 text-gray-900 hover:border-black focus:border-black"
        }`}
      />
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, error }) {
  const safeOptions = options.some((o) => o.value === value)
    ? options
    : value
    ? [...options, { value, label: value }]
    : options;

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
        {safeOptions.map((o) => (
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
