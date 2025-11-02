import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { z } from "zod";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";

/* -------------------- REGEX -------------------- */
const NAME_STRICT_RE = /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/u;
const ORG_JOB_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s'’]+$/u;
const PHONE_RE = /^\+?[0-9\s()-]{8,20}$/;

/* -------------------- ZOD ŞEMASI -------------------- */
const refSchema = z.object({
  calistigiKurum: z.string().min(1, "Çalıştığı kurum seçimi zorunlu."),
  referansAdi: z
    .string()
    .trim()
    .regex(NAME_STRICT_RE, "Ad yalnızca harf ve boşluk içerebilir.")
    .min(2, "Ad en az 2 karakter olmalı.")
    .max(50, "Ad en fazla 50 karakter olabilir."),
  referansSoyadi: z
    .string()
    .trim()
    .regex(NAME_STRICT_RE, "Soyad yalnızca harf ve boşluk içerebilir.")
    .min(2, "Soyad en az 2 karakter olmalı.")
    .max(50, "Soyad en fazla 50 karakter olabilir."),
  referansIsYeri: z
    .string()
    .trim()
    .regex(
      ORG_JOB_RE,
      "İşyeri yalnızca harf, rakam, boşluk, ' ve - içerebilir."
    )
    .min(2, "İşyeri zorunlu.")
    .max(100, "İşyeri en fazla 100 karakter olabilir."),
  referansGorevi: z
    .string()
    .trim()
    .regex(ORG_JOB_RE, "Görev yalnızca harf, rakam, boşluk, ' ve - içerebilir.")
    .min(2, "Görev zorunlu.")
    .max(100, "Görev en fazla 100 karakter olabilir."),
  referansTelefon: z
    .string()
    .trim()
    .min(1, "Telefon zorunlu.")
    .regex(PHONE_RE, "Telefon numarası geçersiz. Örn: +90 5XX XXX XX XX"),
});

/* -------------------- Ortak Alan Sınıfı -------------------- */
const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black focus:border-black";

export default function ReferenceAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    calistigiKurum: "",
    referansAdi: "",
    referansSoyadi: "",
    referansIsYeri: "",
    referansGorevi: "",
    referansTelefon: "",
  });

  const [errors, setErrors] = useState({});

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

  // Modal açıldığında formu doldur / temizle (HATA GÖSTERME)
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        calistigiKurum: initialData.calistigiKurum ?? "",
        referansAdi: initialData.referansAdi ?? "",
        referansSoyadi: initialData.referansSoyadi ?? "",
        referansIsYeri: initialData.referansIsYeri ?? "",
        referansGorevi: initialData.referansGorevi ?? "",
        referansTelefon: initialData.referansTelefon ?? "",
      });
      setErrors({});
    } else {
      setFormData({
        calistigiKurum: "",
        referansAdi: "",
        referansSoyadi: "",
        referansIsYeri: "",
        referansGorevi: "",
        referansTelefon: "",
      });
      setErrors({});
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  /* -------------------- Change bazlı doğrulama (Education ile aynı mantık) -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    const parsed = refSchema.safeParse(next);
    if (!parsed.success) {
      // Değiştirilen alanın hatasını çek
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      setErrors((p) => ({ ...p, [name]: issue ? issue.message : "" }));
    } else {
      // Alan hatasızsa temizle
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  /* -------------------- Geçerlilik ve ipucu -------------------- */
  const isValid = useMemo(
    () => refSchema.safeParse(formData).success,
    [formData]
  );
  const disabledTip = !isValid ? "Tüm zorunlu alanları doğru doldurunuz." : "";

  /* -------------------- Submit -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = refSchema.safeParse(formData);
    if (!parsed.success) {
      const next = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0];
        if (key) next[key] = i.message;
      });
      setErrors(next);
      return;
    }

    const d = parsed.data;
    const payload = {
      calistigiKurum: d.calistigiKurum,
      referansAdi: d.referansAdi.trim(),
      referansSoyadi: d.referansSoyadi.trim(),
      referansIsYeri: d.referansIsYeri.trim(),
      referansGorevi: d.referansGorevi.trim(),
      referansTelefon: d.referansTelefon.trim(),
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-6 py-4">
          <h2 className="text-lg font-semibold truncate">
            {mode === "edit"
              ? "Referans Bilgisi Düzenle"
              : "Referans Bilgisi Ekle"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Kapat"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Çalıştığı Kurum */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Çalıştığı Kurum
                </label>
                <select
                  name="calistigiKurum"
                  value={formData.calistigiKurum}
                  onChange={handleChange}
                  className={`${FIELD_BASE} h-[43px]`}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Bünyemizde / Grubumuzda">
                    Bünyemizde / Grubumuzda
                  </option>
                  <option value="Harici">Harici</option>
                </select>
                {errors.calistigiKurum && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.calistigiKurum}
                  </p>
                )}
              </div>

              {/* Referans Adı */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Adı</label>
                <input
                  type="text"
                  name="referansAdi"
                  value={formData.referansAdi}
                  onChange={handleChange}
                  maxLength={50}
                  className={FIELD_BASE}
                  placeholder="Örn: Mehmet"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.referansAdi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.referansAdi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.referansAdi.length >= 45
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.referansAdi.length}/50
                  </p>
                </div>
              </div>

              {/* Referans Soyadı */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Soyadı
                </label>
                <input
                  type="text"
                  name="referansSoyadi"
                  value={formData.referansSoyadi}
                  onChange={handleChange}
                  maxLength={50}
                  className={FIELD_BASE}
                  placeholder="Örn: Yalçınkaya"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.referansSoyadi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.referansSoyadi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.referansSoyadi.length >= 45
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.referansSoyadi.length}/50
                  </p>
                </div>
              </div>

              {/* İşyeri */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  İşyeri
                </label>
                <input
                  type="text"
                  name="referansIsYeri"
                  value={formData.referansIsYeri}
                  onChange={handleChange}
                  maxLength={100}
                  className={FIELD_BASE}
                  placeholder="Örn: O'Brien Hotels - IT"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.referansIsYeri ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.referansIsYeri}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.referansIsYeri.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.referansIsYeri.length}/100
                  </p>
                </div>
              </div>

              {/* Görev */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Görevi
                </label>
                <input
                  type="text"
                  name="referansGorevi"
                  value={formData.referansGorevi}
                  onChange={handleChange}
                  maxLength={100}
                  className={FIELD_BASE}
                  placeholder="Örn: Senior DevOps Engineer"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.referansGorevi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.referansGorevi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.referansGorevi.length >= 90
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.referansGorevi.length}/100
                  </p>
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="referansTelefon"
                  value={formData.referansTelefon}
                  onChange={handleChange}
                  maxLength={20}
                  className={FIELD_BASE}
                  placeholder="+90 5XX XXX XX XX"
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.referansTelefon ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.referansTelefon}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${
                      formData.referansTelefon.length >= 18
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.referansTelefon.length}/20
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
