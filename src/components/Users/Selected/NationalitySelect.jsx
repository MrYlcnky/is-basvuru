import { useMemo, useEffect, useState } from "react";
import Select from "react-select";
import nationalityData from "../../../json/country_city_nationality.json";

export default function NationalitySelect({
  label = "Uyruğu",
  id = "nationality",
  name = "nationality",
  defaultValue = "",
  onChange,
  className = "",
  placeholder = "Örn. T.C.",
}) {
  // Seçenekleri oluştur
  const options = useMemo(() => {
    const items = (nationalityData || [])
      .map((n) =>
        typeof n === "string"
          ? n
          : n?.code && n?.nationality
          ? `${n.code} (${n.nationality})`
          : n?.name
      )
      .filter(Boolean);
    const uniq = [...new Set(items)].sort((a, b) => a.localeCompare(b, "tr"));
    return uniq.map((n) => ({ value: n, label: n }));
  }, []);

  const [selected, setSelected] = useState(
    defaultValue ? { value: defaultValue, label: defaultValue } : null
  );

  // Dokunulma (blur) kontrolü
  const [touched, setTouched] = useState(false);

  // Parent'a bildir
  useEffect(() => {
    onChange?.(selected?.value || "");
  }, [selected, onChange]);

  // ---- React-Select görünümü: CountryCitySelect ile aynı ----
  const rsClassNames = {
    container: () => "w-full",
    control: ({ isFocused, isDisabled }) =>
      [
        "w-full h-[43px] rounded-lg border px-3",
        "bg-white",
        isDisabled
          ? "opacity-70 cursor-not-allowed bg-gray-100"
          : "cursor-pointer",
        isFocused
          ? "border-blue-500"
          : "border-gray-300 hover:border-gray-400 focus:border-blue-500",
        "transition focus:outline-none",
      ].join(" "),
    valueContainer: () => "py-1 gap-1",
    placeholder: () => "text-gray-400",
    singleValue: () => "text-gray-900",
    input: () => "text-gray-900",
    indicatorsContainer: () => "gap-1",
    indicatorSeparator: () => "hidden",
    dropdownIndicator: ({ isFocused }) =>
      ["transition", isFocused ? "text-blue-600" : "text-gray-500"].join(" "),
    clearIndicator: () => "text-gray-500 hover:text-red-600",
    menu: () =>
      "mt-1 border border-gray-200 rounded-md bg-white shadow-lg overflow-hidden",
    menuList: () => "max-h-56 overflow-auto",
    option: ({ isFocused, isSelected }) =>
      [
        "px-3 py-2 cursor-pointer",
        isSelected ? "bg-blue-600 text-white" : isFocused ? "bg-gray-100" : "",
      ].join(" "),
    noOptionsMessage: () => "px-3 py-2 text-gray-500",
  };

  const rsStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const sharedProps = {
    unstyled: true,
    classNames: rsClassNames,
    styles: rsStyles,
    menuPortalTarget: typeof document !== "undefined" ? document.body : null,
    maxMenuHeight: 200,
    isSearchable: true,
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>

      <Select
        inputId={id}
        name={name}
        options={options}
        value={selected}
        required
        onChange={setSelected}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        {...sharedProps}
      />

      {/* Uyarı mesajı */}
      {touched && !selected && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          Zorunlu alan, lütfen seçim yapınız.
        </p>
      )}
    </div>
  );
}
