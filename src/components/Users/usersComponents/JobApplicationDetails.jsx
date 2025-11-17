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
import { useTranslation } from "react-i18next";
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
  { onValidChange },
  ref
) {
  const { t, i18n } = useTranslation();

  // --- Sabit veri kümeleri (value sabit, label t() ile)
  const otelDepartments = [
    {
      value: "Otel Resepsiyon",
      label: t("jobDetails.departments.hotelReception"),
    },
    {
      value: "Otel Housekeeping",
      label: t("jobDetails.departments.hotelHousekeeping"),
    },
  ];
  const casinoDepartments = [
    { value: "Casino F&B", label: t("jobDetails.departments.casinoFB") },
    { value: "Casino Kasa", label: t("jobDetails.departments.casinoCashier") },
    { value: "Casino Slot", label: t("jobDetails.departments.casinoSlot") },
    {
      value: "Casino Canlı Oyun",
      label: t("jobDetails.departments.casinoLiveGame"),
    },
  ];

  const departmentPrograms = {
    "Casino F&B": ["Asist"],
    "Casino Kasa": ["drCage"],
    "Casino Slot": ["Asist", "drReports"],
    "Casino Canlı Oyun": [],
    "Otel Resepsiyon": ["Opera PMS"],
    "Otel Housekeeping": ["HotelLogix"],
  };

  // role label’larını da t() ile üretelim
  const departmentRoles = {
    "Casino F&B": [
      t("jobDetails.roles.waiter"),
      t("jobDetails.roles.bartender"),
      t("jobDetails.roles.barback"),
      t("jobDetails.roles.commis"),
      t("jobDetails.roles.supervisor"),
    ],
    "Casino Kasa": [
      t("jobDetails.roles.cashier"),
      t("jobDetails.roles.cageSupervisor"),
    ],
    "Casino Slot": [
      t("jobDetails.roles.slotAttendant"),
      t("jobDetails.roles.slotTechnician"),
      t("jobDetails.roles.host"),
    ],
    "Casino Canlı Oyun": [
      t("jobDetails.roles.dealer"),
      t("jobDetails.roles.inspector"),
      t("jobDetails.roles.pitboss"),
    ],
    "Otel Resepsiyon": [
      t("jobDetails.roles.receptionist"),
      t("jobDetails.roles.guestRelations"),
      t("jobDetails.roles.nightAuditor"),
    ],
    "Otel Housekeeping": [
      t("jobDetails.roles.roomAttendant"),
      t("jobDetails.roles.floorSupervisor"),
      t("jobDetails.roles.laundry"),
    ],
  };

  const kagitOyunlariList = [
    { value: "Poker", label: t("jobDetails.cards.poker") },
    { value: "Blackjack", label: t("jobDetails.cards.blackjack") },
    { value: "Baccarat", label: t("jobDetails.cards.baccarat") },
    { value: "Roulette", label: t("jobDetails.cards.roulette") },
    { value: "Texas Hold’em", label: t("jobDetails.cards.texasHoldem") },
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

  // --- Seçenek listeleri (branch adları yer/ad olduğundan çevirmiyoruz)
  const subeOptions = [
    { value: "Prestige", label: "Prestige" },
    { value: "Girne", label: "Girne" },
  ];
  const alanOptions = [
    { value: "Otel", label: t("jobDetails.areas.hotel") },
    { value: "Casino", label: t("jobDetails.areas.casino") },
  ];
  const lojmanOptions = [
    { value: "Evet", label: t("jobDetails.housing.yes") },
    { value: "Hayır", label: t("jobDetails.housing.no") },
  ];

  // --- Alan, departman, program ilişkileri ---
  const availableDepartments = useMemo(() => {
    let list = [];
    if (formData.alanlar.some((a) => a.value === "Otel"))
      list.push(...otelDepartments);
    if (formData.alanlar.some((a) => a.value === "Casino"))
      list.push(...casinoDepartments);
    return list;
    // i18n değişince label’lar güncellensin
  }, [formData.alanlar, i18n.language]);

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
      const roleLabels = departmentRoles[d.value] || [];
      const roles = roleLabels.map((r) => ({
        value: `${d.value}::${r}`,
        label: r,
        dept: d.value,
      }));
      if (roles.length) {
        // group label: departman label’ını bul
        const deptLabel =
          [...otelDepartments, ...casinoDepartments].find(
            (x) => x.value === d.value
          )?.label || d.value;
        groups.push({ label: deptLabel, options: roles });
      }
    });
    return groups;
  }, [formData.departmanlar, i18n.language]);

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
      "&:hover": { borderColor: "#000000" },
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
      subeler: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.branchRequired")
      ),
      alanlar: arrayNonEmpty(optionSchema, t("jobDetails.errors.areaRequired")),
      departmanlar: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.departmentRequired")
      ),
      programlar: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.programRequired")
      ),
      departmanPozisyonlari: z.array(roleOptionSchema).optional().default([]),
      kagitOyunlari: z.array(optionSchema).optional().default([]),
      lojman: z
        .string()
        .refine(
          (v) => ["Evet", "Hayır"].includes(v),
          t("jobDetails.errors.housingRequired")
        ),
      tercihNedeni: z
        .string()
        .min(1, t("jobDetails.errors.reasonRequired"))
        .regex(
          /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
          t("jobDetails.errors.reasonChars")
        )
        .max(500, t("jobDetails.errors.reasonMax")),
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
          message: t("jobDetails.errors.rolesRequired"),
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
          message: t("jobDetails.errors.cardGamesRequired"),
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

  useEffect(() => {
    validateAll(formData, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, i18n.language]); // dil değişince de yeniden değerlendir

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
          <strong>📋 {t("jobDetails.info.title")}</strong>{" "}
          {t("jobDetails.info.bodyBase")}{" "}
          <span className="font-semibold text-red-500">
            {t("jobDetails.info.requiredNote")}
          </span>{" "}
          {t("jobDetails.info.liveGameNote")}{" "}
          {availableRoles.length > 0 && (
            <span className="ml-1">{t("jobDetails.info.rolesNote")}</span>
          )}
        </p>
      </div>

      {/* Form Alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <SelectField
          label={t("jobDetails.labels.branches")}
          name="subeler"
          options={subeOptions}
          value={formData.subeler}
          onChange={(v) => handleMultiChange("subeler", v)}
          placeholder={t("jobDetails.placeholders.selectBranch")}
          error={errors.subeler}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label={t("jobDetails.labels.areas")}
          name="alanlar"
          options={alanOptions}
          value={formData.alanlar}
          onChange={(v) => handleMultiChange("alanlar", v)}
          placeholder={
            hasSubeSelected
              ? t("jobDetails.placeholders.selectArea")
              : t("jobDetails.placeholders.selectBranchFirst")
          }
          isDisabled={!hasSubeSelected}
          error={errors.alanlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label={t("jobDetails.labels.departments")}
          name="departmanlar"
          options={availableDepartments}
          value={formData.departmanlar}
          onChange={onDepartmentsChange}
          placeholder={
            availableDepartments.length === 0
              ? t("jobDetails.placeholders.selectAreaFirst")
              : t("jobDetails.placeholders.selectDepartment")
          }
          isDisabled={availableDepartments.length === 0}
          error={errors.departmanlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label={t("jobDetails.labels.roles")}
          name="departmanPozisyonlari"
          options={availableRoles}
          value={formData.departmanPozisyonlari}
          onChange={(v) => handleMultiChange("departmanPozisyonlari", v)}
          placeholder={
            needsRoles
              ? t("jobDetails.placeholders.selectRoles")
              : t("jobDetails.placeholders.selectDeptForRoles")
          }
          isDisabled={!needsRoles}
          error={errors.departmanPozisyonlari}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label={t("jobDetails.labels.programs")}
          name="programlar"
          options={availablePrograms}
          value={formData.programlar}
          onChange={(v) => handleMultiChange("programlar", v)}
          placeholder={
            availablePrograms.length === 0
              ? t("jobDetails.placeholders.selectDeptFirst")
              : t("jobDetails.placeholders.selectProgram")
          }
          isDisabled={availablePrograms.length === 0}
          error={errors.programlar}
          isMulti
          styles={customStyles}
        />

        <SelectField
          label={t("jobDetails.labels.cardGames")}
          name="kagitOyunlari"
          options={kagitOyunlariList}
          value={formData.kagitOyunlari}
          onChange={(v) => handleMultiChange("kagitOyunlari", v)}
          placeholder={
            canliOyunSelected
              ? t("jobDetails.placeholders.selectCardGame")
              : t("jobDetails.placeholders.cardGameOnlyForLive")
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
            label={t("jobDetails.labels.housing")}
            name="lojman"
            options={[
              {
                value: "",
                label: t("jobDetails.common.pleaseSelect"),
                isDisabled: true,
              },
              ...lojmanOptions,
            ]}
            value={
              lojmanOptions.find((o) => o.value === formData.lojman) || {
                value: "",
                label: t("jobDetails.common.pleaseSelect"),
                isDisabled: true,
              }
            }
            onChange={(v) => handleSingleChange("lojman", v)}
            placeholder={t("jobDetails.placeholders.selectHousing")}
            error={errors.lojman}
            styles={customStyles}
          />
        </div>

        <div className="lg:col-span-10 flex flex-col">
          <label
            htmlFor="tercihNedeni"
            className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1"
          >
            {t("jobDetails.labels.whyUs")}{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            id="tercihNedeni"
            name="tercihNedeni"
            rows={2}
            maxLength={500}
            placeholder={t("jobDetails.placeholders.whyUs")}
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
          {t("jobDetails.preview.title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm sm:text-[15px] text-gray-700">
          {[
            {
              icon: faBuilding,
              label: t("jobDetails.preview.branches"),
              value: formData.subeler.map((s) => s.label).join(", "),
            },
            {
              icon: faLayerGroup,
              label: t("jobDetails.preview.areas"),
              value: formData.alanlar.map((a) => a.label).join(", "),
            },
            {
              icon: faBriefcase,
              label: t("jobDetails.preview.departments"),
              value: formData.departmanlar.map((d) => d.label).join(", "),
            },
            {
              icon: faBriefcase,
              label: t("jobDetails.preview.roles"),
              value: formData.departmanPozisyonlari
                .map((p) => p.label)
                .join(", "),
            },
            {
              icon: faComputer,
              label: t("jobDetails.preview.programs"),
              value: formData.programlar.map((p) => p.label).join(", "),
            },
            {
              icon: faClapperboard,
              label: t("jobDetails.preview.cardGames"),
              value: formData.kagitOyunlari.map((k) => k.label).join(", "),
            },
            {
              icon: faHouseUser,
              label: t("jobDetails.preview.housing"),
              value: formData.lojman || "—",
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
          {t("jobDetails.preview.liveUpdate")}
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
