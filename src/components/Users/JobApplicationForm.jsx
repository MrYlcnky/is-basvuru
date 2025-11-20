// src/components/Users/JobApplicationForm.jsx
import { useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  faInfoCircle,
  faGlobe,
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
import LanguageSwitcher from "../LanguageSwitcher";

// YENİ LOGO IMPORTU
// import logo from "../../assets/logo.jpg";

export default function JobApplicationForm() {
  const { t } = useTranslation();

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

  /* ---------- Scroll-to-Section & Highlight ---------- */
  const [, setHighlightId] = useState(null);

  const scrollToSection = useCallback((targetId, offset = 100) => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.scrollY - Math.max(offset, 0);

    window.scrollTo({ top: y, behavior: "smooth" });

    // Kısa süreli highlight (Amber tonu ile uyumlu)
    setHighlightId(targetId);
    el.classList.add(
      "ring-2",
      "ring-amber-500",
      "ring-offset-2",
      "ring-offset-[#0f172a]", // Offset rengi arka planla aynı
      "transition-all",
      "duration-500"
    );

    setTimeout(() => {
      el.classList.remove(
        "ring-2",
        "ring-amber-500",
        "ring-offset-2",
        "ring-offset-[#0f172a]",
        "transition-all",
        "duration-500"
      );
      setHighlightId(null);
    }, 1600);
  }, []);

  // Section id sabitleri
  const SECTION_IDS = {
    personal: "section-personal",
    education: "section-education",
    other: "section-other",
    jobDetails: "section-jobdetails",
  };

  return (
    // GÜNCELLEME 1: Radial Gradient Arka Plan (Derinlik Hissi)
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#334155] via-[#0f172a] to-black pb-10 shadow-2xl border-x border-gray-800/50">
      {/* === HERO HEADER === */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#111827] to-black py-12 sm:py-16 md:py-20 shadow-2xl rounded-b-2xl text-center border-b border-gray-800">
        {/* Sağ üst dil seçici */}
        <div className="absolute flex flex-row top-4 right-4 z-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700 transition-colors">
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-gray-400"
              aria-hidden="true"
            />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center">
          {/* BAŞLIKLAR */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-white drop-shadow-lg leading-tight font-sans">
            {t("hero.brand")}
          </h1>
          <h2 className="mt-3 text-lg sm:text-xl font-light text-gray-300 tracking-[0.2em] uppercase opacity-80">
            {t("hero.formTitle")}
          </h2>

          {/* BİLGİ MESAJI */}
          <div className="mt-8 flex items-center gap-2 text-sm sm:text-base text-gray-400 bg-gray-900/60 px-5 py-2.5 rounded-full border border-gray-800/50 shadow-sm backdrop-blur-sm">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-red-500 text-lg"
            />
            <span>
              <span className="text-red-500 font-bold tracking-wide">
                {t("hero.please")}
              </span>{" "}
              <span className="text-gray-300">{t("hero.notice")}</span>{" "}
              <span className="text-red-500 font-bold mx-1">*</span>{" "}
              <span className="text-gray-300">{t("hero.requiredSuffix")}</span>
            </span>
          </div>

          {/* Dekoratif Çizgi */}
          <div className="mt-10 w-24 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent rounded-full opacity-60" />
        </div>

        {/* Arka plan dekoratif glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-amber-900/5 to-transparent pointer-events-none" />
      </div>

      {/* === Zorunlu Bilgiler (Sticky Status Bar) === */}
      <div className="sticky top-4 z-40 container mx-auto px-3 sm:px-6 lg:px-10 mt-6">
        {/* GÜNCELLEME 2: Daha Şeffaf ve Blur Efektli "Glassy" Bar */}
        <div className="bg-[#1e293b]/70 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
          {/* Sol: Genel Durum */}
          <div className="flex items-center gap-3 border-b md:border-b-0 border-slate-700 pb-2 md:pb-0 w-full md:w-auto justify-center md:justify-start">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 shadow-inner ${
                allRequiredOk
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-red-500 bg-red-500/10 text-red-400"
              }`}
            >
              <FontAwesomeIcon
                icon={allRequiredOk ? faCheckCircle : faCircleXmark}
                className="text-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {t("statusBar.title")}
              </span>
              <span
                className={`text-sm font-bold ${
                  allRequiredOk ? "text-green-400" : "text-red-400"
                }`}
              >
                {allRequiredOk
                  ? t("statusBar.completed")
                  : t("statusBar.missing")}
              </span>
            </div>
          </div>

          {/* Sağ: İlerleme Hapları */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-auto">
            <StatusPill
              ok={statuses.personalOk}
              label={t("sections.personal")}
              icon={faUser}
              onClick={() => scrollToSection(SECTION_IDS.personal)}
            />
            <StatusPill
              ok={statuses.educationOk}
              label={t("sections.education")}
              icon={faGraduationCap}
              onClick={() => scrollToSection(SECTION_IDS.education)}
            />
            <StatusPill
              ok={statuses.otherOk}
              label={t("sections.other")}
              icon={faUserCog}
              onClick={() => scrollToSection(SECTION_IDS.other)}
            />
            <StatusPill
              ok={statuses.jobDetailsOk}
              label={t("sections.jobDetails")}
              icon={faFileSignature}
              onClick={() => scrollToSection(SECTION_IDS.jobDetails)}
            />
          </div>
        </div>
      </div>

      {/* === CONTENT SECTIONS === */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-8 mt-8">
        <Section
          id={SECTION_IDS.personal}
          icon={faUser}
          title={t("sections.personal")}
          required
          content={
            <PersonalInformation
              ref={personalInfoRef}
              onValidChange={onPersonalValidChange}
            />
          }
        />

        <Section
          id={SECTION_IDS.education}
          icon={faGraduationCap}
          title={t("sections.education")}
          required
          onAdd={onAddWithScrollLock(() =>
            educationTableRef.current?.openCreate()
          )}
          content={
            <EducationTable
              ref={educationTableRef}
              onValidChange={onEducationHasRowChange}
            />
          }
        />

        <Section
          icon={faAward}
          title={t("sections.certificates")}
          onAdd={onAddWithScrollLock(() =>
            certificatesTableRef.current?.openCreate()
          )}
          content={<CertificateTable ref={certificatesTableRef} />}
        />

        <Section
          icon={faLaptopCode}
          title={t("sections.computer")}
          onAdd={onAddWithScrollLock(() =>
            computerInformationTableRef.current?.openCreate()
          )}
          content={
            <ComputerInformationTable ref={computerInformationTableRef} />
          }
        />

        <Section
          icon={faLanguage}
          title={t("sections.languages")}
          onAdd={onAddWithScrollLock(() =>
            languageTableRef.current?.openCreate()
          )}
          content={<LanguageTable ref={languageTableRef} />}
        />

        <Section
          icon={faBriefcase}
          title={t("sections.experience")}
          onAdd={onAddWithScrollLock(() =>
            jobExperiencesTableRef.current?.openCreate()
          )}
          content={<JobExperiencesTable ref={jobExperiencesTableRef} />}
        />

        <Section
          icon={faPhoneVolume}
          title={t("sections.references")}
          onAdd={onAddWithScrollLock(() =>
            referencesTableRef.current?.openCreate()
          )}
          content={<ReferencesTable ref={referencesTableRef} />}
        />

        <Section
          id={SECTION_IDS.other}
          icon={faUserCog}
          title={t("sections.other")}
          required
          content={
            <OtherPersonalInformationTable
              ref={otherPersonalInformationTableRef}
              onValidChange={onOtherValidChange}
            />
          }
        />

        <Section
          id={SECTION_IDS.jobDetails}
          icon={faFileSignature}
          title={t("sections.jobDetails")}
          required
          content={
            <JobApplicationDetails
              ref={jobApplicationDetailsRef}
              onValidChange={onJobDetailsValidChange}
            />
          }
        />

        {/* Başvuru onay akışı */}
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

/* ---------- Status Pill (Modernize Edilmiş) ---------- */
function StatusPill({ ok, label, icon, onClick }) {
  let cls =
    "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 select-none focus:outline-none cursor-pointer active:scale-95";

  // Varsayılan
  let colors =
    "bg-[#1e293b] border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white";

  if (ok === true) {
    // Yeşil Glow
    colors =
      "bg-green-900/20 border-green-500/40 text-green-400 hover:bg-green-900/40 hover:text-green-300 shadow-[0_0_10px_rgba(74,222,128,0.1)]";
  } else if (ok === false) {
    // Kırmızı Glow
    colors =
      "bg-red-900/20 border-red-500/40 text-red-400 hover:bg-red-900/40 hover:text-red-300 shadow-[0_0_10px_rgba(248,113,113,0.1)]";
  }

  return (
    <button
      type="button"
      className={`${cls} ${colors}`}
      title={`${label} bölümüne git`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="text-sm" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

/* --- Section Template (Güncellenmiş: Amber Buton & Yumuşak İçerik) --- */
function Section({ id, icon, title, required = false, onAdd, content }) {
  const { t } = useTranslation();
  return (
    <div
      id={id}
      className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-lg overflow-hidden transition-all hover:border-slate-600 hover:shadow-2xl"
    >
      {/* Kart Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-5 sm:px-6 py-5 border-b border-slate-700/80">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/50 border border-slate-700 shadow-inner">
            <FontAwesomeIcon
              icon={icon}
              className="text-slate-300 text-lg sm:text-xl shrink-0"
            />
          </div>

          <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 truncate flex items-center gap-2 tracking-tight">
            {title}
            {required && (
              <span
                className="text-red-400 text-sm align-top"
                title={t("hero.required")}
              >
                *
              </span>
            )}
          </h4>
        </div>

        {/* GÜNCELLEME 3: Amber (Gold) Buton - Temaya Uyumlu */}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow-lg shadow-amber-900/20 transition-all duration-200 focus:outline-none text-sm active:scale-95 border border-amber-500/20"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>{t("actions.add")}</span>
          </button>
        )}
      </div>

      {/* GÜNCELLEME 4: İçerik Alanı (Yumuşatılmış Kontrast) */}
      <div className="overflow-x-auto bg-slate-50 text-slate-800 border-t border-slate-200/50">
        {content}
      </div>
    </div>
  );
}
