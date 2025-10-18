import { useRef } from "react";
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

          <p className="mt-5 text-base sm:text-lg text-gray-300">
            <span className="text-amber-300 font-semibold">Lütfen</span> tüm
            bilgilerinizi dikkatli ve eksiksiz doldurunuz.
          </p>

          <div className="mt-6 mx-auto w-24 sm:w-32 h-[3px] bg-gradient-to-r from-gray-200 via-amber-300 to-gray-200 rounded-full" />
        </div>

        {/* Arka plan glow */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-amber-100/10 blur-3xl rounded-full" />
      </div>

      {/* === CONTENT SECTIONS === */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-8 mt-8">
        <Section
          icon={faUser}
          title="Kişisel Bilgiler"
          content={<PersonalInformation ref={personalInfoRef} />}
        />

        <Section
          icon={faGraduationCap}
          title="Eğitim Bilgileri"
          onAdd={() => educationTableRef.current?.openCreate()}
          content={<EducationTable ref={educationTableRef} />}
        />

        <Section
          icon={faAward}
          title="Sertifika ve Eğitimler"
          onAdd={() => certificatesTableRef.current?.openCreate()}
          content={<CertificateTable ref={certificatesTableRef} />}
        />

        <Section
          icon={faLaptopCode}
          title="Bilgisayar Bilgileri"
          onAdd={() => computerInformationTableRef.current?.openCreate()}
          content={
            <ComputerInformationTable ref={computerInformationTableRef} />
          }
        />

        <Section
          icon={faLanguage}
          title="Yabancı Dil Bilgisi"
          onAdd={() => languageTableRef.current?.openCreate()}
          content={<LanguageTable ref={languageTableRef} />}
        />

        <Section
          icon={faBriefcase}
          title="İş Deneyimleri"
          onAdd={() => jobExperiencesTableRef.current?.openCreate()}
          content={<JobExperiencesTable ref={jobExperiencesTableRef} />}
        />

        <Section
          icon={faPhoneVolume}
          title="Referanslar"
          onAdd={() => referencesTableRef.current?.openCreate()}
          content={<ReferencesTable ref={referencesTableRef} />}
        />

        <Section
          icon={faUserCog}
          title="Diğer Kişisel Bilgiler"
          content={
            <OtherPersonalInformationTable
              ref={otherPersonalInformationTableRef}
            />
          }
        />

        <Section
          icon={faFileSignature}
          title="İş Başvuru Detayları"
          content={<JobApplicationDetails ref={jobApplicationDetailsRef} />}
        />

        {/* ✅ Onay Kartları ve Başvur Butonu */}
        <ApplicationConfirmSection
          validatePersonalInfo={() =>
            personalInfoRef.current?.isValid?.() ?? false
          } // örnek olarak: PersonalInformation bileşeninden validasyon dönecek
          educationRef={educationTableRef}
          otherInfoRef={otherPersonalInformationTableRef}
          validateJobDetails={() =>
            jobApplicationDetailsRef.current?.isValid?.() ?? false
          } // JobApplicationDetails doğrulaması
        />
      </div>
    </div>
  );
}

/* --- Section Template --- */
function Section({ icon, title, onAdd, content }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4">
          <FontAwesomeIcon
            icon={icon}
            className="text-amber-50 text-2xl sm:text-3xl shrink-0"
          />
          <h4 className="text-base sm:text-lg md:text-xl font-semibold text-amber-50 truncate">
            {title}
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

      {/* İçerik */}
      <div className="overflow-x-auto bg-gray-50 text-gray-900">{content}</div>
    </div>
  );
}
