// components/Users/tables/OtherPersonalInformationTable.jsx
import { forwardRef, useImperativeHandle, useState } from "react";
import Select from "react-select";

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

    const [touched, setTouched] = useState({});

    useImperativeHandle(ref, () => ({
      getData: () =>
        [formData].filter((d) =>
          Object.values(d).some((v) =>
            Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== ""
          )
        ),
    }));

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: value.trim() === "" }));
    };

    const handleMultiSelect = (selected) => {
      const values = selected ? selected.map((opt) => opt.value) : [];
      setFormData((prev) => ({ ...prev, kktcGecerliBelge: values }));
      setTouched((prev) => ({
        ...prev,
        kktcGecerliBelge: values.length === 0,
      }));
    };

    //  Minimal flat tasarım
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
            {touched.kktcGecerliBelge && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                Zorunlu alan, lütfen seçim yapınız.
              </p>
            )}
          </div>

          {/* Dava Durumu */}
          <SelectField
            label="Dava Durumu"
            name="davaDurumu"
            value={formData.davaDurumu}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.davaDurumu}
            options={[
              { value: "Yok", label: "Yok" },
              { value: "Var", label: "Var" },
            ]}
          />

          {/* Dava Nedeni */}
          <InputField
            label="Dava Nedeni"
            name="davaNedeni"
            value={formData.davaNedeni}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.davaNedeni}
            placeholder="Dava nedenini yazınız"
            disabled={formData.davaDurumu !== "Var"}
          />

          {/* Sigara */}
          <SelectField
            label="Sigara Kullanımı"
            name="sigara"
            value={formData.sigara}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.sigara}
            options={[
              { value: "Evet", label: "Evet" },
              { value: "Hayır", label: "Hayır" },
            ]}
          />

          {/* Kalıcı Rahatsızlık */}
          <SelectField
            label="Kalıcı Rahatsızlık"
            name="kaliciRahatsizlik"
            value={formData.kaliciRahatsizlik}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.kaliciRahatsizlik}
            options={[
              { value: "Evet", label: "Evet" },
              { value: "Hayır", label: "Hayır" },
            ]}
          />

          {/* Rahatsızlık Açıklama */}
          <InputField
            label="Rahatsızlık Açıklaması"
            name="rahatsizlikAciklama"
            value={formData.rahatsizlikAciklama}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.rahatsizlikAciklama}
            placeholder="Rahatsızlığınızı açıklayınız"
            disabled={formData.kaliciRahatsizlik !== "Evet"}
          />

          {/* Ehliyet */}
          <SelectField
            label="Ehliyet Durumu"
            name="ehliyet"
            value={formData.ehliyet}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.ehliyet}
            options={[
              { value: "Var", label: "Var" },
              { value: "Yok", label: "Yok" },
            ]}
          />

          {/* Askerlik */}
          <SelectField
            label="Askerlik Durumu"
            name="askerlik"
            value={formData.askerlik}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.askerlik}
            options={[
              { value: "Yapıldı", label: "Yapıldı" },
              { value: "Yapılmadı", label: "Yapılmadı" },
              { value: "Tecilli", label: "Tecilli" },
              { value: "Muaf", label: "Muaf" },
            ]}
          />

          {/* Boy */}
          <InputField
            label="Boy (cm)"
            name="boy"
            type="number"
            value={formData.boy}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.boy}
            placeholder="Örn. 173"
          />

          {/* Kilo */}
          <InputField
            label="Kilo (kg)"
            name="kilo"
            type="number"
            value={formData.kilo}
            onChange={handleChange}
            onBlur={handleBlur}
            showError={touched.kilo}
            placeholder="Örn. 82"
          />
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
  onBlur,
  placeholder,
  type = "text",
  disabled = false,
  showError,
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
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none transition-none ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
            : ""
        }`}
      />
      {showError && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          Zorunlu alan, lütfen doldurunuz.
        </p>
      )}
    </div>
  );
}

/* --- SelectField --- */
function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  showError,
}) {
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
        onBlur={onBlur}
        required
        className="block w-full h-[43px] rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none transition-none"
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

export default OtherPersonalInformationTable;
