// components/Fields/MuiDateStringField.jsx
import * as React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import trLocale from "date-fns/locale/tr";

/* "YYYY-MM-DD" <-> Date helpers */
function strToDate(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}
function dateToStr(d) {
  if (!d || Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MuiDateStringField({
  label = "Tarih",
  name = "tarih",
  value, // "YYYY-MM-DD"
  onChange, // handleChange({ target: { name, value: "YYYY-MM-DD" } })
  required = false,
  error, // string | undefined
  min, // "YYYY-MM-DD"
  max, // "YYYY-MM-DD"
  disabled = false, // tamamen kilitle
  readOnly = false, // klavyeyi kapat ama picker açık kalsın
  displayFormat = "yyyy.MM.dd", // MUI üzerinde görünen format
  // stil ayarları
  borderGray = "#D1D5DB", // gray-300
  borderGrayHover = "#9CA3AF", // gray-400
  borderGrayFocus = "#D1D5DB", // InputField’de özel focus yok → aynı gri
  textSm = "0.875rem", // text-sm
  placeholderColor = "#9CA3AF", // text-gray-400
}) {
  const dateVal = strToDate(value);

  const handleMuiChange = (d) => {
    if (!d || Number.isNaN(d.getTime())) {
      onChange?.({ target: { name, value: "" } }); // temizle
      return;
    }
    onChange?.({ target: { name, value: dateToStr(d) } });
  };

  const outlineColor = error ? "#EF4444" /* red-500 */ : borderGray;

  return (
    <div className="mt-1">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={trLocale}
      >
        <DatePicker
          value={dateVal}
          onChange={handleMuiChange}
          format={displayFormat}
          minDate={strToDate(min)}
          maxDate={strToDate(max)}
          disabled={disabled}
          disableOpenPicker={disabled} // tamamen kilitliyken ikon da kapansın
          reduceAnimations // <-- BURAYA
          disableHighlightToday // <-- VE BURAYA
          slotProps={{
            textField: {
              id: name,
              name,
              variant: "outlined",
              fullWidth: true,
              size: "small",
              required,
              error: !!error,
              helperText: error || "",
              disabled,
              inputProps: {
                placeholder: "GG.AA.YYYY",
                readOnly, // sadece klavyeyi engelle
              },
              sx: {
                "& .MuiOutlinedInput-root, & .MuiInputBase-root , & .MuiPickersInputBase-root":
                  {
                    height: 43,
                    borderRadius: "0.5rem",
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    boxShadow: "none !important",
                    outline: "none !important",
                  },
                "& .MuiOutlinedInput-root:hover": { boxShadow: "none" },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  boxShadow: "none !important",
                  outline: "none !important",
                  border: "none",
                },
                "& .MuiOutlinedInput-root:focus-within": {
                  boxShadow: "none !important",
                  outline: "none !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: outlineColor,
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: error ? "#EF4444" : borderGrayHover,
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: error ? "#EF4444" : borderGrayFocus,
                  },
                "& .MuiInputBase-input": {
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 12,
                  paddingRight: 36,
                  fontSize: textSm,
                  color: "#111827",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: placeholderColor,
                  opacity: 1,
                },
                "& .MuiSvgIcon-root": { color: "#6B7280" }, // ikon
                "& .MuiFormHelperText-root": { marginLeft: 0 },
              },
            },
            popper: { placement: "bottom-start" },
            desktopPaper: {
              sx: {
                backgroundColor: "#FFFFFF",
                borderRadius: "0.75rem",
                boxShadow: "none",
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
