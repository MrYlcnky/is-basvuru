// components/Users/tables/JobApplicationDetails.jsx
import { forwardRef, useState, useMemo, useEffect } from "react";
import Select from "react-select";
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
  _,
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
    { value: "Dealer", label: "Dealer" },
  ];
  const departmentPrograms = {
    "Casino F&B": ["Asist"],
    "Casino Kasa": ["drCage"],
    "Casino Slot": ["Asist", "drReports"],
    Dealer: [],
    "Otel Resepsiyon": ["Opera PMS"],
    "Otel Housekeeping": ["HotelLogix"],
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
    kagitOyunlari: [],
    lojman: "",
    tercihNedeni: "",
  });
  const [errors, setErrors] = useState({});

  // --- forwardRef: isValid() fonksiyonunu dışarı aç ---
  useEffect(() => {
    if (!ref) return;
    ref.current = {
      isValid: () => {
        const dealerSelected = formData.departmanlar.some(
          (d) => d.value === "Dealer"
        );
        const required =
          formData.subeler.length > 0 &&
          formData.alanlar.length > 0 &&
          formData.departmanlar.length > 0 &&
          formData.programlar.length > 0 &&
          formData.lojman &&
          formData.tercihNedeni.trim() !== "" &&
          (!dealerSelected || formData.kagitOyunlari.length > 0);
        return required;
      },
    };
  }, [ref, formData]);

  // --- Handlers ---
  const handleMultiChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value || [] }));
  const handleSingleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value ? value.value : "" }));

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

  const dealerSelected = formData.departmanlar.some(
    (d) => d.value === "Dealer"
  );
  const hasSubeSelected = formData.subeler.length > 0;

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

  // --- react-select stil ---
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
      border: "1px solid #d1d5db",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": { borderColor: "#9ca3af" },
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

  // --- Zorunlu alan kontrolü ---
  useEffect(() => {
    const newErrors = {};
    if (formData.subeler.length === 0) newErrors.subeler = true;
    if (formData.alanlar.length === 0) newErrors.alanlar = true;
    if (formData.departmanlar.length === 0) newErrors.departmanlar = true;
    if (formData.programlar.length === 0) newErrors.programlar = true;
    if (!formData.lojman) newErrors.lojman = true;
    if (dealerSelected && formData.kagitOyunlari.length === 0)
      newErrors.kagitOyunlari = true;
    setErrors(newErrors);
    if (!formData.tercihNedeni.trim()) newErrors.tercihNedeni = true;
  }, [formData, dealerSelected]);

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8">
      {/* Bilgilendirme Alanı */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md shadow-sm">
        <p className="text-sm sm:text-base leading-relaxed">
          <strong>📋 Başvuru Detayları:</strong> Bu bölümde çalışmak istediğiniz{" "}
          <strong>şube, alan, departman ve program bilgilerini</strong>{" "}
          seçebilirsiniz.{" "}
          <span className="font-semibold text-red-500">
            Tüm alanlar zorunludur.
          </span>{" "}
          Eğer <strong>Dealer</strong> seçerseniz,{" "}
          <strong>Kağıt Oyun Bilgisi</strong> de zorunlu hale gelir.
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
          onChange={(v) => handleMultiChange("departmanlar", v)}
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
          label="Kağıt Oyun Bilgisi (Dealer için)"
          name="kagitOyunlari"
          options={kagitOyunlariList}
          value={formData.kagitOyunlari}
          onChange={(v) => handleMultiChange("kagitOyunlari", v)}
          placeholder={
            dealerSelected ? "Oyun seçiniz..." : "Sadece Dealer için geçerli"
          }
          isDisabled={!dealerSelected}
          error={dealerSelected && errors.kagitOyunlari}
          isMulti
          styles={customStyles}
        />

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

        {/* Neden Bizi Tercih Ettiniz */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label
            htmlFor="tercihNedeni"
            className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1"
          >
            Neden Bizi Tercih Ettiniz? <span className="text-red-500">*</span>
          </label>

          <textarea
            id="tercihNedeni"
            name="tercihNedeni"
            rows={4}
            maxLength={500}
            placeholder="Kısa bir açıklama yazınız (örneğin: kariyer gelişimi, ekip kültürü, lokasyon vb.)"
            value={formData.tercihNedeni}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tercihNedeni: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none resize-none shadow-none"
          />

          <div className="flex justify-between items-center mt-1">
            {errors.tercihNedeni && (
              <p className="text-xs text-red-600 font-medium">
                Zorunlu alan, lütfen doldurunuz.
              </p>
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
              className="flex items-center gap-2 p-1 sm:p-2 rounded-md hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon
                icon={icon}
                className="text-gray-400 text-sm sm:text-base"
              />
              <strong>{label}:</strong>{" "}
              <span className="text-gray-800 truncate">{value || "—"}</span>
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

/* --- Reusable Select Field --- */
function SelectField({ label, error, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Select {...props} />
      {error && <p className="text-red-600 text-xs mt-1">Zorunlu alan</p>}
    </div>
  );
}

export default JobApplicationDetails;
