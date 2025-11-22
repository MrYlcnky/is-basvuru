import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUserShield,
  faPhoneVolume,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

// .env dosyanızda VITE_RECAPTCHA_SITE_KEY tanımlı olmalıdır
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ApplicationConfirmSection = ({
  validatePersonalInfo,
  educationRef,
  otherInfoRef,
  validateJobDetails,
  onSubmit, // Parent bileşenden (JobApplicationForm) gelen güvenli submit fonksiyonu
}) => {
  const { t, i18n } = useTranslation();

  const [checks, setChecks] = useState({
    dogruluk: false,
    kvkk: false,
    referans: false,
  });

  // reCAPTCHA referansı ve state'i
  const recaptchaRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setChecks((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async () => {
    const missingSections = [];

    // 1. Bölüm Validasyonları
    const personalValid = validatePersonalInfo?.() ?? false;
    if (!personalValid) missingSections.push(t("sections.personal"));

    const educationValid = (educationRef.current?.getData?.() ?? []).length > 0;
    if (!educationValid) missingSections.push(t("sections.education"));

    const otherValid = (otherInfoRef.current?.getData?.() ?? []).length > 0;
    if (!otherValid) missingSections.push(t("sections.other"));

    const jobValid = validateJobDetails?.() ?? false;
    if (!jobValid) missingSections.push(t("sections.jobDetails"));

    // 2. Checkbox Kontrolü
    const allChecked = Object.values(checks).every(Boolean);
    if (!allChecked) missingSections.push(t("confirm.checks"));

    // 3. ReCAPTCHA Kontrolü
    if (!recaptchaToken) missingSections.push("reCAPTCHA");

    // Hata varsa uyarı göster
    if (missingSections.length > 0) {
      Swal.fire({
        icon: "error",
        title: t("confirm.missing.title"),
        html: `
          <div style="text-align:left">
            <p>${t("confirm.missing.bodyIntro")}</p>
            <ul style="margin-top:8px; line-height:1.6; font-weight:600; color:#d33">
              ${missingSections.map((s) => `<li>• ${s}</li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonColor: "#d33",
        confirmButtonText: t("actions.close"),
      });
      return;
    }

    // Validasyon başarılıysa Parent'a gönder
    if (onSubmit) {
      // Token'ı ve başarı callback'ini gönderiyoruz
      onSubmit(recaptchaToken, () => {
        // İşlem başarılı olursa formu/captcha'yı sıfırla
        recaptchaRef.current?.reset();
        setRecaptchaToken("");
        setChecks({ dogruluk: false, kvkk: false, referans: false });
        toast.success(t("confirm.toast.success"));
      });
    } else {
      // Fallback (Eğer onSubmit prop'u yoksa)
      console.warn("onSubmit prop'u eksik!");
      toast.success(t("confirm.toast.success"));
    }
  };

  // ReCAPTCHA dil ayarı
  const captchaHl = (i18n.resolvedLanguage || i18n.language || "tr")
    .slice(0, 2)
    .toLowerCase();

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-10 pb-10">
      {/* Onay Kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConfirmCard
          id="dogruluk"
          icon={faCheckCircle}
          title={t("confirm.cards.truth.title")}
          text={t("confirm.cards.truth.text")}
          checked={checks.dogruluk}
          onChange={handleCheck}
        />
        <ConfirmCard
          id="kvkk"
          icon={faUserShield}
          title={t("confirm.cards.kvkk.title")}
          text={t("confirm.cards.kvkk.text")}
          checked={checks.kvkk}
          onChange={handleCheck}
        />
        <ConfirmCard
          id="referans"
          icon={faPhoneVolume}
          title={t("confirm.cards.reference.title")}
          text={t("confirm.cards.reference.text")}
          checked={checks.referans}
          onChange={handleCheck}
        />
      </div>

      {/* reCAPTCHA ve Başvuru Butonu */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="recaptcha-wrap focus:outline-none focus:ring-0">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            onChange={(t) => setRecaptchaToken(t || "")}
            theme="light"
            size="normal"
            hl={captchaHl}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!recaptchaToken}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out active:scale-95
            ${
              recaptchaToken
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          aria-label={t("confirm.submit")}
          title={t("confirm.submit")}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>{t("confirm.submit")}</span>
        </button>
      </div>
    </div>
  );
};

function ConfirmCard({ id, icon, title, text, checked, onChange }) {
  return (
    <div className="flex flex-col bg-gray-100 border border-gray-300 rounded-lg shadow-sm p-4 transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <FontAwesomeIcon
          icon={icon}
          className="text-amber-600 text-2xl mt-1 shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <input
              className="mt-[6px] h-4 w-4 text-amber-600 border-gray-300 rounded cursor-pointer focus:ring-amber-500"
              type="checkbox"
              id={id}
              checked={checked}
              onChange={onChange}
              required
              aria-checked={checked}
              aria-describedby={`${id}-desc`}
            />
            <label
              htmlFor={id}
              className="text-sm text-gray-800 leading-snug cursor-pointer select-none"
            >
              <strong>{title}:</strong>
              <br />
              <span id={`${id}-desc`} className="text-gray-700">
                {`“${text}”`}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationConfirmSection;
