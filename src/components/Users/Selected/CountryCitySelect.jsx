// components/Users/Selected/CountryCitySelect.jsx
import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import countriesData from "../../../json/country_city_nationality.json";

export default function CountryCitySelect({
  countryLabel = "Ülke",
  cityLabel = "Şehir",
  countryId = "country",
  cityId = "city",
  onChange,
  defaultCountry = "",
  defaultCity = "",
  className = "",
  countryPlaceholder = "Seçiniz",
  cityPlaceholder = "Seçiniz",
}) {
  // Ülke seçenekleri
  const countryOptions = useMemo(() => {
    const names = (countriesData || []).map((c) => c?.name).filter(Boolean);
    const uniq = [...new Set(names)].sort((a, b) => a.localeCompare(b, "tr"));
    return uniq.map((n) => ({ value: n, label: n }));
  }, []);

  const [country, setCountry] = useState(
    defaultCountry ? { value: defaultCountry, label: defaultCountry } : null
  );
  const [city, setCity] = useState(
    defaultCity ? { value: defaultCity, label: defaultCity } : null
  );

  // Seçilen ülkeye göre şehir/state listesi
  const cityOptions = useMemo(() => {
    if (!country) return [];
    const entry = countriesData.find((x) => x?.name === country.value);
    const states = (entry?.states || [])
      .map((s) => (typeof s === "string" ? s : s?.name))
      .filter(Boolean);

    const uniq = [...new Set(states)].sort((a, b) => a.localeCompare(b, "tr"));
    const options = uniq.map((s) => ({ value: s, label: s }));
    return options.length ? options : [{ value: "none", label: "Şehri Yok" }];
  }, [country?.value]);

  // Ülke değişince şehir seçimini resetle / defaultCity varsa uygula
  useEffect(() => {
    if (!country) {
      setCity(null);
      return;
    }
    if (defaultCity) {
      const hit = cityOptions.find((o) => o.value === defaultCity);
      setCity(hit ?? null);
    } else {
      if (cityOptions.length === 1 && cityOptions[0].value === "none") {
        setCity(cityOptions[0]);
      } else {
        setCity(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country?.value, defaultCity, cityOptions]);

  // Parent'a bildir
  useEffect(() => {
    onChange?.({ country: country?.value || "", city: city?.value || "" });
  }, [country, city, onChange]);

  // ---- React-Select görünümü: native select’lere benzetildi ----
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
          ? "border-blue-500 "
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
    <>
      {/* Ülke Select */}
      <div className={`w-full ${className}`}>
        <label
          htmlFor={countryId}
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          {countryLabel}
        </label>
        <Select
          inputId={countryId}
          options={countryOptions}
          value={country}
          onChange={(opt) => {
            setCountry(opt);
            setCity(null); // ülke değişince şehir temizle
          }}
          placeholder={countryPlaceholder}
          {...sharedProps}
        />
      </div>

      {/* Şehir Select */}
      <div className={`w-full ${className}`}>
        <label
          htmlFor={cityId}
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          {cityLabel}
        </label>
        <Select
          inputId={cityId}
          options={cityOptions}
          value={city}
          onChange={setCity}
          placeholder={
            !country
              ? `Önce ${countryLabel.toLowerCase()} seçin`
              : cityPlaceholder
          }
          isDisabled={!country || cityOptions.length === 0}
          {...sharedProps}
        />
      </div>
    </>
  );
}
