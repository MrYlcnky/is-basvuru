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

/* -------------------- Ehliyet Tipleri -------------------- */
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

const OtherPersonalInformationTable = forwardRef(
  function OtherPersonalInformationTable({ onValidChange }, ref) {
    const { t, i18n } = useTranslation();

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
    const belgeOptions = useMemo(() => {
      const arr = t("otherInfo.options.kktcDoc", { returnObjects: true });
      return (arr || []).map((v) => ({ value: v, label: v }));
    }, [i18n.language]);

    const yesNo = useMemo(
      () => ({
        yes: t("otherInfo.options.yesNo.yes"),
        no: t("otherInfo.options.yesNo.no"),
      }),
      [i18n.language]
    );
    const licenseOpts = useMemo(
      () => ({
        have: t("otherInfo.options.license.have"),
        none: t("otherInfo.options.license.none"),
      }),
      [i18n.language]
    );
    const lawsuitOpts = useMemo(
      () => ({
        have: t("otherInfo.options.lawsuit.have"),
        none: t("otherInfo.options.lawsuit.none"),
      }),
      [i18n.language]
    );
    const militaryOpts = useMemo(
      () => ({
        done: t("otherInfo.options.military.done"),
        notDone: t("otherInfo.options.military.notDone"),
        postponed: t("otherInfo.options.military.postponed"),
        exempt: t("otherInfo.options.military.exempt"),
      }),
      [i18n.language]
    );

    const rsBaseControl =
      "w-full h-[43px] overflow-hidden rounded-lg border border-gray-300 px-3 bg-white shadow-none focus:outline-none transition-none hover:border-black focus-within:border-black flex items-start ";
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

    const ehliyetTurOptions = EHLIYET_TURLERI.map((t_) => ({
      value: t_,
      label: t_,
    }));

    /* ---------- Zod Schema (i18n) ---------- */
    const otherInfoSchema = useMemo(() => {
      const oneOf = (vals) => (v) => vals.includes(v);

      return z
        .object({
          kktcGecerliBelge: z
            .string()
            .refine(
              oneOf(belgeOptions.map((b) => b.value)),
              t("otherInfo.errors.kktcDoc")
            ),
          davaDurumu: z
            .string()
            .refine(
              oneOf([lawsuitOpts.none, lawsuitOpts.have]),
              t("otherInfo.errors.lawsuit")
            ),
          davaNedeni: z
            .string()
            .trim()
            .max(250, t("otherInfo.errors.lawsuitReason"))
            .refine((v) => !v || ALNUM_TR.test(v), {
              message: t("otherInfo.errors.lawsuitReason"),
            }),
          sigara: z
            .string()
            .refine(oneOf([yesNo.yes, yesNo.no]), t("otherInfo.errors.smoke")),
          kaliciRahatsizlik: z
            .string()
            .refine(
              oneOf([yesNo.yes, yesNo.no]),
              t("otherInfo.errors.permanentDisease")
            ),
          rahatsizlikAciklama: z
            .string()
            .trim()
            .max(250, t("otherInfo.errors.diseaseDesc"))
            .refine((v) => !v || ALNUM_TR.test(v), {
              message: t("otherInfo.errors.diseaseDesc"),
            }),
          ehliyet: z
            .string()
            .refine(
              oneOf([licenseOpts.have, licenseOpts.none]),
              t("otherInfo.errors.license")
            ),
          ehliyetTurleri: z.array(z.string()).optional().default([]),
          askerlik: z
            .string()
            .refine(
              oneOf([
                militaryOpts.done,
                militaryOpts.notDone,
                militaryOpts.postponed,
                militaryOpts.exempt,
              ]),
              t("otherInfo.errors.military")
            ),
          boy: z.coerce
            .number({ invalid_type_error: t("otherInfo.errors.heightNum") })
            .int(t("otherInfo.errors.heightInt"))
            .min(120, t("otherInfo.errors.heightMinMax"))
            .max(230, t("otherInfo.errors.heightMinMax")),
          kilo: z.coerce
            .number({ invalid_type_error: t("otherInfo.errors.weightNum") })
            .int(t("otherInfo.errors.weightInt"))
            .min(30, t("otherInfo.errors.weightMinMax"))
            .max(250, t("otherInfo.errors.weightMinMax")),
        })
        .superRefine((data, ctx) => {
          if (data.davaDurumu === lawsuitOpts.have) {
            if (!data.davaNedeni || data.davaNedeni.trim().length < 3) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["davaNedeni"],
                message: t("otherInfo.errors.lawsuitReason"),
              });
            }
          }
          if (data.kaliciRahatsizlik === yesNo.yes) {
            if (
              !data.rahatsizlikAciklama ||
              data.rahatsizlikAciklama.trim().length < 10
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rahatsizlikAciklama"],
                message: t("otherInfo.errors.diseaseDesc"),
              });
            }
          }
          if (data.ehliyet === licenseOpts.have) {
            if (!data.ehliyetTurleri || data.ehliyetTurleri.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["ehliyetTurleri"],
                message: t("otherInfo.errors.licenseTypes"),
              });
            }
          }
        });
    }, [
      i18n.language,
      belgeOptions,
      yesNo,
      licenseOpts,
      lawsuitOpts,
      militaryOpts,
    ]);

    useEffect(() => {
      const ok = otherInfoSchema.safeParse(formData).success;
      onValidChange?.(ok);
    }, [formData, otherInfoSchema, onValidChange]);

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

    const setAndValidate = (name, value) => {
      const next = { ...formData, [name]: value };
      setFormData(next);

      const r = otherInfoSchema.safeParse(next);
      if (!r.success) {
        const issue = r.error.issues.find((i) => i.path[0] === name);
        setErrors((prev) => ({ ...prev, [name]: issue ? issue.message : "" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      // ilişkili alanlar
      if (name === "davaDurumu" || name === "davaNedeni") {
        const issue = !r.success
          ? r.error.issues.find((i) => i.path[0] === "davaNedeni")?.message ||
            ""
          : "";
        setErrors((prev) => ({ ...prev, davaNedeni: issue }));
      }
      if (name === "kaliciRahatsizlik" || name === "rahatsizlikAciklama") {
        const issue = !r.success
          ? r.error.issues.find((i) => i.path[0] === "rahatsizlikAciklama")
              ?.message || ""
          : "";
        setErrors((prev) => ({ ...prev, rahatsizlikAciklama: issue }));
      }
      if (name === "ehliyet" || name === "ehliyetTurleri") {
        const issue = !r.success
          ? r.error.issues.find((i) => i.path[0] === "ehliyetTurleri")
              ?.message || ""
          : "";
        setErrors((prev) => ({ ...prev, ehliyetTurleri: issue }));
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAndValidate(name, value);
      if (name === "ehliyet" && value !== licenseOpts.have) {
        setAndValidate("ehliyetTurleri", []);
      }
    };

    const handleSingleSelect = (selected) => {
      const value = selected?.value || "";
      setAndValidate("kktcGecerliBelge", value);
    };

    const handleEhliyetTurleri = (selected) => {
      const values = selected ? selected.map((opt) => opt.value) : [];
      setAndValidate("ehliyetTurleri", values);
    };

    const placeholderSelect = {
      value: "",
      label: t("personal.placeholders.select"),
      isDisabled: true,
    };

    return (
      <div className="bg-white p-6 rounded-b-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KKTC Geçerli Belge */}
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
              value={
                formData.kktcGecerliBelge
                  ? {
                      value: formData.kktcGecerliBelge,
                      label: formData.kktcGecerliBelge,
                    }
                  : placeholderSelect
              }
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

          {/* Dava Durumu */}
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

          {/* Dava Nedeni */}
          <InputField
            label={t("otherInfo.labels.lawsuitReason")}
            name="davaNedeni"
            maxLength={250}
            value={formData.davaNedeni}
            onChange={handleChange}
            placeholder={t("otherInfo.placeholders.lawsuitReason")}
            disabled={formData.davaDurumu !== lawsuitOpts.have}
            error={errors.davaNedeni}
          />

          {/* Sigara & Askerlik */}
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

          {/* Kalıcı Rahatsızlık */}
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

          {/* Rahatsızlık Açıklama */}
          <InputField
            label={t("otherInfo.labels.diseaseDesc")}
            name="rahatsizlikAciklama"
            maxLength={250}
            value={formData.rahatsizlikAciklama}
            onChange={handleChange}
            placeholder={t("otherInfo.placeholders.diseaseDesc")}
            disabled={formData.kaliciRahatsizlik !== yesNo.yes}
            error={errors.rahatsizlikAciklama}
          />

          {/* Ehliyet */}
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

          {/* Ehliyet Türleri */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t("otherInfo.labels.licenseTypes")}{" "}
              {formData.ehliyet === licenseOpts.have ? (
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
                    formData.ehliyet !== licenseOpts.have
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }`,
              }}
              isDisabled={formData.ehliyet !== licenseOpts.have}
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
