import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { z } from "zod";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";

/* -------------------- Ortak Sınıflar -------------------- */
const BASE_SELECT =
  "w-full h-[43px] border rounded-lg px-3 py-2 focus:outline-none transition border-gray-300 hover:border-black cursor-pointer";
const BASE_INPUT =
  "w-full h-[43px] border rounded-lg px-3 py-2 focus:outline-none transition border-gray-300 hover:border-black";

/* -------------------- ZOD ŞEMASI -------------------- */
const schema = z.object({
  dil: z
    .string()
    .trim()
    .min(1, "Dil Adı zorunlu.")
    .max(40, "Dil adı en fazla 40 karakter olabilir.")
    .regex(
      /^[a-zA-ZığüşöçİĞÜŞÖÇ\s.-]+$/,
      "Dil adı yalnızca harf, boşluk, nokta ve tire içerebilir."
    ),
  konusma: z.string().min(1, "Konuşma seviyesi zorunlu."),
  yazma: z.string().min(1, "Yazma seviyesi zorunlu."),
  okuma: z.string().min(1, "Okuma seviyesi zorunlu."),
  dinleme: z.string().min(1, "Dinleme seviyesi zorunlu."),
  ogrenilenKurum: z
    .string()
    .trim()
    .min(1, "Nasıl öğrenildiği zorunlu.")
    .max(80, "Bu alan en fazla 80 karakter olabilir.")
    .regex(
      /^[a-zA-ZığüşöçİĞÜŞÖÇ\s.-]+$/,
      "Yalnızca harf, boşluk, nokta ve tire içerebilir."
    ),
});

export default function LanguageAddModal({
  open,
  mode = "create",
  initialData = null, // { id, dil, konusma, yazma, okuma, dinleme, ogrenilenKurum }
  onClose,
  onSave,
  onUpdate,
}) {
  const dialogRef = useRef(null);

  // "Dil" alanını iki parçaya ayırıyoruz: select + diğer metin
  const [dilSelect, setDilSelect] = useState("");
  const [dilOther, setDilOther] = useState("");

  const [formData, setFormData] = useState({
    dil: "",
    konusma: "",
    yazma: "",
    okuma: "",
    dinleme: "",
    ogrenilenKurum: "",
  });

  const [errors, setErrors] = useState({
    dil: "",
    konusma: "",
    yazma: "",
    okuma: "",
    dinleme: "",
    ogrenilenKurum: "",
  });

  const otherRef = useRef(null);

  /* ---------- SCROLL LOCK ---------- */
  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  // Modal her açıldığında formu doldur/temizle
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      const incomingDil = initialData.dil ?? "";
      const isKnown = ["İngilizce", "Almanca"].includes(incomingDil);
      setDilSelect(isKnown ? incomingDil : incomingDil ? "Diğer" : "");
      setDilOther(isKnown ? "" : incomingDil);

      setFormData({
        dil: incomingDil,
        konusma: initialData.konusma ?? "",
        yazma: initialData.yazma ?? "",
        okuma: initialData.okuma ?? "",
        dinleme: initialData.dinleme ?? "",
        ogrenilenKurum: initialData.ogrenilenKurum ?? "",
      });
    } else {
      setDilSelect("");
      setDilOther("");
      setFormData({
        dil: "",
        konusma: "",
        yazma: "",
        okuma: "",
        dinleme: "",
        ogrenilenKurum: "",
      });
    }

    setErrors({
      dil: "",
      konusma: "",
      yazma: "",
      okuma: "",
      dinleme: "",
      ogrenilenKurum: "",
    });
  }, [open, mode, initialData]);

  // backdrop click ile kapat
  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  // Tek handleChange + alan bazlı Zod kontrol
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    const parsed = schema.safeParse(next);
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      setErrors((p) => ({ ...p, [name]: issue ? issue.message : "" }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const isValid = schema.safeParse(formData).success;
  const disabledTip = !isValid
    ? (() => {
        const r = schema.safeParse(formData);
        return r.success
          ? ""
          : r.error.issues.map((i) => i.message).join(" • ");
      })()
    : "";

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const final = schema.safeParse(formData);
    if (!final.success) {
      const next = { ...errors };
      final.error.issues.forEach((i) => {
        const key = i.path[0];
        if (key) next[key] = i.message;
      });
      setErrors(next);
      return;
    }

    const payload = final.data;
    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    handleClose(); // kilidi kaldır + kapat
  };

  if (!open) return null;

  const dilCounterColor =
    dilOther.length >= 36 ? "text-red-500" : "text-gray-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit"
              ? "Yabancı Dil Bilgisi Düzenle"
              : "Yabancı Dil Bilgisi Ekle"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 1 Dil - (Diğer Dil Adı) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Dil Adı */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Dil Adı
                </label>

                <select
                  value={dilSelect}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDilSelect(v);
                    if (v !== "Diğer") setDilOther("");

                    const effective = v === "Diğer" ? "" : v;
                    handleChange({ target: { name: "dil", value: effective } });

                    if (v === "Diğer")
                      setTimeout(() => otherRef.current?.focus(), 0);
                  }}
                  className={`${BASE_SELECT} ${
                    errors.dil ? "border-red-500 hover:border-red-500" : ""
                  }`}
                  required
                  aria-invalid={Boolean(errors.dil)}
                  aria-describedby="err-dil"
                >
                  <option value="">Seçiniz</option>
                  <option value="İngilizce">İngilizce</option>
                  <option value="Almanca">Almanca</option>
                  <option value="Diğer">Diğer</option>
                </select>

                <div className="mt-1 min-h-[1rem]">
                  {errors.dil && (
                    <p
                      id="err-dil"
                      className="text-xs text-red-600 font-medium"
                    >
                      {errors.dil}
                    </p>
                  )}
                </div>
              </div>

              {/* Diğer Dil Adı */}
              <div className="sm:col-span-2 relative">
                <label className="block text-sm text-gray-600 mb-1">
                  Diğer Dil Adı
                </label>

                <input
                  ref={otherRef}
                  type="text"
                  value={dilOther}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDilOther(v);
                    if (dilSelect === "Diğer") {
                      handleChange({ target: { name: "dil", value: v } });
                    }
                  }}
                  disabled={dilSelect !== "Diğer"}
                  placeholder={
                    dilSelect === "Diğer"
                      ? "Örn: Fransızca"
                      : "Önce 'Diğer'i seçin"
                  }
                  className={
                    dilSelect === "Diğer"
                      ? `${BASE_INPUT} pr-14 bg-white text-gray-900`
                      : "w-full h-[43px] border rounded-lg px-3 py-2 pr-14 bg-gray-200 text-gray-500 border-gray-300 disabled:cursor-not-allowed focus:outline-none"
                  }
                  maxLength={40}
                  aria-describedby="dil-other-counter"
                />

                <span
                  id="dil-other-counter"
                  className={`absolute right-3 bottom-1 text-xs ${dilCounterColor}`}
                >
                  {dilOther.length}/40
                </span>
              </div>
            </div>

            {/* 2 Konuşma - Yazma - Okuma - Dinleme */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                ["konusma", "Konuşma Seviyesi"],
                ["yazma", "Yazma Seviyesi"],
                ["okuma", "Okuma Seviyesi"],
                ["dinleme", "Dinleme Seviyesi"],
              ].map(([name, label]) => (
                <div key={name} className="sm:col-span-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    {label}
                  </label>
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`${BASE_SELECT} ${
                      errors[name] ? "border-red-500 hover:border-red-500" : ""
                    }`}
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* 3 Nasıl Öğrenildi */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Nasıl Öğrenildi
                </label>
                <input
                  type="text"
                  name="ogrenilenKurum"
                  value={formData.ogrenilenKurum}
                  onChange={handleChange}
                  className={`${BASE_INPUT}`}
                  placeholder="Örn: Kurs, okul, kendi kendine..."
                  maxLength={80}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.ogrenilenKurum ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.ogrenilenKurum}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.ogrenilenKurum.length >= 72
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.ogrenilenKurum.length}/80
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alt aksiyon bar (butonlar) */}
          <div className="border-t bg-white px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
              >
                İptal
              </button>

              {mode === "create" ? (
                <button
                  type="submit"
                  disabled={!isValid}
                  title={disabledTip}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                    isValid
                      ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 cursor-pointer"
                      : "bg-blue-300 opacity-90 cursor-not-allowed"
                  }`}
                >
                  Kaydet
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid}
                  title={disabledTip}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                    isValid
                      ? "bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 cursor-pointer"
                      : "bg-green-300 opacity-90 cursor-not-allowed"
                  }`}
                >
                  Güncelle
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
