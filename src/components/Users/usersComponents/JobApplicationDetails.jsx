// components/Users/tables/JobApplicationDetails.jsx
import {
  forwardRef,
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
} from "react";
import Select from "react-select";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faBuilding,
  faLayerGroup,
  faBriefcase,
  faComputer,
  faHouseUser,
  faCircleInfo,
  faClapperboard,
} from "@fortawesome/free-solid-svg-icons";

const JobApplicationDetails = forwardRef(function JobApplicationDetails(
  { onValidChange }, // ✅ canlı validasyon callback
  ref
) {
  // --- Sabit veri kümeleri ---
  const otelDepartments = [
    { value: "Otel Resepsiyon", label: "Otel Resepsiyon" },
    { value: "Otel Housekeeping", label: "Otel Housekeeping" },
  ];
  const casinoDepartments = [
    { value: "Casino F&B", label: "Casino F&B" },
    { value: "Casino Kasa", label: "Casino Kasa" },
    { value: "Casino Slot", label: "Casino Slot" },
    { value: "Casino Canlı Oyun", label: "Casino Canlı Oyun" },
  ];

  const departmentPrograms = {
    "Casino F&B": ["Asist"],
    "Casino Kasa": ["drCage"],
    "Casino Slot": ["Asist", "drReports"],
    "Casino Canlı Oyun": [],
    "Otel Resepsiyon": ["Opera PMS"],
    "Otel Housekeeping": ["HotelLogix"],
  };

  const departmentRoles = {
    "Casino F&B": ["Garson", "Barmen", "Barback", "Komi", "Supervisor"],
    "Casino Kasa": ["Cashier", "Cage Supervisor"],
    "Casino Slot": ["Slot Attendant", "Slot Technician", "Host"],
    "Casino Canlı Oyun": ["Dealer", "Inspector", "Pitboss"],
    "Otel Resepsiyon": ["Resepsiyonist", "Guest Relations", "Night Auditor"],
    "Otel Housekeeping": ["Kat Görevlisi", "Kat Şefi", "Laundry"],
  };

  const kagitOyunlariList = [
    { value: "Poker", label: "Poker" },
    { value: "Blackjack", label: "Blackjack" },
    { value: "Baccarat", label: "Baccarat" },
    { value: "Roulette", label: "Roulette" },
    { value: "Texas Hold’em", label: "Texas Hold’em" },
  ];

  // --- State ---
  const [formData, setFormData] = useState({
    subeler: [],
    alanlar: [],
    departmanlar: [],
    programlar: [],
    departmanPozisyonlari: [],
    kagitOyunlari: [],
    lojman: "",
    tercihNedeni: "",
  });

  const [errors, setErrors] = useState({});

  // --- Seçenek listeleri ---
  const subeOptions = [
    { value: "Prestige", label: "Prestige" },
    { value: "Girne", label: "Girne" },
  ];
  const alanOptions = [
    { value: "Otel", label: "Otel" },
    { value: "Casino", label: "Casino" },
  ];
  const lojmanOptions = [
    { value: "Evet", label: "Evet" },
    { value: "Hayır", label: "Hayır" },
  ];

  // --- Alan, departman, program ilişkileri ---
  const availableDepartments = useMemo(() => {
    let list = [];
    if (formData.alanlar.some((a) => a.value === "Otel"))
      list.push(...otelDepartments);
    if (formData.alanlar.some((a) => a.value === "Casino"))
      list.push(...casinoDepartments);
    return list;
  }, [formData.alanlar]);

  const availablePrograms = useMemo(() => {
    const set = new Set();
    formData.departmanlar.forEach((d) => {
      (departmentPrograms[d.value] || []).forEach((p) => set.add(p));
    });
    return Array.from(set).map((p) => ({ value: p, label: p }));
  }, [formData.departmanlar]);

  const availableRoles = useMemo(() => {
    const groups = [];
    formData.departmanlar.forEach((d) => {
      const roles = (departmentRoles[d.value] || []).map((r) => ({
        value: `${d.value}::${r}`,
        label: r,
        dept: d.value,
      }));
      if (roles.length) {
        groups.push({ label: d.label, options: roles });
      }
    });
    return groups;
  }, [formData.departmanlar]);

  const canliOyunSelected = formData.departmanlar.some(
    (d) => d.value === "Casino Canlı Oyun"
  );
  const hasSubeSelected = formData.subeler.length > 0;
  const needsRoles = availableRoles.length > 0;

  // --- react-select stil ---
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
      border: "1px solid #d1d5db",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      "&:hover": { borderColor: "#000000" }, // hover siyah
      opacity: state.isDisabled ? 0.8 : 1,
    }),
    dropdownIndicator: (base) => ({ ...base, cursor: "pointer" }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#e0f2fe"
        : state.isFocused
        ? "#f0f9ff"
        : "white",
      color: "#111827",
    }),
  };

  /* -------------------- ZOD ŞEMASI -------------------- */
  const optionSchema = z.object({ value: z.string(), label: z.string() });
  const roleOptionSchema = z.object({
    value: z.string(),
    label: z.string(),
    dept: z.string(),
  });
  const arrayNonEmpty = (schema, msg) => z.array(schema).min(1, msg);

  const schema = z
    .object({
      subeler: arrayNonEmpty(optionSchema, "Şube seçiniz"),
      alanlar: arrayNonEmpty(optionSchema, "Alan seçiniz"),
      departmanlar: arrayNonEmpty(optionSchema, "Departman seçiniz"),
      programlar: arrayNonEmpty(optionSchema, "Program seçiniz"),
      departmanPozisyonlari: z.array(roleOptionSchema).optional().default([]),
      kagitOyunlari: z.array(optionSchema).optional().default([]),
      lojman: z
        .string()
        .refine((v) => ["Evet", "Hayır"].includes(v), "Lojman durumu seçiniz"),
      tercihNedeni: z
        .string()
        .min(1, "Neden tercih ettiğinizi yazınız")
        .regex(
          /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
          "Sadece harf ve rakam kullanabilirsiniz"
        )
        .max(500, "En fazla 500 karakter yazabilirsiniz"),
    })
    .superRefine((data, ctx) => {
      const anyDeptHasRoles = data.departmanlar.some(
        (d) => (departmentRoles[d.value] || []).length > 0
      );
      if (
        anyDeptHasRoles &&
        (!data.departmanPozisyonlari || data.departmanPozisyonlari.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["departmanPozisyonlari"],
          message: "Pozisyon(lar) seçiniz",
        });
      }
      const canliOyun = data.departmanlar.some(
        (d) => d.value === "Casino Canlı Oyun"
      );
      if (
        canliOyun &&
        (!data.kagitOyunlari || data.kagitOyunlari.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kagitOyunlari"],
          message: "Kağıt oyunlarından en az birini seçiniz",
        });
      }
    });

  /* -------------------- Doğrulama Mantığı -------------------- */
  const validateAll = (nextData = formData, { silent = false } = {}) => {
    const res = schema.safeParse(nextData);
    const ok = res.success;

    if (!silent) {
      if (!ok) {
        const newErrors = {};
        res.error.issues.forEach((i) => {
          const key = i.path[0];
          if (key && !newErrors[key]) newErrors[key] = i.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({});
      }
    }

    // ✅ Parent’a canlı validasyon sinyali
    onValidChange?.(ok);
    return ok;
  };

  const validateField = (name, value) => {
    const next = { ...formData, [name]: value };
    validateAll(next);
  };

  useImperativeHandle(ref, () => ({
    isValid: () => validateAll(undefined, { silent: false }),
  }));

  /* Her form değişiminde sessiz validasyon: status bar anında güncellenir */
  useEffect(() => {
    validateAll(formData, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // --- Handlers ---
  const handleMultiChange = (key, value) => {
    const v = value || [];
    setFormData((prev) => ({ ...prev, [key]: v }));
    validateField(key, v);
  };

  const handleSingleChange = (key, value) => {
    const v = value ? value.value : "";
    setFormData((prev) => ({ ...prev, [key]: v }));
    validateField(key, v);
  };

  const onDepartmentsChange = (v) => {
    const allowedDepts = new Set((v || []).map((x) => x.value));
    const filteredRoles = (formData.departmanPozisyonlari || []).filter((r) =>
      allowedDepts.has(r.dept)
    );
    const next = {
      ...formData,
      departmanlar: v || [],
      departmanPozisyonlari: filteredRoles,
    };
    setFormData(next);
    validateAll(next);
  };

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8">
      {/* Bilgilendirme Alanı */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md shadow-sm">
        <p className="text-sm sm:text-base leading-relaxed">
          <strong>📋 Başvuru Detayları:</strong> Bu bölümde çalışmak istediğiniz{" "}
          <strong>şube, alan, departman ve program</strong> bilgilerini
          seçebilirsiniz.{" "}
          <span className="font-semibold text-red-500">
            Tüm alanlar zorunludur.
          </span>{" "}
          Eğer <strong>Casino Canlı Oyun</strong> seçerseniz,{" "}
          <strong>Kağıt Oyun Bilgisi</strong> de zorunlu hale gelir.
          {availableRoles.length > 0 && (
            <span className="ml-1">
              Seçtiğiniz departmanlar için <strong>pozisyon(lar)</strong> da
              seçmelisiniz.
            </span>
          )}
        </p>
      </div>

      {/* Form Alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <SelectField
          label="Başvurulacak Şube(ler)"
          name="subeler"
          options={subeOptions}
          value={formData.subeler}
          onChange={(v) => handleMultiChange("subeler", v)}
          placeholder="Şube seçiniz..."
          error={errors.subeler}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label="Alan (Otel / Casino)"
          name="alanlar"
          options={alanOptions}
          value={formData.alanlar}
          onChange={(v) => handleMultiChange("alanlar", v)}
          placeholder={
            hasSubeSelected ? "Alan seçiniz..." : "Önce şube seçiniz"
          }
          isDisabled={!hasSubeSelected}
          error={errors.alanlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label="Başvurulacak Departman(lar)"
          name="departmanlar"
          options={availableDepartments}
          value={formData.departmanlar}
          onChange={onDepartmentsChange}
          placeholder={
            availableDepartments.length === 0
              ? "Önce alan seçiniz"
              : "Departman seçiniz..."
          }
          isDisabled={availableDepartments.length === 0}
          error={errors.departmanlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label="Departman İçi Pozisyon(lar)"
          name="departmanPozisyonlari"
          options={availableRoles}
          value={formData.departmanPozisyonlari}
          onChange={(v) => handleMultiChange("departmanPozisyonlari", v)}
          placeholder={
            needsRoles
              ? "Pozisyon(lar) seçiniz..."
              : "Pozisyon gerektiren departman seçiniz"
          }
          isDisabled={!needsRoles}
          error={errors.departmanPozisyonlari}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label="Bilgisayar Program Bilgisi"
          name="programlar"
          options={availablePrograms}
          value={formData.programlar}
          onChange={(v) => handleMultiChange("programlar", v)}
          placeholder={
            availablePrograms.length === 0
              ? "Departman seçiniz"
              : "Program seçiniz..."
          }
          isDisabled={availablePrograms.length === 0}
          error={errors.programlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label="Kağıt Oyun Bilgisi (Casino Canlı Oyun için)"
          name="kagitOyunlari"
          options={kagitOyunlariList}
          value={formData.kagitOyunlari}
          onChange={(v) => handleMultiChange("kagitOyunlari", v)}
          placeholder={
            canliOyunSelected
              ? "Oyun seçiniz..."
              : "Sadece Casino Canlı Oyun için geçerli"
          }
          isDisabled={!canliOyunSelected}
          error={errors.kagitOyunlari}
          isMulti
          styles={customStyles}
        />
      </div>

      {/* 3. satır: Lojman + Tercih Nedeni */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <div className="lg:col-span-2">
          <SelectField
            label="Lojman Talebi"
            name="lojman"
            options={[
              { value: "", label: "Lütfen seçiniz", isDisabled: true },
              ...lojmanOptions,
            ]}
            value={
              lojmanOptions.find((o) => o.value === formData.lojman) || {
                value: "",
                label: "Lütfen seçiniz",
                isDisabled: true,
              }
            }
            onChange={(v) => handleSingleChange("lojman", v)}
            placeholder="Lojman durumu seçiniz..."
            error={errors.lojman}
            styles={customStyles}
          />
        </div>

        <div className="lg:col-span-10 flex flex-col">
          <label
            htmlFor="tercihNedeni"
            className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1"
          >
            Neden Bizi Tercih Ettiniz? <span className="text-red-500">*</span>
          </label>

          <textarea
            id="tercihNedeni"
            name="tercihNedeni"
            rows={2}
            maxLength={500}
            placeholder="Kısa bir açıklama yazınız (örneğin: kariyer gelişimi, ekip kültürü, lokasyon vb.)"
            value={formData.tercihNedeni}
            onChange={(e) =>
              handleSingleChange("tercihNedeni", { value: e.target.value })
            }
            className={`w-full rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none resize-none shadow-none border ${
              errors.tercihNedeni
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />

          <div className="flex justify-between items-center mt-1">
            {errors.tercihNedeni ? (
              <p className="text-xs text-red-600 font-medium">
                {errors.tercihNedeni}
              </p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ${
                formData.tercihNedeni.length >= 480
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {formData.tercihNedeni.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* --- Önizleme --- */}
      <div className="mt-10 bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8 transition-all">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faEye} className="text-red-600 text-lg" />
          Önizleme Bilgileri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm sm:text-[15px] text-gray-700">
          {[
            {
              icon: faBuilding,
              label: "Şubeler",
              value: formData.subeler.map((s) => s.label).join(", "),
            },
            {
              icon: faLayerGroup,
              label: "Alanlar",
              value: formData.alanlar.map((a) => a.label).join(", "),
            },
            {
              icon: faBriefcase,
              label: "Departmanlar",
              value: formData.departmanlar.map((d) => d.label).join(", "),
            },
            {
              icon: faBriefcase,
              label: "Pozisyonlar",
              value: formData.departmanPozisyonlari
                .map((p) => p.label)
                .join(", "),
            },
            {
              icon: faComputer,
              label: "Programlar",
              value: formData.programlar.map((p) => p.label).join(", "),
            },
            {
              icon: faClapperboard,
              label: "Kağıt Oyunları",
              value: formData.kagitOyunlari.map((k) => k.label).join(", "),
            },
            {
              icon: faHouseUser,
              label: "Lojman Talebi",
              value: formData.lojman,
            },
          ].map(({ icon, label, value }, i) => (
            <p
              key={i}
              className="flex items-start gap-2 p-1 sm:p-2 rounded-md hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon
                icon={icon}
                className="mt-0.5 text-gray-400 text-sm sm:text-base"
              />
              <strong className="shrink-0">{label}:</strong>
              <ClampText text={value || "—"} lines={2} />
            </p>
          ))}
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-400 italic text-right">
          <FontAwesomeIcon icon={faCircleInfo} className="mr-1 text-gray-400" />
          Seçtiğiniz bilgiler anlık olarak güncellenmektedir.
        </div>
      </div>
    </div>
  );
});

/* --- Çok satırlı metni 2 satırda kesip tooltip veren yardımcı bileşen --- */
function ClampText({ text, lines = 2 }) {
  return (
    <span
      title={text}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "normal",
        lineHeight: "1.25rem",
      }}
      className="text-gray-800"
    >
      {text}
    </span>
  );
}

/* --- Reusable Select Field --- */
function SelectField({ label, error, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Select {...props} />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default JobApplicationDetails;
