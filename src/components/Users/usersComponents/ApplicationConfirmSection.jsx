// components/Users/usersComponents/ApplicationConfirmSection.jsx (veya mevcut yolun)
import { useState } from "react";
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

const ApplicationConfirmSection = ({
  validatePersonalInfo,
  educationRef,
  otherInfoRef,
  validateJobDetails,
}) => {
  const { t } = useTranslation();

  const [checks, setChecks] = useState({
    dogruluk: false,
    kvkk: false,
    referans: false,
  });

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setChecks((prev) => ({ ...prev, [id]: checked }));
  };

  // Başvuru
  const handleSubmit = () => {
    const missingSections = [];

    const personalValid = validatePersonalInfo?.() ?? false;
    if (!personalValid) missingSections.push(t("sections.personal"));

    const educationValid = (educationRef.current?.getData?.() ?? []).length > 0;
    if (!educationValid) missingSections.push(t("sections.education"));

    const otherValid = (otherInfoRef.current?.getData?.() ?? []).length > 0;
    if (!otherValid) missingSections.push(t("sections.other"));

    const jobValid = validateJobDetails?.() ?? false;
    if (!jobValid) missingSections.push(t("sections.jobDetails"));

    const allChecked = Object.values(checks).every(Boolean);
    if (!allChecked) missingSections.push(t("confirm.checks"));

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

    toast.success(t("confirm.toast.success"), {
      position: "top-center",
      autoClose: 3000,
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-10">
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

      {/* Başvur Butonu */}
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out"
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

/* --- Tekil Onay Kartı --- */
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
              className="mt-[6px] h-4 w-4 text-amber-600 border-gray-300 rounded cursor-pointer"
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
              <span
                id={`${id}-desc`}
                className="text-gray-700"
              >{`“${text}”`}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationConfirmSection;
