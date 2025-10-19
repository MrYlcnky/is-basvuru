import { useState } from "react";
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
  const [checks, setChecks] = useState({
    dogruluk: false,
    kvkk: false,
    referans: false,
  });

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setChecks((prev) => ({ ...prev, [id]: checked }));
  };

  // 🔹 Başvuru butonuna tıklanınca
  const handleSubmit = () => {
    const missingSections = [];

    //  1. Kişisel Bilgiler
    const personalValid = validatePersonalInfo?.() ?? false;
    if (!personalValid) missingSections.push("Kişisel Bilgiler");

    //  2. Eğitim Bilgileri
    const educationValid = (educationRef.current?.getData?.() ?? []).length > 0;
    if (!educationValid) missingSections.push("Eğitim Bilgileri");

    //  3. Diğer Kişisel Bilgiler
    const otherValid = (otherInfoRef.current?.getData?.() ?? []).length > 0;
    if (!otherValid) missingSections.push("Diğer Kişisel Bilgiler");

    //  4. İş Başvuru Detayları
    const jobValid = validateJobDetails?.() ?? false;
    if (!jobValid) missingSections.push("İş Başvuru Detayları");

    //  5. Onay Kutuları
    const allChecked = Object.values(checks).every(Boolean);
    if (!allChecked) missingSections.push("Onay Kutuları");

    //  Eksik varsa SweetAlert2 ile bildir
    if (missingSections.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Eksik Bilgi!",
        html: `
          <div style="text-align:left">
            <p>Lütfen aşağıdaki bölümleri doldurunuz:</p>
            <ul style="margin-top:8px; line-height:1.6; font-weight:500; color:#d33">
              ${missingSections.map((s) => `<li>• ${s}</li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonColor: "#d33",
        confirmButtonText: "Tamam",
      });
      return;
    }

    //  Her şey tamamsa başarı mesajı
    toast.success("Başvurunuz başarıyla gönderildi!", {
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
          title="Doğruluk Beyanı"
          text="Bu başvuru formunu imzalarken belirtilen her şeyin doğru ve eksiksiz olduğunu kabul ediyorum."
          checked={checks.dogruluk}
          onChange={handleCheck}
        />

        <ConfirmCard
          id="kvkk"
          icon={faUserShield}
          title="Kişisel Verilerin İşlenmesi"
          text="Başvurumu kabul ederek, kişisel verilerimin işlenmesini ve saklanmasını onaylıyorum."
          checked={checks.kvkk}
          onChange={handleCheck}
        />

        <ConfirmCard
          id="referans"
          icon={faPhoneVolume}
          title="Referans Kontrolü İzni"
          text="Referanslarımla iletişime geçilmesine onay veriyorum."
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
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>BAŞVUR</span>
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
            />
            <label
              htmlFor={id}
              className="text-sm text-gray-800 leading-snug cursor-pointer select-none"
            >
              <strong>{title}:</strong>
              <br />
              <span className="text-gray-700">{`“${text}”`}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationConfirmSection;
