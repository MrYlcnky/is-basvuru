// components/Users/JobApplicationForm.jsx
import { useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faPlus,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
  faCheckCircle,
  faCircleXmark,
  faCircleMinus,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

import PersonalInformation from "./usersComponents/PersonalInformation";
import EducationTable from "./usersComponents/EducationTable";
import CertificateTable from "./usersComponents/CertificatesTable";
import ComputerInformationTable from "./usersComponents/ComputerInformationTable";
import LanguageTable from "./usersComponents/LanguageTable";
import JobExperiencesTable from "./usersComponents/JobExperiencesTable";
import ReferencesTable from "./usersComponents/ReferencesTable";
import OtherPersonalInformationTable from "./usersComponents/OtherPersonalInformationTable";
import JobApplicationDetails from "./usersComponents/JobApplicationDetails";
import ApplicationConfirmSection from "./usersComponents/ApplicationConfirmSection";
import { lockScroll } from "./modalHooks/scrollLock";

export default function JobApplicationForm() {
  const personalInfoRef = useRef(null);
  const educationTableRef = useRef(null);
  const certificatesTableRef = useRef(null);
  const computerInformationTableRef = useRef(null);
  const languageTableRef = useRef(null);
  const jobExperiencesTableRef = useRef(null);
  const referencesTableRef = useRef(null);
  const otherPersonalInformationTableRef = useRef(null);
  const jobApplicationDetailsRef = useRef(null);

  // Tüm "Ekle" butonları için ortak handler:
  const onAddWithScrollLock = (fn) => () => {
    lockScroll();
    fn?.();
  };

  /* ---------- Zorunlu Bölümler (event-driven) ---------- */
  const [statuses, setStatuses] = useState({
    personalOk: false,
    educationOk: false,
    otherOk: false,
    jobDetailsOk: false,
  });

  const onPersonalValidChange = (ok) =>
    setStatuses((s) => (s.personalOk === ok ? s : { ...s, personalOk: ok }));

  const onEducationHasRowChange = (ok) =>
    setStatuses((s) => (s.educationOk === ok ? s : { ...s, educationOk: ok }));

  const onOtherValidChange = (ok) =>
    setStatuses((s) => (s.otherOk === ok ? s : { ...s, otherOk: ok }));

  const onJobDetailsValidChange = (ok) =>
    setStatuses((s) =>
      s.jobDetailsOk === ok ? s : { ...s, jobDetailsOk: ok }
    );

  const allRequiredOk = useMemo(
    () =>
      statuses.personalOk &&
      statuses.educationOk &&
      statuses.otherOk &&
      statuses.jobDetailsOk,
    [statuses]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-500 to-gray-600 pb-10 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] border border-gray-400/20">
      {/* === HERO HEADER === */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 py-12 sm:py-16 md:py-20 shadow-2xl rounded-2xl text-center">
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-amber-200">
              CHAMADA GROUP
            </span>
            <span className="block mt-2 text-gray-300 font-light text-lg sm:text-2xl">
              İŞ BAŞVURU FORMU
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-300 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="text-amber-300" />
            <span className="text-center">
              <span className="font-semibold text-amber-300">Lütfen</span> tüm
              bilgilerinizi dikkatli ve eksiksiz doldurunuz.{" "}
              <span className="font-semibold text-amber-300">*</span> işaretli
              alanlar zorunludur.
            </span>
          </p>

          <div className="mt-6 mx-auto w-24 sm:w-32 h-[3px] bg-gradient-to-r from-gray-200 via-amber-300 to-gray-200 rounded-full" />
        </div>

        {/* Arka plan glow */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-amber-100/10 blur-3xl rounded-full" />
      </div>

      {/* === Zorunlu Bölümler (Sticky Status Bar) === */}
      <div className="sticky top-4 z-40 container mx-auto px-3 sm:px-6 lg:px-10 mt-4">
        <div className="bg-white/90 rounded-lg border border-gray-200 shadow-md px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-sm text-gray-700 font-medium mr-1">
            Zorunlu Bölümler:
          </span>
          <StatusPill ok={statuses.personalOk} label="Kişisel Bilgiler" />
          <StatusPill ok={statuses.educationOk} label="Eğitim Bilgileri" />
          <StatusPill ok={statuses.otherOk} label="Diğer Kişisel Bilgiler" />
          <StatusPill ok={statuses.jobDetailsOk} label="İş Başvuru Detayları" />
          <span className="ml-auto text-sm">
            {allRequiredOk ? (
              <span className="text-green-700 font-medium">
                Tüm zorunlu bölümler hazır
              </span>
            ) : (
              <span className="text-gray-600">
                Lütfen tüm zorunlu bölümleri tamamlayın
              </span>
            )}
          </span>
        </div>
      </div>

      {/* === CONTENT SECTIONS === */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-8 mt-6">
        <Section
          icon={faUser}
          title="Kişisel Bilgiler"
          required
          content={
            <PersonalInformation
              ref={personalInfoRef}
              onValidChange={onPersonalValidChange}
            />
          }
        />

        <Section
          icon={faGraduationCap}
          title="Eğitim Bilgileri"
          required
          onAdd={onAddWithScrollLock(() =>
            educationTableRef.current?.openCreate()
          )}
          content={
            <EducationTable
              ref={educationTableRef}
              //onHasAnyRowChange={onEducationHasRowChange}
              onValidChange={onEducationHasRowChange}
            />
          }
        />

        <Section
          icon={faAward}
          title="Sertifika ve Eğitimler"
          onAdd={onAddWithScrollLock(() =>
            certificatesTableRef.current?.openCreate()
          )}
          content={<CertificateTable ref={certificatesTableRef} />}
        />

        <Section
          icon={faLaptopCode}
          title="Bilgisayar Bilgileri"
          onAdd={onAddWithScrollLock(() =>
            computerInformationTableRef.current?.openCreate()
          )}
          content={
            <ComputerInformationTable ref={computerInformationTableRef} />
          }
        />

        <Section
          icon={faLanguage}
          title="Yabancı Dil Bilgisi"
          onAdd={onAddWithScrollLock(() =>
            languageTableRef.current?.openCreate()
          )}
          content={<LanguageTable ref={languageTableRef} />}
        />

        <Section
          icon={faBriefcase}
          title="İş Deneyimleri"
          onAdd={onAddWithScrollLock(() =>
            jobExperiencesTableRef.current?.openCreate()
          )}
          content={<JobExperiencesTable ref={jobExperiencesTableRef} />}
        />

        <Section
          icon={faPhoneVolume}
          title="Referanslar"
          onAdd={onAddWithScrollLock(() =>
            referencesTableRef.current?.openCreate()
          )}
          content={<ReferencesTable ref={referencesTableRef} />}
        />

        <Section
          icon={faUserCog}
          title="Diğer Kişisel Bilgiler"
          required
          content={
            <OtherPersonalInformationTable
              ref={otherPersonalInformationTableRef}
              onValidChange={onOtherValidChange}
            />
          }
        />

        <Section
          icon={faFileSignature}
          title="İş Başvuru Detayları"
          required
          content={
            <JobApplicationDetails
              ref={jobApplicationDetailsRef}
              onValidChange={onJobDetailsValidChange}
            />
          }
        />

        {/* Başvuru onay akışı (butona basıldığında yine tam doğrulama yapacağız) */}
        <ApplicationConfirmSection
          validatePersonalInfo={() =>
            personalInfoRef.current?.isValid?.() ?? false
          }
          educationRef={educationTableRef}
          otherInfoRef={otherPersonalInformationTableRef}
          validateJobDetails={() =>
            jobApplicationDetailsRef.current?.isValid?.() ?? false
          }
        />
      </div>
    </div>
  );
}

/* ---------- Status Pill ---------- */
function StatusPill({ ok, label }) {
  let icon = faCircleMinus;
  let cls =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border";
  if (ok === true) {
    icon = faCheckCircle;
    cls += " bg-green-50 text-green-700 border-green-200";
  } else if (ok === false) {
    icon = faCircleXmark;
    cls += " bg-red-50 text-red-700 border-red-200";
  } else {
    cls += " bg-gray-50 text-gray-600 border-gray-200";
  }
  return (
    <span className={cls}>
      <FontAwesomeIcon icon={icon} />
      {label}
    </span>
  );
}

/* --- Section Template --- */
function Section({ icon, title, required = false, onAdd, content }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4">
          <FontAwesomeIcon
            icon={icon}
            className="text-amber-50 text-2xl sm:text-3xl shrink-0"
          />
          <h4 className="text-base sm:text-lg md:text-xl font-semibold text-amber-50 truncate flex items-center gap-2">
            {title}
            {required && <span className="text-red-500">*</span>}
          </h4>
        </div>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium rounded-md transition duration-150 ease-in-out focus:outline-none text-sm sm:text-base active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Ekle</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-gray-50 text-gray-900">{content}</div>
    </div>
  );
}
